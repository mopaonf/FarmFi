import React, { useState, useEffect, useRef } from 'react';
import {
   View,
   Text,
   Image,
   TouchableOpacity,
   Dimensions,
   ScrollView,
   SafeAreaView,
   ActivityIndicator,
   NativeSyntheticEvent,
   NativeScrollEvent,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { height, width } = Dimensions.get('window');

interface Slide {
   uri?: string;
   default?: any;
}

const ProductDetailsScreen: React.FC = () => {
   const [activeTab, setActiveTab] = useState('about');
   const [currentSlide, setCurrentSlide] = useState(0);
   const [project, setProject] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const navigation = useNavigation();
   const router = useRouter();
   const { id } = useLocalSearchParams();
   const scrollViewRef = useRef<ScrollView>(null);

   // Ensure hooks are not conditionally rendered
   const slides = React.useMemo(() => {
      if (
         project &&
         Array.isArray(project.photos) &&
         project.photos.length > 0
      ) {
         return project.photos.map((photo: { url: string }) => ({
            uri: photo.url,
         }));
      }
      return [
         require('../../assets/images/Product_WhitePepper.png'),
         require('../../assets/images/Product_WhitePepper.png'),
         require('../../assets/images/Product_WhitePepper.png'),
      ];
   }, [project]);

   useEffect(() => {
      navigation.setOptions?.({
         headerShown: false,
      });
   }, [navigation]);

   useEffect(() => {
      const fetchProject = async () => {
         try {
            const res = await fetch(
               `http://172.20.10.5:5000/api/projects/${id}`
            );
            const data = await res.json();
            setProject(data);
         } catch (e) {
            setProject(null);
         } finally {
            setLoading(false);
         }
      };
      if (id) fetchProject();
   }, [id]);

   // Auto-sliding functionality
   useEffect(() => {
      if (slides.length <= 1) return; // Don't auto-slide if there's only one image

      const interval = setInterval(() => {
         const nextSlide = (currentSlide + 1) % slides.length;
         setCurrentSlide(nextSlide);
      }, 4000); // Auto-slide every 4 seconds

      return () => clearInterval(interval); // Cleanup interval on unmount
   }, [currentSlide, slides.length]);

   // Sync scroll position with currentSlide
   useEffect(() => {
      if (scrollViewRef.current) {
         scrollViewRef.current.scrollTo({
            x: currentSlide * width,
            animated: true,
         });
      }
   }, [currentSlide, width]);

   // Handle manual scroll to update currentSlide
   const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const slideWidth = event.nativeEvent.layoutMeasurement.width;
      const contentOffset = event.nativeEvent.contentOffset.x;
      const index = Math.round(contentOffset / slideWidth);
      setCurrentSlide(index);
   };

   if (loading) {
      return (
         <SafeAreaView className="flex-1 bg-white justify-center items-center">
            <ActivityIndicator size="large" />
         </SafeAreaView>
      );
   }

   if (!project) {
      return (
         <SafeAreaView className="flex-1 bg-white justify-center items-center">
            <Text>Project not found.</Text>
         </SafeAreaView>
      );
   }

   return (
      <SafeAreaView className="flex-1 bg-white">
         {/* Gradient Navbar */}
         <LinearGradient
            colors={['rgba(0,0,0,0.7)', 'transparent']}
            style={{
               height: 90,
               paddingTop: 40,
               justifyContent: 'center',
               position: 'absolute',
               width: '100%',
               zIndex: 10,
            }}
         >
            <View className="flex-row items-center justify-between px-4">
               <TouchableOpacity
                  className="w-10 h-10 bg-white/20 rounded-full items-center justify-center"
                  onPress={() => navigation.goBack()}
               >
                  <Feather name="arrow-left" size={24} color="white" />
               </TouchableOpacity>
               <Text
                  className="text-white text-xl font-bold"
                  numberOfLines={1}
                  style={{ width: '60%' }}
               >
                  {project.title}
               </Text>
               <TouchableOpacity className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
                  <Feather name="heart" size={22} color="white" />
               </TouchableOpacity>
            </View>
         </LinearGradient>

         <ScrollView
            className="flex-1 bg-white"
            bounces={false}
            contentContainerStyle={{
               paddingBottom: 120,
            }}
         >
            {/* Image Carousel Section */}
            <View className="h-[35vh] sticky top-0 z-10 bg-gray-100">
               <ScrollView
                  ref={scrollViewRef}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onScroll={handleScroll}
                  scrollEventThrottle={16}
               >
                  {slides.map((slide: Slide, index: number) => (
                     <Image
                        key={index}
                        source={slide.uri ? { uri: slide.uri } : slide}
                        style={{
                           width,
                           height: '100%',
                        }}
                        resizeMode="cover"
                     />
                  ))}
               </ScrollView>
               {/* Pagination Dots */}
               <View className="absolute bottom-4 flex-row justify-center w-full gap-2">
                  {slides.map((_: Slide, index: number) => (
                     <View
                        key={index}
                        className={`h-2 rounded-full ${
                           currentSlide === index
                              ? 'w-4 bg-white'
                              : 'w-2 bg-white/50'
                        }`}
                     />
                  ))}
               </View>
            </View>

            {/* Content Section - Modified for better scrolling */}
            <View className="flex-1 bg-white -mt-6 rounded-t-3xl relative z-20">
               {/* Tab Navigation */}
               <View className="flex-row border-b border-gray-200 mx-4">
                  <TouchableOpacity
                     className={`flex-1 py-4 ${
                        activeTab === 'about'
                           ? 'border-b-2 border-orange-500'
                           : ''
                     }`}
                     onPress={() => setActiveTab('about')}
                  >
                     <Text
                        style={{ fontFamily: 'SF Pro Display' }}
                        className={`text-center ${
                           activeTab === 'about'
                              ? 'text-orange-500 font-semibold'
                              : 'text-gray-600'
                        }`}
                     >
                        About Project
                     </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                     className={`flex-1 py-4 ${
                        activeTab === 'manager'
                           ? 'border-b-2 border-orange-500'
                           : ''
                     }`}
                     onPress={() => setActiveTab('manager')}
                  >
                     <Text
                        style={{ fontFamily: 'SF Pro Display' }}
                        className={`text-center ${
                           activeTab === 'manager'
                              ? 'text-orange-500 font-semibold'
                              : 'text-gray-600'
                        }`}
                     >
                        Manager & Statistics
                     </Text>
                  </TouchableOpacity>
               </View>

               <View className="px-4 pt-6">
                  {activeTab === 'about' ? (
                     // About Content
                     <>
                        <Text
                           style={{
                              fontFamily: 'SF Pro Display',
                              fontSize: 24,
                              fontWeight: '700',
                           }}
                           className="mb-2"
                        >
                           {project.title}
                        </Text>
                        <Text
                           style={{
                              fontFamily: 'SF Pro Display',
                              fontSize: 20,
                           }}
                           className="text-green-600 font-semibold mb-6"
                        >
                           FCFA{' '}
                           {project.investment_per_unit?.toLocaleString() ??
                              'N/A'}
                           <Text className="text-sm"> /unit</Text>
                        </Text>

                        {/* Stats Grid */}
                        <View className="flex-row flex-wrap justify-between mb-8">
                           {[
                              {
                                 icon: 'clock',
                                 label: 'First Return',
                                 value: project.return_start_year,
                              },
                              {
                                 icon: 'trending-up',
                                 label: 'Return /year',
                                 value: project.expected_roi_range,
                              },
                              {
                                 icon: 'file-text',
                                 label: 'Contract',
                                 value: project.contract_duration,
                              },
                              {
                                 icon: 'box',
                                 label: 'Available Units',
                                 value: project.total_units,
                              },
                           ].map((item, index) => (
                              <View
                                 key={index}
                                 className="w-[48%] bg-gray-50 rounded-xl p-4 mb-4"
                              >
                                 <Feather
                                    name={item.icon}
                                    size={24}
                                    color="#666"
                                 />
                                 <Text
                                    style={{ fontFamily: 'SF Pro Display' }}
                                    className="text-gray-600 text-sm mt-2"
                                 >
                                    {item.label}
                                 </Text>
                                 <Text
                                    style={{
                                       fontFamily: 'SF Pro Display',
                                       fontWeight: '600',
                                    }}
                                    className="text-gray-900 mt-1"
                                 >
                                    {item.value || 'N/A'}
                                 </Text>
                              </View>
                           ))}
                        </View>

                        {/* Description Section */}
                        <Text
                           style={{
                              fontFamily: 'SF Pro Display',
                              fontWeight: '600',
                           }}
                           className="text-lg mb-3"
                        >
                           About Project
                        </Text>
                        <Text
                           style={{ fontFamily: 'SF Pro Display' }}
                           className="text-gray-600 leading-6 mb-8"
                        >
                           {project.description}
                        </Text>

                        {/* Location Section - Moved up and styled */}
                        <View className="bg-gray-50 rounded-xl p-4 mb-20">
                           <Text
                              style={{
                                 fontFamily: 'SF Pro Display',
                                 fontWeight: '600',
                              }}
                              className="text-lg mb-3"
                           >
                              Location
                           </Text>
                           <Text
                              style={{ fontFamily: 'SF Pro Display' }}
                              className="text-gray-600"
                           >
                              {project.location}
                           </Text>
                        </View>
                     </>
                  ) : (
                     // Manager & Statistics Content
                     <View>
                        <Text
                           style={{
                              fontFamily: 'SF Pro Display',
                              fontWeight: '600',
                           }}
                           className="text-xl mb-4"
                        >
                           Investment Statistics
                        </Text>

                        {/* Chart Section */}
                        <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
                           <LineChart
                              data={{
                                 labels: [
                                    'Year 1',
                                    'Year 2',
                                    'Year 3',
                                    'Year 4',
                                    'Year 5',
                                 ],
                                 datasets: [
                                    {
                                       data: [
                                          500000, 1000000, 1500000, 2000000,
                                          2500000,
                                       ],
                                    },
                                 ],
                              }}
                              width={width - 64}
                              height={220}
                              yAxisSuffix=" FCFA"
                              chartConfig={{
                                 backgroundColor: '#ffffff',
                                 backgroundGradientFrom: '#ffffff',
                                 backgroundGradientTo: '#ffffff',
                                 decimalPlaces: 0,
                                 color: (opacity = 1) =>
                                    `rgba(255, 167, 38, ${opacity})`,
                                 labelColor: (opacity = 1) =>
                                    `rgba(0, 0, 0, ${opacity})`,
                                 style: { borderRadius: 16 },
                                 propsForDots: {
                                    r: '6',
                                    strokeWidth: '2',
                                    stroke: '#ffa726',
                                 },
                              }}
                              style={{ marginVertical: 8, borderRadius: 16 }}
                           />
                        </View>

                        {/* Manager Bio */}
                        <View className="bg-gray-50 rounded-xl p-4 mb-20">
                           <Text
                              style={{
                                 fontFamily: 'SF Pro Display',
                                 fontWeight: '600',
                              }}
                              className="text-lg mb-3"
                           >
                              Project Manager
                           </Text>
                           <Text
                              style={{ fontFamily: 'SF Pro Display' }}
                              className="text-gray-600"
                           >
                              {project.farmer_bio}
                           </Text>
                        </View>
                     </View>
                  )}
               </View>
            </View>
         </ScrollView>

         {/* Footer - Updated styling */}
         <View
            className="absolute bottom-0 w-full bg-white"
            style={{
               shadowColor: '#000',
               shadowOffset: { width: 0, height: -3 },
               shadowOpacity: 0.1,
               shadowRadius: 5,
               elevation: 5,
               paddingBottom: 34, // Safe area padding for iPhone
            }}
         >
            <View className="flex-row gap-4 p-4 px-6">
               <TouchableOpacity
                  className="flex-1 bg-gray-100 py-4 rounded-xl items-center"
                  style={{ elevation: 1 }}
                  onPress={() =>
                     router.push({
                        pathname: '/profit-simulation',
                        params: { id: project._id }, // Pass the project ID
                     })
                  }
               >
                  <Text
                     style={{ fontFamily: 'SF Pro Display', fontWeight: '600' }}
                     className="text-gray-700"
                  >
                     Simulate Profit
                  </Text>
               </TouchableOpacity>
               <TouchableOpacity
                  className="flex-1 bg-orange-500 py-4 rounded-xl items-center"
                  style={{ elevation: 1 }}
               >
                  <Text
                     style={{ fontFamily: 'SF Pro Display', fontWeight: '600' }}
                     className="text-white"
                  >
                     Invest Now
                  </Text>
               </TouchableOpacity>
            </View>
         </View>
      </SafeAreaView>
   );
};

export default ProductDetailsScreen;
