import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

interface SearchBarProps {
   onSearch?: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
   return (
      <View className="flex-row items-center bg-gray-100 rounded-xl px-4 h-[45px]">
         <Feather name="search" size={20} color="#9ca3af" />
         <TextInput
            placeholder="Search products..."
            className="flex-1 ml-3 text-base"
            placeholderTextColor="#9ca3af"
            onChangeText={onSearch}
         />
      </View>
   );
};

export default SearchBar;
