import React, { useEffect, useState, useRef } from 'react';
import {
   View,
   Text,
   StyleSheet,
   SafeAreaView,
   ActivityIndicator,
   FlatList,
   TouchableOpacity,
   Animated,
   Dimensions,
   Image,
   Platform,
   StatusBar,
   Pressable,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import OpenStreetMapView from '../components/maps/OpenStreetMapView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/Colors';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { ThemedText } from '../components/ThemedText';

// Get device dimensions
const { width, height } = Dimensions.get('window');

// Define interfaces for our data types
interface Location {
   lat: number;
   lng: number;
}

interface Project {
   _id: string;
   title?: string;
   name?: string;
   description?: string;
   category?: string;
   duration?: string;
   returnRate?: number;
   totalRaised?: number;
   investmentGoal?: number;
   location?: {
      lat: number;
      lng: number;
      address?: string;
   };
   imageUrl?: string;
   images?: string[]; // Make sure this is defined in the interface
}

interface Marker {
   lat: number;
   lng: number;
   title?: string;
   description?: string;
   id?: string;
   selected?: boolean;
}

interface Investment {
   _id: string;
   project: Project;
   amount?: number;
}

const MapViewScreen = () => {
   const router = useRouter();
   const [loading, setLoading] = useState(true);
   const [projects, setProjects] = useState<Project[]>([]);
   const [selectedLocation, setSelectedLocation] = useState<Location>({
      lat: 7.3697, // Default to central Cameroon (Yaoundé)
      lng: 12.3547,
   });
   const [selectedProject, setSelectedProject] = useState<Project | null>(null);
   const [error, setError] = useState<string | null>(null);
   const { projectId } = useLocalSearchParams<{ projectId?: string }>();

   // Animated values - We're not using the animation for now since we've hidden the detail panel
   const detailPanelHeight = useRef(new Animated.Value(0)).current;
   const mapViewHeight = useRef(new Animated.Value(height * 0.6)).current; // Keeping this constant now

   // Define Cameroon bounding box
   const CAMEROON_BOUNDS = {
      north: 13.0833, // Northern-most latitude
      south: 1.6546, // Southern-most latitude
      west: 8.3822, // Western-most longitude
      east: 16.1921, // Eastern-most longitude
   };

   // Define region centers for different crop types
   const CAMEROON_REGIONS = {
      maize: {
         lat: 10.2,
         lng: 14.3,
         radius: 0.5,
      },
      coffee: {
         lat: 5.5,
         lng: 10.4,
         radius: 0.3,
      },
      avocado: {
         lat: 4.2,
         lng: 9.3,
         radius: 0.4,
      },
      rice: {
         lat: 8.6,
         lng: 13.7,
         radius: 0.6,
      },
      banana: {
         lat: 4.05,
         lng: 9.76,
         radius: 0.4,
      },
      default: {
         lat: 7.3697, // Central Cameroon (near Yaoundé)
         lng: 12.3547,
         radius: 2.0,
      },
   };

   // Check if coordinates are within Cameroon
   const isInCameroon = (lat: number, lng: number): boolean => {
      return (
         lat >= CAMEROON_BOUNDS.south &&
         lat <= CAMEROON_BOUNDS.north &&
         lng >= CAMEROON_BOUNDS.west &&
         lng <= CAMEROON_BOUNDS.east
      );
   };

   // Generate random coordinates within Cameroon based on project category
   const getCameroonCoordinates = (
      project: Project
   ): { lat: number; lng: number } => {
      const category = project.category?.toLowerCase() || '';
      let region = CAMEROON_REGIONS.default;

      if (category.includes('maize')) region = CAMEROON_REGIONS.maize;
      else if (category.includes('coffee')) region = CAMEROON_REGIONS.coffee;
      else if (category.includes('avocado')) region = CAMEROON_REGIONS.avocado;
      else if (category.includes('rice')) region = CAMEROON_REGIONS.rice;
      else if (category.includes('banana')) region = CAMEROON_REGIONS.banana;

      // Add some random variation within the region
      const randomLat = region.lat + (Math.random() - 0.5) * region.radius;
      const randomLng = region.lng + (Math.random() - 0.5) * region.radius;

      return {
         lat: randomLat,
         lng: randomLng,
      };
   };

   // Ensure project coordinates are within Cameroon
   const ensureProjectInCameroon = (project: Project): Project => {
      const updatedProject = { ...project };

      // If location exists but is outside Cameroon, or doesn't exist at all
      if (
         !project.location?.lat ||
         !project.location?.lng ||
         !isInCameroon(project.location.lat, project.location.lng)
      ) {
         const cameroonCoords = getCameroonCoordinates(project);
         updatedProject.location = {
            ...updatedProject.location,
            lat: cameroonCoords.lat,
            lng: cameroonCoords.lng,
         };
      }

      return updatedProject;
   };

   // The functions getCameroonCoordinates and ensureProjectInCameroon are already defined above

   // Fetch projects data
   const fetchProjects = async () => {
      try {
         setLoading(true);
         const token = await AsyncStorage.getItem('token');

         // Fetch projects the user has invested in
         // Make sure we have a valid token
         if (!token) {
            console.error('No authentication token found');
            throw new Error('Authentication required');
         }

         const response = await fetch(
            'http://172.20.10.5:5000/api/investments/my-investments',
            {
               headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
               },
            }
         );

         if (!response.ok) {
            throw new Error('Failed to fetch projects');
         }

         const investments = (await response.json()) as Investment[];

         // Extract unique projects
         const uniqueProjectsMap: Record<string, Project> = {};

         investments.forEach((investment) => {
            if (investment.project && investment.project._id) {
               uniqueProjectsMap[investment.project._id] = investment.project;
            }
         });

         // Ensure all projects have valid Cameroon coordinates
         const processedProjects = Object.values(uniqueProjectsMap).map(
            (project) => ensureProjectInCameroon(project)
         );

         setProjects(processedProjects);

         // If projectId is provided, try to find that specific project
         if (projectId) {
            const projectToSelect = processedProjects.find(
               (project) => project._id === projectId
            );

            if (projectToSelect?.location) {
               // Always use the project's location, which is now guaranteed to be in Cameroon
               setSelectedLocation({
                  lat: projectToSelect.location.lat,
                  lng: projectToSelect.location.lng,
               });
               setSelectedProject(projectToSelect);
               showProjectDetails();
            }
         }
         // Otherwise, use the first project with location data
         else {
            const projectWithLocation = processedProjects.find(
               (project) => project.location?.lat && project.location?.lng
            );

            if (projectWithLocation?.location) {
               setSelectedLocation({
                  lat: projectWithLocation.location.lat,
                  lng: projectWithLocation.location.lng,
               });
            } else {
               // If no project has location data, default to central Cameroon
               setSelectedLocation({
                  lat: CAMEROON_REGIONS.default.lat,
                  lng: CAMEROON_REGIONS.default.lng,
               });
            }
         }

         setError(null);
      } catch (err) {
         console.error('Error fetching projects for map:', err);
         setError('Failed to load project locations');
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchProjects();
   }, [projectId]); // Refetch when projectId changes

   // Convert projects to markers, ensuring all have valid Cameroon coordinates
   const getMarkers = (): Marker[] => {
      return projects
         .filter(
            (
               project
            ): project is Project & {
               location: { lat: number; lng: number };
            } =>
               project.location?.lat !== undefined &&
               project.location?.lng !== undefined &&
               isInCameroon(project.location.lat, project.location.lng)
         )
         .map((project) => {
            // Create a more detailed description for the marker popup
            let details = [];

            // Add project description if available
            if (project.description) {
               details.push(project.description);
            }

            // Add location information
            if (project.location.address) {
               details.push(`Location: ${project.location.address}`);
            }

            // Add category if available
            if (project.category) {
               details.push(`Category: ${project.category}`);
            }

            // Add duration if available
            if (project.duration) {
               details.push(`Duration: ${project.duration}`);
            }

            // Add return rate if available
            if (project.returnRate !== undefined) {
               details.push(`Return Rate: ${project.returnRate}%`);
            }

            // Join details with HTML line breaks
            const detailedDescription = details.join(' | ');

            return {
               lat: project.location.lat,
               lng: project.location.lng,
               title: project.title || project.name || 'Farm Project',
               description:
                  detailedDescription || 'Investment opportunity in Cameroon',
               id: project._id,
               selected: selectedProject?._id === project._id,
            };
         });
   };

   // Handle selecting a project to focus on map
   const handleSelectProject = (project: Project) => {
      if (project.location?.lat && project.location?.lng) {
         // Provide haptic feedback on selection
         Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

         setSelectedLocation({
            lat: project.location.lat,
            lng: project.location.lng,
         });

         setSelectedProject(project);
         showProjectDetails();
      }
   };

   const handleMarkerSelected = (markerId: string) => {
      const project = projects.find((p) => p._id === markerId);
      if (project) {
         handleSelectProject(project);
      }
   };

   // Handle showing project details panel - commented out for now
   const showProjectDetails = () => {
      // When a project is selected, we're not showing the detail panel anymore
      // Just keeping this function for future use if we want to re-enable the panel
      // // Animate the detail panel up
      // Animated.parallel([
      //    Animated.timing(detailPanelHeight, {
      //       toValue: 250,
      //       duration: 300,
      //       useNativeDriver: false,
      //    }),
      //    Animated.timing(mapViewHeight, {
      //       toValue: height * 0.5,
      //       duration: 300,
      //       useNativeDriver: false,
      //    }),
      // ]).start();
   };

   // Handle hiding project details panel - commented out for now
   const hideProjectDetails = () => {
      // Simply clear the selected project
      setSelectedProject(null);

      // // Animate the detail panel down
      // Animated.parallel([
      //    Animated.timing(detailPanelHeight, {
      //       toValue: 0,
      //       duration: 200,
      //       useNativeDriver: false,
      //    }),
      //    Animated.timing(mapViewHeight, {
      //       toValue: height * 0.6,
      //       duration: 200,
      //       useNativeDriver: false,
      //    }),
      // ]).start(() => {
      //    setSelectedProject(null);
      // });
   };

   // Navigate to project details
   const goToProjectDetails = (id: string) => {
      router.push({ pathname: '/product-details', params: { id } });
   };

   // Format percentages for display
   const formatPercentage = (value?: number) => {
      if (value === undefined) return 'N/A';
      return `${value}%`;
   };

   // Replace the getDefaultImage function with this version that mimics ProductCard approach
   const getProjectImage = (project: Project) => {
      // Check if the project has an images array with at least one image
      const firstImage =
         project.images && project.images.length > 0 ? project.images[0] : null;

      // If there's a first image in the array, use it
      if (firstImage) {
         return { uri: firstImage };
      }

      // Fall back to imageUrl if available
      if (project.imageUrl) {
         return { uri: project.imageUrl };
      }

      // Otherwise use category-based defaults
      const category = project.category?.toLowerCase() || '';
      if (category.includes('maize')) {
         return require('../assets/images/white_vex.jpg');
      } else if (category.includes('avocado')) {
         return require('../assets/images/white_vex.jpg');
      } else {
         return require('../assets/images/white_vex.jpg');
      }
   };

   return (
      <SafeAreaView style={styles.container}>
         <Stack.Screen
            options={{
               title: 'Project Locations',
               headerTitleStyle: styles.headerTitle,
               headerShadowVisible: false,
               headerStyle: { backgroundColor: Colors.light.background },
            }}
         />

         {loading ? (
            <View style={styles.loadingContainer}>
               <ActivityIndicator size="large" color={Colors.light.primary} />
               <Text style={styles.loadingText}>Loading map data...</Text>
            </View>
         ) : error ? (
            <View style={styles.errorContainer}>
               <Text style={styles.errorText}>{error}</Text>
               <TouchableOpacity
                  style={styles.retryButton}
                  onPress={fetchProjects}
               >
                  <Text style={styles.retryButtonText}>Retry</Text>
               </TouchableOpacity>
            </View>
         ) : (
            <>
               <Animated.View
                  style={[styles.mapContainer, { height: mapViewHeight }]}
               >
                  <OpenStreetMapView
                     center={selectedLocation}
                     zoom={10}
                     markers={getMarkers()}
                     containerStyle={styles.map}
                     onMarkerSelected={handleMarkerSelected}
                  />

                  {/* Map overlay with info and controls */}
                  <View style={styles.mapOverlay}>
                     <View style={styles.mapInfoPanel}>
                        <View style={styles.mapInfoContent}>
                           <Feather
                              name="map-pin"
                              size={14}
                              color={Colors.light.primary}
                           />
                           <Text style={styles.mapInfoText}>
                              {selectedProject?.location?.address ||
                                 `${selectedLocation.lat.toFixed(
                                    6
                                 )}, ${selectedLocation.lng.toFixed(6)}`}
                           </Text>
                        </View>
                     </View>
                  </View>
               </Animated.View>

               {/* Project detail panel - animated */}
               {/* Commented out modal panel
               {selectedProject && (
                  <Animated.View
                     style={[styles.detailPanel, { height: detailPanelHeight }]}
                  >
                     <BlurView
                        intensity={80}
                        tint="light"
                        style={styles.blurBackground}
                     >
                        <View style={styles.panelHeader}>
                           <View style={styles.panelHandle} />
                           <TouchableOpacity
                              style={styles.closeButton}
                              onPress={hideProjectDetails}
                           >
                              <Feather
                                 name="x"
                                 size={20}
                                 color={Colors.light.primary}
                              />
                           </TouchableOpacity>
                        </View>

                        <View style={styles.detailContent}>
                           <View style={styles.detailHeader}>
                              <ThemedText
                                 type="defaultSemiBold"
                                 style={styles.detailTitle}
                              >
                                 {selectedProject.title ||
                                    selectedProject.name ||
                                    'Farm Project'}
                              </ThemedText>

                              <TouchableOpacity
                                 style={styles.viewDetailsButton}
                                 onPress={() =>
                                    selectedProject._id &&
                                    goToProjectDetails(selectedProject._id)
                                 }
                              >
                                 <ThemedText
                                    type="link"
                                    style={styles.viewDetailsText}
                                 >
                                    View Details
                                 </ThemedText>
                                 <Feather
                                    name="arrow-right"
                                    size={16}
                                    color={Colors.light.primary}
                                 />
                              </TouchableOpacity>
                           </View>

                           <View style={styles.detailRow}>
                              <View style={styles.detailItem}>
                                 <Feather
                                    name="map"
                                    size={16}
                                    color={Colors.light.primary}
                                 />
                                 <Text style={styles.detailItemText}>
                                    {selectedProject.location?.address ||
                                       'Location Available'}
                                 </Text>
                              </View>

                              {selectedProject.category && (
                                 <View style={styles.detailItem}>
                                    <Feather
                                       name="tag"
                                       size={16}
                                       color={Colors.light.primary}
                                    />
                                    <Text style={styles.detailItemText}>
                                       {selectedProject.category}
                                    </Text>
                                 </View>
                              )}
                           </View>

                           <View style={styles.detailRow}>
                              {selectedProject.duration && (
                                 <View style={styles.detailItem}>
                                    <Feather
                                       name="clock"
                                       size={16}
                                       color={Colors.light.primary}
                                    />
                                    <Text style={styles.detailItemText}>
                                       {selectedProject.duration}
                                    </Text>
                                 </View>
                              )}

                              {selectedProject.returnRate !== undefined && (
                                 <View style={styles.detailItem}>
                                    <Feather
                                       name="trending-up"
                                       size={16}
                                       color={Colors.light.primary}
                                    />
                                    <Text style={styles.detailItemText}>
                                       {formatPercentage(
                                          selectedProject.returnRate
                                       )}{' '}
                                       Returns
                                    </Text>
                                 </View>
                              )}
                           </View>

                           {selectedProject.description && (
                              <Text
                                 numberOfLines={2}
                                 style={styles.description}
                              >
                                 {selectedProject.description}
                              </Text>
                           )}
                        </View>
                     </BlurView>
                  </Animated.View>
               )}
               */}

               {/* Project list section */}
               <View style={styles.projectListContainer}>
                  <View style={styles.sectionTitleContainer}>
                     <ThemedText
                        type="defaultSemiBold"
                        style={styles.sectionTitle}
                     >
                        Your Invested Projects
                     </ThemedText>
                     <Text style={styles.projectCount}>
                        {
                           projects.filter(
                              (p) => p.location?.lat && p.location?.lng
                           ).length
                        }{' '}
                        locations
                     </Text>
                  </View>

                  <FlatList
                     data={projects}
                     keyExtractor={(item) => item._id}
                     renderItem={({ item }) => (
                        <TouchableOpacity
                           style={[
                              styles.projectItem,
                              selectedProject?._id === item._id &&
                                 styles.selectedProjectItem,
                           ]}
                           onPress={() => handleSelectProject(item)}
                           disabled={!item.location?.lat || !item.location?.lng}
                        >
                           <View style={styles.projectItemContent}>
                              <Image
                                 source={getProjectImage(item)}
                                 style={styles.projectImage}
                                 resizeMode="cover"
                              />

                              <View style={styles.projectInfo}>
                                 <Text style={styles.projectTitle}>
                                    {item.title ||
                                       item.name ||
                                       'Unnamed Project'}
                                 </Text>

                                 {item.category && (
                                    <Text style={styles.projectCategory}>
                                       {item.category}
                                    </Text>
                                 )}

                                 {item.location?.lat && item.location?.lng ? (
                                    <View style={styles.locationContainer}>
                                       <Feather
                                          name="map-pin"
                                          size={12}
                                          color={Colors.light.primary}
                                          style={styles.locationIcon}
                                       />
                                       <Text style={styles.locationText}>
                                          {item.location.address ||
                                             `${item.location.lat.toFixed(
                                                4
                                             )}, ${item.location.lng.toFixed(
                                                4
                                             )}`}
                                       </Text>
                                    </View>
                                 ) : (
                                    <Text style={styles.noLocationText}>
                                       No location data available
                                    </Text>
                                 )}
                              </View>

                              <View style={styles.projectIndicator}>
                                 {item.location?.lat && item.location?.lng ? (
                                    <Feather
                                       name="chevron-right"
                                       size={20}
                                       color={
                                          selectedProject?._id === item._id
                                             ? Colors.light.primary
                                             : Colors.light.grayDark
                                       }
                                    />
                                 ) : (
                                    <Feather
                                       name="x"
                                       size={16}
                                       color={Colors.light.grayDark}
                                    />
                                 )}
                              </View>
                           </View>
                        </TouchableOpacity>
                     )}
                     contentContainerStyle={
                        projects.length === 0
                           ? styles.emptyListContent
                           : undefined
                     }
                     ListEmptyComponent={
                        <View style={styles.emptyListContainer}>
                           <Feather
                              name="map"
                              size={40}
                              color={Colors.light.grayDark}
                           />
                           <Text style={styles.noProjectsText}>
                              You haven't invested in any projects yet
                           </Text>
                           <TouchableOpacity
                              style={styles.exploreButton}
                              onPress={() => router.push('/(tabs)')}
                           >
                              <Text style={styles.exploreButtonText}>
                                 Explore Projects
                              </Text>
                           </TouchableOpacity>
                        </View>
                     }
                     showsVerticalScrollIndicator={false}
                  />
               </View>
            </>
         )}
      </SafeAreaView>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: Colors.light.background,
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
   },
   headerTitle: {
      fontWeight: 'bold',
      fontSize: 18,
   },
   loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   loadingText: {
      marginTop: 10,
      color: '#555',
      fontSize: 16,
   },
   errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
   },
   errorText: {
      color: Colors.light.error,
      fontSize: 16,
      marginBottom: 20,
      textAlign: 'center',
   },
   retryButton: {
      backgroundColor: Colors.light.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
   },
   retryButtonText: {
      color: '#fff',
      fontWeight: 'bold',
   },
   mapContainer: {
      height: height * 0.6,
      position: 'relative',
   },
   map: {
      width: '100%',
      height: '100%',
      borderRadius: 0,
   },
   mapOverlay: {
      position: 'absolute',
      top: 10,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
   },
   mapInfoPanel: {
      backgroundColor: 'rgba(255,255,255,0.9)',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
   },
   mapInfoContent: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   mapInfoText: {
      fontSize: 12,
      marginLeft: 4,
      color: '#555',
   },
   detailPanel: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 0,
      zIndex: 10,
      overflow: 'hidden',
   },
   blurBackground: {
      flex: 1,
      overflow: 'hidden',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
   },
   panelHeader: {
      alignItems: 'center',
      paddingVertical: 10,
      width: '100%',
      position: 'relative',
   },
   panelHandle: {
      width: 40,
      height: 5,
      borderRadius: 3,
      backgroundColor: 'rgba(0,0,0,0.2)',
   },
   closeButton: {
      position: 'absolute',
      right: 16,
      top: 8,
      width: 30,
      height: 30,
      backgroundColor: 'rgba(255,255,255,0.9)',
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
      zIndex: 10,
   },
   detailContent: {
      flex: 1,
      paddingHorizontal: 16,
      paddingBottom: 16,
   },
   detailHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
   },
   detailTitle: {
      fontSize: 18,
      fontWeight: '600',
      flex: 1,
   },
   viewDetailsButton: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   viewDetailsText: {
      marginRight: 4,
      fontSize: 14,
   },
   detailRow: {
      flexDirection: 'row',
      marginBottom: 8,
   },
   detailItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
   },
   detailItemText: {
      marginLeft: 6,
      fontSize: 14,
      color: '#555',
   },
   description: {
      marginTop: 8,
      fontSize: 14,
      color: '#555',
      lineHeight: 20,
   },
   projectListContainer: {
      flex: 1,
   },
   sectionTitleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: Colors.light.border,
      backgroundColor: Colors.light.background,
   },
   sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
   },
   projectCount: {
      fontSize: 14,
      color: '#777',
   },
   projectItem: {
      backgroundColor: Colors.light.background,
      borderBottomWidth: 1,
      borderBottomColor: Colors.light.border,
   },
   projectItemContent: {
      flexDirection: 'row',
      padding: 12,
      alignItems: 'center',
   },
   selectedProjectItem: {
      backgroundColor: Colors.light.primaryLightnew,
      borderLeftWidth: 4,
      borderLeftColor: Colors.light.primary,
   },
   projectImage: {
      width: 50,
      height: 50,
      borderRadius: 8,
      backgroundColor: '#f0f0f0',
   },
   projectInfo: {
      flex: 1,
      paddingHorizontal: 12,
   },
   projectTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 2,
      color: Colors.light.text,
   },
   projectCategory: {
      fontSize: 13,
      color: '#666',
      marginBottom: 4,
   },
   locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   locationIcon: {
      marginRight: 4,
   },
   locationText: {
      fontSize: 13,
      color: '#666',
   },
   noLocationText: {
      fontSize: 13,
      color: '#999',
      fontStyle: 'italic',
   },
   projectIndicator: {
      marginLeft: 8,
   },
   emptyListContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
   },
   emptyListContent: {
      flexGrow: 1,
      justifyContent: 'center',
   },
   noProjectsText: {
      marginTop: 16,
      textAlign: 'center',
      color: '#777',
      fontSize: 16,
   },
   exploreButton: {
      marginTop: 20,
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: Colors.light.primary,
      borderRadius: 8,
   },
   exploreButtonText: {
      color: '#fff',
      fontWeight: '600',
   },
});

export default MapViewScreen;
