import React, { useEffect, useState, useCallback } from 'react';
import {
   View,
   Text,
   SafeAreaView,
   ScrollView,
   TouchableOpacity,
   RefreshControl,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import SearchBar from '../../components/SearchBar';
import CategoryCard from '../../components/CategoryCard';
import FilterSelector from '../../components/FilterSelector';
import ProductCard from '../../components/ProductCard';
import ReferenceCard from '../../components/ReferenceCard';
import AdvantageCard from '../../components/AdvantageCard';
import Ref_WhitePepper from '../../assets/images/Product_WhitePepper.png';
import Ref_SpiceTrade from '../../assets/images/Product_WhitePepper.png';
import Ref_Agriculture from '../../assets/images/Product_WhitePepper.png';
// Import other product images...

const HomeScreen: React.FC = () => {
   const router = useRouter();
   const [projects, setProjects] = useState<any[]>([]);
   const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const [refreshing, setRefreshing] = useState(false);

   const fetchProjects = async () => {
      try {
         const res = await fetch(
            'http://192.168.5.1:5000/api/projects?status=Active'
         );
         const data = await res.json();
         const projectsData = Array.isArray(data) ? data : [];
         setProjects(projectsData);
         setFilteredProjects(projectsData);
      } catch (e) {
         setProjects([]);
         setFilteredProjects([]);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchProjects();
   }, []);

   const onRefresh = useCallback(async () => {
      setRefreshing(true);
      await fetchProjects();
      setRefreshing(false);
   }, []);

   const handleSearch = (searchText: string) => {
      if (!searchText.trim()) {
         setFilteredProjects(projects);
         return;
      }

      const searchQuery = searchText.toLowerCase();
      const filtered = projects.filter((project) => {
         return (
            project.title?.toLowerCase().includes(searchQuery) ||
            project.description?.toLowerCase().includes(searchQuery) ||
            project.location?.toLowerCase().includes(searchQuery) ||
            project.contract_duration?.toLowerCase().includes(searchQuery)
         );
      });

      setFilteredProjects(filtered);
   };

   const handleFilterChange = (filterId: string) => {
      if (!projects.length) return;

      let filtered = [...projects];

      switch (filterId) {
         case 'return':
            // Sort by highest ROI
            filtered.sort((a, b) => {
               const getROI = (roi: string) => {
                  return parseFloat(
                     roi?.split('-')[0]?.replace('%', '') || '0'
                  );
               };
               return (
                  getROI(b.expected_roi_range) - getROI(a.expected_roi_range)
               );
            });
            break;

         case 'best_trial':
            // Filter projects with shorter return start period
            filtered.sort((a, b) => {
               const getStartPeriod = (period: string) => {
                  return parseInt(period?.replace(/year |month /, '') || '0');
               };
               return (
                  getStartPeriod(a.return_start_year_or_month) -
                  getStartPeriod(b.return_start_year_or_month)
               );
            });
            break;

         case 'long_run':
            // Sort by longest duration
            filtered.sort((a, b) => {
               return (b.duration_in_months || 0) - (a.duration_in_months || 0);
            });
            break;

         case 'short_run':
            // Sort by shortest duration
            filtered.sort((a, b) => {
               return (a.duration_in_months || 0) - (b.duration_in_months || 0);
            });
            break;
      }

      setFilteredProjects(filtered);
   };

   // Set initial filtered projects when projects are loaded
   useEffect(() => {
      if (projects.length > 0) {
         handleFilterChange('return'); // Apply default filter
      }
   }, [projects]);

   return (
      <SafeAreaView className="flex-1 bg-white">
         <View className="pt-2 px-6 flex-row items-center justify-between bg-">
            <View className="w-[90%]">
               <SearchBar onSearch={handleSearch} />
            </View>
            <TouchableOpacity>
               <Feather name="bell" size={26} color="#9ca3af" />
            </TouchableOpacity>
         </View>

         <View className="mt-8 pl-3">
            <FilterSelector onFilterChange={handleFilterChange} />
         </View>

         <ScrollView
            className="pt-6"
            refreshControl={
               <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#2e7d32']}
                  tintColor="#2e7d32"
               />
            }
         >
            {/* Products Section */}
            <View className="mt-6">
               <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="px-4"
               >
                  {loading ? (
                     <Text>Loading...</Text>
                  ) : !Array.isArray(filteredProjects) ||
                    filteredProjects.length === 0 ? (
                     <Text>No active projects found.</Text>
                  ) : (
                     filteredProjects.map((project) => (
                        <TouchableOpacity
                           key={project._id}
                           onPress={() => {
                              router.push(`/product/${project._id}`);
                           }}
                        >
                           <ProductCard
                              id={project._id} // Add this
                              name={
                                 project.title
                                    ? project.title
                                         .split(' ')
                                         .slice(0, 2)
                                         .join(' ')
                                    : ''
                              }
                              isAvailable={project.status === 'active'}
                              returnRate={
                                 typeof project.expected_roi_range === 'string'
                                    ? project.expected_roi_range
                                    : ''
                              }
                              investmentAmount={
                                 project.unitPrice
                                    ? `Fcfa ${project.unitPrice.toLocaleString()}`
                                    : ''
                              }
                              images={
                                 Array.isArray(project.photos) &&
                                 project.photos.length > 0
                                    ? [project.photos[0].url]
                                    : []
                              }
                           />
                        </TouchableOpacity>
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
