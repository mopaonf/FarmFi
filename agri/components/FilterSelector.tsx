import React from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { Colors } from '../constants/Colors';

interface FilterOption {
   id: string;
   label: string;
}

const filters: FilterOption[] = [
   { id: 'return', label: 'Highest Return' },
   { id: 'best_trial', label: 'Best trial' },
   { id: 'long_run', label: 'Long run' },
   { id: 'short_run', label: 'Short run' },
];

const FilterSelector: React.FC = () => {
   const [active, setActive] = React.useState('return');

   return (
      <ScrollView 
         horizontal 
         showsHorizontalScrollIndicator={false}
         className="px-4"
      >
         {filters.map((filter) => (
            <TouchableOpacity
               key={filter.id}
               onPress={() => setActive(filter.id)}
               className="mr-6"
            >
               <Text 
                  style={{ 
                     color: active === filter.id ? Colors.light.primary : '#6b7280'
                  }}
                  className="text-2xl font-medium font-[Poppins_500Medium]"
               >
                  {filter.label}
               </Text>
               {active === filter.id && (
                  <View 
                     style={{ backgroundColor: Colors.light.primary }}
                     className="h-0.5 w-10 mt-1"
                  />
               )}
            </TouchableOpacity>
         ))}
      </ScrollView>
   );
};

export default FilterSelector;
