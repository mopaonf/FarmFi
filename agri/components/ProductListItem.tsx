import React from 'react';
import {
   View,
   Text,
   Image,
   ImageSourcePropType,
   TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';
import { useRouter } from 'expo-router';

interface ProductListItemProps {
   id: string;
   name: string;
   partner: string;
   duration: string;
   price: string;
   trendPercentage: number;
   image: ImageSourcePropType;
}

const ProductListItem: React.FC<ProductListItemProps> = ({
   id,
   name,
   partner,
   duration,
   price,
   trendPercentage,
   image,
}) => {
   const router = useRouter();

   return (
      <TouchableOpacity
         className="flex-row bg-white p-4 rounded-xl mb-4 shadow-sm"
         onPress={() => router.push(`/product-details`)}
      >
         {/* Image Section (25%) */}
         <View className="w-[25%] pr-3">
            <Image
               source={image}
               className="w-full h-[100px] rounded-lg"
               resizeMode="cover"
            />
         </View>

         {/* Details Section (60%) */}
         <View className="w-[60%] pr-2">
            <Text className="text-lg font-semibold mb-1">{name}</Text>
            <Text style={{ color: Colors.light.text }} className="text-sm mb-1">
               Partnership with {partner}
            </Text>
            <Text style={{ color: Colors.light.icon }} className="text-sm mb-1">
               {duration}
            </Text>
            <Text
               style={{ color: Colors.light.primary }}
               className="font-medium"
            >
               {price}
            </Text>
         </View>

         {/* Trend Graph Section (15%) */}
         <View className="w-[15%] items-center justify-center">
            {/* Simple trend indicator arrow */}
            <View className="w-[30px] h-[30px] mb-1 items-center justify-center">
               <Feather
                  name={trendPercentage >= 0 ? 'trending-up' : 'trending-down'}
                  size={24}
                  color={
                     trendPercentage >= 0
                        ? Colors.light.primary
                        : Colors.light.error
                  }
               />
            </View>
            <Text
               style={{
                  color:
                     trendPercentage >= 0
                        ? Colors.light.primary
                        : Colors.light.error,
               }}
               className="text-sm font-medium"
            >
               {trendPercentage > 0 ? '+' : ''}
               {trendPercentage}%
            </Text>
         </View>
      </TouchableOpacity>
   );
};

export default ProductListItem;
