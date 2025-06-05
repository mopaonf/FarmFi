import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

interface SearchBarProps {
   onSearch?: (text: string) => void;
   placeholder?: string; // Add this prop
}

const SearchBar: React.FC<SearchBarProps> = ({
   onSearch,
   placeholder = 'Search products...', // Default placeholder
}) => {
   return (
      <View className="flex-row items-center bg-gray-100 rounded-xl px-4 h-[45px]">
         <Feather name="search" size={20} color="#9ca3af" />
         <TextInput
            placeholder={placeholder}
            className="flex-1 ml-3 text-base"
            placeholderTextColor="#9ca3af"
            onChangeText={onSearch}
         />
      </View>
   );
};

export default SearchBar;
