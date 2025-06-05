import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../constants/Colors';
import { useRouter } from 'expo-router';

interface ProductCardProps {
   id: string; // Add this
   name: string;
   isAvailable?: boolean;
   returnRate: number | string;
   investmentAmount: string;
   images: string[];
}

const ProductCard: React.FC<ProductCardProps> = ({
   id, // Add this
   name,
   isAvailable = true,
   returnRate,
   investmentAmount,
   images,
}) => {
   const router = useRouter(); // Add router
   // Only use the first image if available
   const firstImage = images && images.length > 0 ? images[0] : null;

   return (
      <TouchableOpacity
         className="w-[150px] h-[230px] relative ml-[10px] mr-14 mb-4"
         onPress={() =>
            router.push({
               pathname: '/product-details',
               params: { id },
            })
         }
      >
         <View
            style={{ backgroundColor: Colors.dark.primaryDark }}
            className="rounded-xl p-3 shadow-sm h-full"
         >
            {/* Status Badge */}
            <View className="absolute left-[-10] top-14 z-10">
               <Text
                  className="text-xl font-medium text-white"
                  style={{
                     transform: [{ rotate: '270deg' }],
                     textDecorationLine: 'underline',
                  }}
               >
                  {isAvailable ? 'Available' : 'Sold Out'}
               </Text>
            </View>

            {/* Product Image */}
            {firstImage && (
               <View
                  className="absolute w-40 h-40"
                  style={{
                     right: -44,
                     top: -16,
                     zIndex: 10,
                  }}
               >
                  <Image
                     source={{ uri: firstImage }}
                     style={{
                        width: '90%',
                        height: '90%',
                        resizeMode: 'contain',
                        transform: [{ scale: 1.2 }],
                     }}
                  />
               </View>
            )}

            {/* Product Details (positioned at bottom) */}
            <View className="mt-36 pt-2">
               <Text className="text-lg font-medium text-white">{name}</Text>
               <Text className="text-white/80 text-sm mt-1.5">
                  {returnRate}
               </Text>
               <Text className="text-white font-semibold mt-0.5">
                  {investmentAmount}
               </Text>
            </View>
         </View>
      </TouchableOpacity>
   );
};

export default ProductCard;
