import React from 'react';
import { TouchableOpacity, Text, Image } from 'react-native';

interface CategoryCardProps {
  title: string;
  imgUrl: string;
  onPress: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, imgUrl, onPress }) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      className="relative mr-2"
    >
      <Image
        source={{ uri: imgUrl }}
        className="h-20 w-20 rounded-lg"
      />
      <Text className="absolute bottom-1 left-1 text-white font-bold">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CategoryCard;
