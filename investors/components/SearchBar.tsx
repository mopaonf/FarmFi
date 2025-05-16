import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

const SearchBar = () => {
   return (
      <View className="flex-row items-center space-x-6 px-7 py-2 bg-white rounded-full shadow-[0_2px_3px_rgb(0,0,0,0.1)]">
         <Feather name="search" size={24} color="#666" />
         <TextInput
            placeholder="Search products investment"
            className="flex-1 px-5 text-base h-8"
            placeholderTextColor="#666"
         />
      </View>
   );
};

export default SearchBar;
