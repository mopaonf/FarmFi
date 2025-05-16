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
   const [loading, setLoading] = useState(true);
   const router = useRouter();

   useEffect(() => {
      const fetchProjects = async () => {
         try {
            const res = await fetch(
               'http://172.20.10.5:5000/api/projects?status=Active'
            );
            const data = await res.json();
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
         {/* Search and Filter Header */}
         <View className="pt-2 px-6 flex-row items-center justify-between">
            <View className="w-[85%]">
               <SearchBar />
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
               ) : projects.length === 0 ? (
                  <Text>No products found.</Text>
               ) : (
                  projects.map((project) => (
                     <ProductListItem
                        key={project._id}
                        id={project._id}
                        name={project.title}
                        partner="Sipurio Farmer Group"
                        duration={project.contract_duration}
                        price={
                           project.investment_per_unit
                              ? `Fcfa ${project.investment_per_unit.toLocaleString()}/unit`
                              : ''
                        }
                        trendPercentage={12.5}
                        image={
                           Array.isArray(project.photos) &&
                           project.photos.length > 1
                              ? { uri: project.photos[1].url }
                              : require('../../assets/images/Product_WhitePepper.png')
                        }
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
