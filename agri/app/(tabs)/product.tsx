import React from 'react';
import { View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import SearchBar from '../../components/SearchBar';
import CategoryFilter from '../../components/CategoryFilter';
import { Colors } from '../../constants/Colors';
import ProductListItem from '../../components/ProductListItem';

const ProductScreen: React.FC = () => {
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
               <ProductListItem
                  id="corn-001"
                  name="Corn Investment"
                  partner="Sipurio Farmer Group"
                  duration="6 months contract"
                  price="Fcfa 3.500.000/unit"
                  trendPercentage={12.5}
                  image={require('../../assets/images/Product_WhitePepper.png')}
               />
               <ProductListItem
                  id="rice-001"
                  name="Rice Field Project"
                  partner="Tani Makmur Group"
                  duration="4 months contract"
                  price="Fcfa 5.000.000/unit"
                  trendPercentage={-2.3}
                  image={require('../../assets/images/Product_WhitePepper.png')}
               />
               <ProductListItem
                  id="corn-002"
                  name="Corn Investment"
                  partner="Sipurio Farmer Group"
                  duration="6 months contract"
                  price="Fcfa 3.500.000/unit"
                  trendPercentage={12.5}
                  image={require('../../assets/images/Product_WhitePepper.png')}
               />
               <ProductListItem
                  id="rice-002"
                  name="Rice Field Project"
                  partner="Tani Makmur Group"
                  duration="4 months contract"
                  price="Fcfa 5.000.000/unit"
                  trendPercentage={-2.3}
                  image={require('../../assets/images/Product_WhitePepper.png')}
               />
               <ProductListItem
                  id="rice-003"
                  name="Rice Field Project"
                  partner="Tani Makmur Group"
                  duration="4 months contract"
                  price="Fcfa 5.000.000/unit"
                  trendPercentage={-2.3}
                  image={require('../../assets/images/Product_WhitePepper.png')}
               />
               <ProductListItem
                  id="corn-003"
                  name="Corn Investment"
                  partner="Sipurio Farmer Group"
                  duration="6 months contract"
                  price="Fcfa 3.500.000/unit"
                  trendPercentage={12.5}
                  image={require('../../assets/images/Product_WhitePepper.png')}
               />
               <ProductListItem
                  id="rice-004"
                  name="Rice Field Project"
                  partner="Tani Makmur Group"
                  duration="4 months contract"
                  price="Fcfa 5.000.000/unit"
                  trendPercentage={-2.3}
                  image={require('../../assets/images/Product_WhitePepper.png')}
               />
               <ProductListItem
                  id="corn-004"
                  name="Corn Investment"
                  partner="Sipurio Farmer Group"
                  duration="6 months contract"
                  price="Fcfa 3.500.000/unit"
                  trendPercentage={12.5}
                  image={require('../../assets/images/Product_WhitePepper.png')}
               />

               {/* Add more ProductListItems as needed */}
            </View>
         </ScrollView>
      </SafeAreaView>
   );
};

export default ProductScreen;
