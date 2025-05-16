import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import { Colors } from '../constants/Colors';

interface Category {
   id: string;
   label: string;
}

const categories: Category[] = [
   { id: 'all', label: 'All Products' },
   { id: 'choices', label: 'Choices Product' },
   { id: 'favorite', label: 'My Favorite' },
   { id: 'trending', label: 'Trending' },
   { id: 'new', label: 'New Arrival' },
];

const CategoryFilter: React.FC = () => {
   const [active, setActive] = React.useState('all');

   return (
      <ScrollView 
         horizontal 
         showsHorizontalScrollIndicator={false}
         className="px-4"
      >
         {categories.map((category) => (
            <TouchableOpacity
               key={category.id}
               onPress={() => setActive(category.id)}
               style={{ 
                  backgroundColor: active === category.id ? Colors.dark.primaryDark : 'transparent',
                  borderColor: Colors.light.primary,
                  borderWidth: 1,
               }}
               className="px-4 py-2 rounded-full mr-3"
            >
               <Text 
                  style={{ 
                     color: active === category.id ? 'white' : Colors.light.primary 
                  }}
                  className="font-medium"
               >
                  {category.label}
               </Text>
            </TouchableOpacity>
         ))}
      </ScrollView>
   );
};

export default CategoryFilter;
