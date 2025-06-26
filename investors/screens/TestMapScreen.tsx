import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import OpenStreetMapView from '../components/maps/OpenStreetMapView';

const TestMapScreen = () => {
   const [loading, setLoading] = useState(false);

   // Define some test markers
   const testMarkers = [
      {
         lat: 6.6018,
         lng: -0.1857,
         title: 'Maize Farm Project',
         description: 'Growing organic maize varieties',
      },
      {
         lat: 5.5913,
         lng: -0.2087,
         title: 'Avocado Farm',
         description: 'Sustainable avocado farming',
      },
      {
         lat: 9.082,
         lng: 8.6753,
         title: 'Cassava Processing',
         description: 'Processing cassava into flour and chips',
      },
   ];

   return (
      <View style={styles.container}>
         <Text style={styles.title}>Project Locations Map Test</Text>

         <View style={styles.mapContainer}>
            <OpenStreetMapView
               center={{ lat: 6.6018, lng: -0.1857 }}
               zoom={6}
               markers={testMarkers}
            />
         </View>

         <Text style={styles.footer}>
            Using OpenStreetMap to display project locations
         </Text>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fff',
   },
   title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
      textAlign: 'center',
   },
   mapContainer: {
      height: 400,
      borderRadius: 10,
      overflow: 'hidden',
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#ddd',
   },
   footer: {
      fontSize: 14,
      color: '#666',
      textAlign: 'center',
   },
});

export default TestMapScreen;
