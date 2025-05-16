import React, { useEffect, useState } from 'react';
import {
   View,
   Text,
   SafeAreaView,
   ScrollView,
   TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import SearchBar from '../../components/SearchBar';
import CategoryCard from '../../components/CategoryCard';
import FilterSelector from '../../components/FilterSelector';
import ProductCard from '../../components/ProductCard';
import ReferenceCard from '../../components/ReferenceCard';
import AdvantageCard from '../../components/AdvantageCard';
// import Product_Banana from '../../assets/images/Product_Banana.png';
// import Product_Banana2 from '../../assets/images/Product_Banana.png';
// import Product_Apple from '../../assets/images/Product_Banana.png';
// import Product_Mango from '../../assets/images/Product_Banana.png';
import Ref_WhitePepper from '../../assets/images/Product_WhitePepper.png';
import Ref_SpiceTrade from '../../assets/images/Product_WhitePepper.png';
import Ref_Agriculture from '../../assets/images/Product_WhitePepper.png';
// Import other product images...

const HomeScreen: React.FC = () => {
   const [projects, setProjects] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchProjects = async () => {
         try {
            const res = await fetch(
               'http://172.20.10.5:5000/api/projects?status=Active'
            );
            const data = await res.json();
            console.log('Fetched projects:', data); // Debug: log the response
            setProjects(Array.isArray(data) ? data : []);
         } catch (e) {
            setProjects([]);
         } finally {
            setLoading(false);
         }
      };
      fetchProjects();
   }, []);

   return (
      <SafeAreaView className="flex-1 bg-white">
         <View className="pt-2 px-6 flex-row items-center justify-between bg-">
            <View className="w-[85%]">
               <SearchBar />
            </View>
            <TouchableOpacity>
               <Feather name="bell" size={26} color="#9ca3af" />
            </TouchableOpacity>
         </View>

         <View className="mt-8 pl-3">
            <FilterSelector />
         </View>

         <ScrollView className="pt-6">
            {/* Products Section */}
            <View className="mt-6">
               <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="px-4"
               >
                  {loading ? (
                     <Text>Loading...</Text>
                  ) : !Array.isArray(projects) || projects.length === 0 ? (
                     <Text>No active projects found.</Text>
                  ) : (
                     projects.map((project) => (
                        <ProductCard
                           key={project._id}
                           name={
                              project.title
                                 ? project.title
                                      .split(' ')
                                      .slice(0, 2)
                                      .join(' ')
                                 : ''
                           }
                           isAvailable={project.status === 'Active'}
                           returnRate={
                              typeof project.expected_roi_range === 'string'
                                 ? project.expected_roi_range
                                 : ''
                           }
                           investmentAmount={
                              project.investment_per_unit
                                 ? `Fcfa ${project.investment_per_unit.toLocaleString()}`
                                 : ''
                           }
                           images={
                              Array.isArray(project.photos) &&
                              project.photos.length > 0
                                 ? [project.photos[0].url]
                                 : []
                           }
                        />
                     ))
                  )}
               </ScrollView>
            </View>

            {/* References Section */}
            <View className="pt-6 pb-6">
               <View className="flex-row justify-between items-center px-4 mb-6">
                  <Text className="text-xl font-semibold">References</Text>
                  <TouchableOpacity>
                     <Text className="text-sm text-gray-500">See more</Text>
                  </TouchableOpacity>
               </View>

               <View className="flex-col px-4 space-y-6">
                  <ReferenceCard
                     title="White Pepper, Used to be more Valuable than gold"
                     author="Muhaimin Iqbal"
                     imageUrl={Ref_WhitePepper}
                  />
                  <ReferenceCard
                     title="The History of Spice Trade in Indonesia"
                     author="Sarah Johnson"
                     imageUrl={Ref_SpiceTrade}
                  />
                  <ReferenceCard
                     title="Agricultural Investment Opportunities"
                     author="David Chen"
                     imageUrl={Ref_Agriculture}
                  />
               </View>
            </View>

            {/* Advantages Section */}
            <View className="pt-6 pb-6">
               <Text className="px-4 text-xl font-semibold mb-6">
                  Advantages of iPlant
               </Text>

               <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="px-4"
               >
                  <View className="flex-row space-x-4">
                     <View className="w-[280px]">
                        <AdvantageCard
                           title="Practical and Safe"
                           description="Secure transactions with advanced encryption and real-time monitoring"
                           icon="shield"
                        />
                     </View>
                     <View className="w-[280px]">
                        <AdvantageCard
                           title="Free Transaction"
                           description="No hidden fees or charges on all your investments"
                           icon="dollar-sign"
                        />
                     </View>
                     <View className="w-[280px]">
                        <AdvantageCard
                           title="Expert Support"
                           description="24/7 access to agricultural investment experts"
                           icon="headphones"
                        />
                     </View>
                  </View>
               </ScrollView>
            </View>
         </ScrollView>
      </SafeAreaView>
   );
};

export default HomeScreen;
