import React, { useEffect, useRef } from 'react';
import {
   View,
   StyleSheet,
   StyleProp,
   ViewStyle,
   ActivityIndicator,
} from 'react-native';
import WebView from 'react-native-webview';
import { Colors } from '../../constants/Colors';

interface Marker {
   lat: number;
   lng: number;
   title?: string;
   description?: string;
   id?: string;
   selected?: boolean;
}

interface OpenStreetMapViewProps {
   center: {
      lat: number;
      lng: number;
   };
   zoom: number;
   markers?: Marker[];
   style?: StyleProp<ViewStyle>;
   containerStyle?: StyleProp<ViewStyle>;
   onLocationSelected?: (location: { lat: number; lng: number }) => void;
   onMarkerSelected?: (markerId: string) => void;
}

const OpenStreetMapView: React.FC<OpenStreetMapViewProps> = ({
   center,
   zoom = 13,
   markers = [],
   style,
   containerStyle,
   onLocationSelected,
   onMarkerSelected,
}) => {
   const webViewRef = useRef<WebView>(null);

   // Update map center when the center prop changes
   useEffect(() => {
      if (webViewRef.current) {
         webViewRef.current.injectJavaScript(`
            try {
               map.setView([${center.lat}, ${center.lng}], ${zoom});
            } catch(e) {
               console.error('Error updating map center:', e);
            }
            true;
         `);
      }
   }, [center.lat, center.lng, zoom]);

   // Create HTML content with LeafletJS
   const getMapHTML = () => {
      const markersList = markers
         .map((marker, index) => {
            const markerOptions = marker.selected
               ? `{icon: selectedIcon}`
               : '{}';

            const popupContent = `
               const marker${index} = L.marker([${marker.lat}, ${
               marker.lng
            }], ${markerOptions}).addTo(map);
               ${
                  marker.title
                     ? `
               marker${index}.bindPopup(
                  '<div class="custom-popup">' +
                  '<h3>${marker.title}</h3>' +
                  ${
                     marker.description
                        ? `'<p>${marker.description}</p>' +`
                        : ''
                  } 
                  '<div class="popup-button" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({type: \\'markerClick\\', id: \\'${
                     marker.id
                  }\\'}))">View Details</div>' +
                  '</div>',
                  { className: 'custom-popup' }
               );
               `
                     : ''
               }
               ${
                  marker.id
                     ? `
               marker${index}.on('click', function() {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                     type: 'markerClick',
                     id: '${marker.id}'
                  }));
               });
               `
                     : ''
               }
            `;

            return popupContent;
         })
         .join('\n');

      return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
          <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
          <style>
            body {
              padding: 0;
              margin: 0;
            }
            #map {
              width: 100%;
              height: 100vh;
            }
            .custom-popup {
              text-align: center;
              min-width: 200px;
            }
            .custom-popup h3 {
              margin: 0;
              padding: 5px 0;
              color: #16a34a;
              font-weight: bold;
            }
            .custom-popup p {
              margin: 0;
              padding: 6px 0;
              color: #333;
              font-size: 14px;
              line-height: 1.4;
            }
            .popup-button {
              background-color: #16a34a;
              color: white;
              padding: 8px 12px;
              margin-top: 8px;
              border-radius: 4px;
              font-weight: bold;
              font-size: 14px;
              cursor: pointer;
              display: inline-block;
            }
            .leaflet-control-zoom {
              border: none !important;
              box-shadow: 0 2px 5px rgba(0,0,0,0.1) !important;
            }
            .leaflet-control-zoom a {
              background-color: white !important;
              color: #16a34a !important;
              border-bottom: 1px solid #eee !important;
              transition: all 0.2s ease !important;
            }
            .leaflet-control-zoom a:hover {
              background-color: #f5f5f5 !important;
              color: #22c55e !important;
            }
            .leaflet-control-attribution {
              font-size: 10px !important;
              background-color: rgba(255,255,255,0.7) !important;
              padding: 2px 5px !important;
            }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            // Custom markers
            const defaultIcon = L.icon({
              iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
              shadowSize: [41, 41]
            });
            
            const selectedIcon = L.icon({
              iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
              shadowSize: [41, 41]
            });
            
            const map = L.map('map', {
              zoomControl: true,
              attributionControl: true
            }).setView([${center.lat}, ${center.lng}], ${zoom});
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19,
              attribution: '© OpenStreetMap | FarmFi'
            }).addTo(map);
            
            ${markersList}
            
            // Handle clicks if location selection is enabled
            ${
               onLocationSelected
                  ? `
              map.on('click', function(e) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'mapClick',
                  lat: e.latlng.lat,
                  lng: e.latlng.lng
                }));
              });
            `
                  : ''
            }
            
            // Add scale control
            L.control.scale({position: 'bottomleft', imperial: false}).addTo(map);
          </script>
        </body>
      </html>
    `;
   };

   const handleMessage = (event: any) => {
      try {
         const data = JSON.parse(event.nativeEvent.data);
         if (data.type === 'mapClick' && onLocationSelected) {
            onLocationSelected({
               lat: data.lat,
               lng: data.lng,
            });
         } else if (
            data.type === 'markerClick' &&
            onMarkerSelected &&
            data.id
         ) {
            onMarkerSelected(data.id);
         }
      } catch (error) {
         console.error('Error parsing WebView message:', error);
      }
   };

   return (
      <View style={[styles.container, containerStyle]}>
         <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            source={{ html: getMapHTML() }}
            style={[styles.map, style]}
            onMessage={handleMessage}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            renderLoading={() => (
               <View style={styles.loadingContainer}>
                  <ActivityIndicator
                     size="large"
                     color={Colors.light.primary}
                  />
               </View>
            )}
            startInLoadingState={true}
         />
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      overflow: 'hidden',
      borderRadius: 10,
      height: 300,
      width: '100%',
      backgroundColor: '#f5f5f5',
   },
   map: {
      flex: 1,
   },
   loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.8)',
   },
});

export default OpenStreetMapView;
