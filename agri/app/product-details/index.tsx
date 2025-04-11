import React, { useState, useEffect } from 'react';
import {
   View,
   Text,
   Image,
   TouchableOpacity,
   Dimensions,
   ScrollView,
   SafeAreaView,
   StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit'; // Add this import for the chart
import { useRouter } from 'expo-router';

const { height, width } = Dimensions.get('window');

const ProductDetailsScreen: React.FC = () => {
   const [activeTab, setActiveTab] = useState('about');
   const [currentSlide, setCurrentSlide] = useState(0);
   const navigation = useNavigation();

   useEffect(() => {
      navigation.setOptions({
         headerShown: false,
      });
   }, [navigation]);

   const slides = [
      require('../../assets/images/Product_WhitePepper.png'),
      require('../../assets/images/Product_WhitePepper.png'),
      require('../../assets/images/Product_WhitePepper.png'),
   ];

   const router = useRouter();

   useEffect(() => {
      const interval = setInterval(() => {
         setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 4000);
      return () => clearInterval(interval);
   }, []);

   return (
      <SafeAreaView className="flex-1 bg-white">
         {/* Fixed Navbar */}
         <View
            style={{
               height: 60,
               backgroundColor: 'transparent',
               justifyContent: 'center',
               paddingHorizontal: 16,
               marginTop: 40,
               position: 'absolute',
               width: '100%',
               zIndex: 10,
               borderBottomWidth: 1, // Add bottom border
               borderBottomColor: '#e0e0e0', // Light gray color for the bottom border
               shadowColor: '#000', // Add shadow color
               shadowOffset: { width: 0, height: 2 }, // Shadow only below the header
               shadowOpacity: 0.1, // Subtle shadow opacity
               shadowRadius: 3, // Subtle shadow radius
               elevation: 3, // Add elevation for Android
            }}
         >
            <View className="flex-row items-center justify-between">
               <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Feather name="arrow-left" size={24} color="white" />
               </TouchableOpacity>
               <Text className="text-white text-lg font-bold">
                  Durian Investment
               </Text>
               <TouchableOpacity>
                  <Feather name="heart" size={24} color="white" />
               </TouchableOpacity>
            </View>
         </View>

         {/* Scrollable Content */}
         <ScrollView
            className="flex-1 bg-white"
            contentContainerStyle={{
               paddingBottom: 80, // Add padding to account for fixed footer
            }}
         >
            {/* Top Image Slider */}
            <View
               style={{
                  height: height * 0.25,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                  borderBottomLeftRadius: 100,
                  borderBottomRightRadius: 0,
                  overflow: 'hidden',
               }}
            >
               <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
               >
                  {slides.map((slide, index) => (
                     <Image
                        key={index}
                        source={slide}
                        style={{
                           width,
                           height: height * 0.25,
                        }}
                        resizeMode="cover"
                     />
                  ))}
               </ScrollView>
            </View>

            {/* Container Section */}
            <View style={{ height: height * 0.65 }} className="flex-row">
               {/* Left Section */}
               <View className="w-[15%] bg-blue justify-around items-center">
                  {/* About Tab */}
                  <TouchableOpacity
                     onPress={() => setActiveTab('about')}
                     style={{
                        transform: [{ rotate: '-90deg' }],
                        marginTop: -150,
                        marginBottom: -350,
                     }}
                  >
                     <Text
                        className={`text-lg font-medium w-[200px] ${
                           activeTab === 'about'
                              ? 'text-red-300 font-bold'
                              : 'text-black'
                        }`}
                     >
                        About Durian Investment
                     </Text>
                  </TouchableOpacity>

                  {/* Manager & Statistics Tab */}
                  <TouchableOpacity
                     onPress={() => setActiveTab('manager')}
                     style={{
                        transform: [{ rotate: '-90deg' }],
                     }}
                  >
                     <Text
                        className={`text-lg font-medium w-[200px] ${
                           activeTab === 'manager'
                              ? 'text-red-300 font-bold'
                              : 'text-black'
                        }`}
                     >
                        Manager & Statistics
                     </Text>
                  </TouchableOpacity>
               </View>

               {/* Right Section */}
               <View className="w-[85%] bg-white p-4">
                  {activeTab === 'about' ? (
                     <>
                        <Text className="text-lg font-semibold mb-2">
                           Durian Investment
                        </Text>
                        <Text className="text-green-600 font-semibold mb-4">
                           FCFA 9.000.000 <Text className="text-sm">/unit</Text>
                        </Text>
                        {/* Investment Details */}
                        <View className="flex flex-col gap-4 mb-4">
                           {/* First Row */}
                           <View className="flex-row justify-between items-center">
                              <View className="flex-row items-center">
                                 <Feather name="clock" size={30} color="gray" />
                                 <View className="ml-2">
                                    <Text className="font-semibold text-gray-700">
                                       First Return
                                    </Text>
                                    <Text className="text-gray-500">
                                       5 Years
                                    </Text>
                                 </View>
                              </View>
                              <View className="flex-row items-center mr-20">
                                 <Feather
                                    name="trending-up"
                                    size={30}
                                    color="gray"
                                 />
                                 <View className="ml-2">
                                    <Text className="font-semibold text-gray-700">
                                       Return /year
                                    </Text>
                                    <Text className="text-gray-500">
                                       15-45%
                                    </Text>
                                 </View>
                              </View>
                           </View>
                           {/* Second Row */}
                           <View className="flex-row justify-between items-center">
                              <View className="flex-row items-center">
                                 <Feather
                                    name="file-text"
                                    size={30}
                                    color="gray"
                                 />
                                 <View className="ml-2">
                                    <Text className="font-semibold text-gray-700">
                                       Contract
                                    </Text>
                                    <Text className="text-gray-500">
                                       18 Years
                                    </Text>
                                 </View>
                              </View>
                              <View className="flex-row items-center mr-28">
                                 <Feather name="box" size={30} color="gray" />
                                 <View className="ml-2">
                                    <Text className="font-semibold text-gray-700">
                                       Stocks
                                    </Text>
                                    <Text className="text-gray-500">
                                       138 Left
                                    </Text>
                                 </View>
                              </View>
                           </View>
                        </View>
                        {/* Description */}
                        <Text className="text-sm text-gray-600 leading-6 mb-4">
                           Durian (or Durio zibethinus) is a tropical fruit that
                           is controversial, as some people can be very fond of
                           the durian while others detest it. Therefore, people
                           always look for improved varieties, the most superior
                           variety is the Weasel King, whose price could reach
                           FCFA 250.000,- (equal to $20) per piece in the import
                           fruit market.
                           {'\n\n'}
                           Durian trees begin to bear fruits at the age of 5
                           years and can continue to bear fruit productively for
                           decades. At the peak of production, a durian tree can
                           produce about 200 pieces. To plant a durian tree, you
                           need about 100 m2 of land (on a 1-acre farm, there
                           are about 100 durian trees).
                           {'\n\n'}
                           Assuming the land lease in Java for this durian plan
                           happens in the long term (18 years), planting durian
                           will be beneficial economically with an IRR of 18%
                           from the investment value of FCFA 5.000.000,- (equal
                           to $394) per tree - including the cost of land lease,
                           seeds, care, supervision, etc.
                        </Text>
                        {/* Geographical Location */}
                        <Text className="text-lg font-semibold mb-2">
                           Geographical Location
                        </Text>
                        <Text className="text-sm text-gray-600 leading-6">
                           The investment site is located in the fertile lands
                           of Java, Indonesia. The region is known for its rich
                           soil and favorable climate, making it ideal for
                           durian cultivation. The site is accessible via major
                           roads and is equipped with modern irrigation systems
                           to ensure optimal growth conditions.
                        </Text>
                     </>
                  ) : (
                     <>
                        <Text className="text-lg font-semibold mb-2">
                           Manager & Statistics
                        </Text>

                        {/* Add a chart for FCFA/year */}
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
                           width={width * 0.8} // Chart width
                           height={220} // Chart height
                           yAxisSuffix=" FCFA"
                           chartConfig={{
                              backgroundColor: '#ffffff',
                              backgroundGradientFrom: '#f7f7f7',
                              backgroundGradientTo: '#e8e8e8',
                              decimalPlaces: 0,
                              color: (opacity = 1) =>
                                 `rgba(0, 122, 255, ${opacity})`,
                              labelColor: (opacity = 1) =>
                                 `rgba(0, 0, 0, ${opacity})`,
                              style: {
                                 borderRadius: 16,
                              },
                              propsForDots: {
                                 r: '6',
                                 strokeWidth: '2',
                                 stroke: '#ffa726',
                              },
                           }}
                           style={{
                              marginVertical: 8,
                              borderRadius: 16,
                           }}
                        />
                        {/* Add managerial content */}
                        <Text className="text-sm text-gray-600 leading-6 mt-4">
                           Our experienced farm managers ensure optimal crop
                           health and yield. They use advanced monitoring
                           systems to track growth and address issues in real
                           time. Regular reports are provided to investors,
                           detailing production cycles, financial summaries, and
                           risk assessments. Transparency is our priority, and
                           we welcome investors to visit the farm and interact
                           with the management team.
                        </Text>
                     </>
                  )}
               </View>
            </View>
         </ScrollView>

         {/* Fixed Footer */}
         <View
            className="flex-row justify-around p-4 border-t border-gray-200 bg-white"
            style={{
               position: 'absolute',
               bottom: 0,
               left: 0,
               right: 0,
               zIndex: 10,
               marginBottom: 15,
            }}
         >
            <TouchableOpacity
               className="flex-1 bg-gray-100 p-3 mx-2 rounded-lg items-center"
               onPress={() => router.push('/profit-simulation')}
            >
               <Text className="text-sm font-medium text-gray-700">
                  Profit Simulation
               </Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-orange-500 p-3 mx-2 rounded-lg items-center">
               <Text className="text-sm font-medium text-white">
                  Invest Unit
               </Text>
            </TouchableOpacity>
         </View>
      </SafeAreaView>
   );
};

export default ProductDetailsScreen;
