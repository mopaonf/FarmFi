import React, { useEffect, useState } from 'react';
import {
   View,
   TouchableOpacity,
   SafeAreaView,
   ScrollView,
   Text,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import SearchBar from '../../components/SearchBar';
import CategoryFilter from '../../components/CategoryFilter';
import { Colors } from '../../constants/Colors';
import ProductListItem from '../../components/ProductListItem';
import { useRouter } from 'expo-router';

const ProductScreen: React.FC = () => {
   const [projects, setProjects] = useState<any[]>([]);
   const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const router = useRouter();

   useEffect(() => {
      const fetchProjects = async () => {
         try {
            const res = await fetch(
               'http://192.168.5.1:5000/api/projects?status=active'
            );
            const data = await res.json();
            const projectsData = Array.isArray(data) ? data : [];

            // Calculate actual available units for each project
            const processedProjects = projectsData.map((project) => ({
               ...project,
               availableUnits:
                  project.totalUnits - (project.unitsInvested || 0),
            }));

            // Filter active projects with available units
            const activeProjects = processedProjects.filter(
               (project) =>
                  project.status === 'active' &&
                  project.fundingStatus !== 'completed' &&
                  project.availableUnits > 0
            );

            setProjects(activeProjects);
            setFilteredProjects(activeProjects);
         } catch (e) {
            console.error('Error fetching projects:', e);
            setProjects([]);
            setFilteredProjects([]);
         } finally {
            setLoading(false);
         }
      };
      fetchProjects();
   }, []);

   // Add helper function for available units
   const getAvailableUnits = (project) => {
      return project.totalUnits - (project.unitsInvested || 0);
   };

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

   return (
      <SafeAreaView className="flex-1 bg-white">
         {/* Search and Filter Header */}
         <View className="pt-2 px-6 flex-row items-center justify-between">
            <View className="w-[85%]">
               <SearchBar onSearch={handleSearch} />
            </View>
            <TouchableOpacity>
               <Feather name="filter" size={26} color={Colors.light.primary} />
            </TouchableOpacity>
         </View>

         {/* Category Filter Buttons */}
         <View className="pt-6">
            <CategoryFilter />
         </View>

         <ScrollView className="flex-1 pt-8">
            <View className="px-4">
               {loading ? (
                  <Text>Loading...</Text>
               ) : filteredProjects.length === 0 ? (
                  <Text>No products found.</Text>
               ) : (
                  filteredProjects.map((project) => (
                     <ProductListItem
                        key={project._id}
                        id={project._id}
                        name={project.title}
                        partner="Sipurio Farmer Group"
                        duration={project.contract_duration}
                        price={
                           project.unitPrice
                              ? `Fcfa ${project.unitPrice.toLocaleString()}/unit`
                              : ''
                        }
                        trendPercentage={12.5}
                        image={
                           Array.isArray(project.photos) &&
                           project.photos.length > 1
                              ? { uri: project.photos[1].url }
                              : require('../../assets/images/Product_WhitePepper.png')
                        }
                        availableUnits={getAvailableUnits(project)}
                        onPress={() =>
                           router.push({
                              pathname: '/product/[id]',
                              params: { id: project._id },
                           })
                        }
                     />
                  ))
               )}
            </View>
         </ScrollView>
      </SafeAreaView>
   );
};

export default ProductScreen;
