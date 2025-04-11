import React, { useState, useEffect } from 'react';
import {
   View,
   Text,
   TouchableOpacity,
   ScrollView,
   SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';

const ProfitSimulationScreen: React.FC = () => {
   const [unit, setUnit] = useState(1);
   const unitPrice = 27000000; // FCFA per unit
   const navigation = useNavigation();

   useEffect(() => {
      navigation.setOptions({
         headerShown: false,
      });
   }, [navigation]);

   const data = [
      { year: 1, netProfit: 4050, roi: '15%' },
      { year: 2, netProfit: 4500, roi: '16%' },
      { year: 3, netProfit: 5000, roi: '17%' },
      { year: 4, netProfit: 5500, roi: '18%' },
      { year: 5, netProfit: 6000, roi: '19%' },
      { year: 6, netProfit: 6500, roi: '20%' },
      { year: 7, netProfit: 7000, roi: '21%' },
      { year: 8, netProfit: 7500, roi: '22%' },
      { year: 9, netProfit: 8000, roi: '23%' },
      { year: 10, netProfit: 8500, roi: '24%' },
      { year: 11, netProfit: 9000, roi: '25%' },
      { year: 12, netProfit: 9500, roi: '26%' },
   ];

   const totalNetProfit = data.reduce(
      (sum, record) => sum + record.netProfit,
      0
   );

   return (
      <SafeAreaView className="flex-1 bg-white">
         {/* Header */}
         <View
            style={{
               height: 60,
               backgroundColor: Colors.light.white,
               justifyContent: 'center',
               paddingHorizontal: 16,
               marginTop: 40,
               position: 'absolute',
               width: '100%',
               zIndex: 10,
               borderBottomWidth: 1, // Add bottom border
               borderBottomColor: '#e0e0e0', // Light gray color for the bottom border
               shadowColor: '#000', // Add shadow color
               shadowOffset: { width: 0, height: 2 }, // Shadow only below the header
               shadowOpacity: 0.1, // Subtle shadow opacity
               shadowRadius: 3, // Subtle shadow radius
               elevation: 3, // Add elevation for Android
            }}
         >
            <View className="flex-row items-center">
               <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Feather name="arrow-left" size={24} color="black" />
               </TouchableOpacity>
               <View className="pl-32 items-center">
                  <Text className="text-black text-lg font-bold">
                     Durian Investment
                  </Text>
                  <Text className="text-black italic text-sm">
                     Profit Simulator
                  </Text>
               </View>
            </View>
         </View>

         <ScrollView className="flex-1 p-4 pt-24">
            {/* Table */}
            <View className="border-collapse border-gray-300 rounded-lg overflow-hidden">
               <View
                  className="flex-row p-2"
                  style={{ backgroundColor: Colors.light.grayDark }}
               >
                  <Text className="flex-1 font-bold text-center text-white">
                     Year
                  </Text>
                  <Text className="flex-1 font-bold text-center text-white">
                     Net Profit (FCFA)
                  </Text>
                  <Text className="flex-1 font-bold text-center text-white">
                     ROI
                  </Text>
               </View>
               {data.map((record, index) => (
                  <View
                     key={index}
                     className={`flex-row p-3 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                     }`}
                  >
                     <Text className="flex-1 text-center text-gray-700">
                        {record.year}
                     </Text>
                     <Text className="flex-1 text-center text-gray-700">
                        {record.netProfit.toLocaleString()}
                     </Text>
                     <Text className="flex-1 text-center text-gray-700">
                        {record.roi}
                     </Text>
                  </View>
               ))}
               {/* Total */}
               <View
                  className="flex-row p-3"
                  style={{ backgroundColor: Colors.light.grayDark  }}
               >
                  <Text className="flex-1 font-bold text-center text-white">
                     Total
                  </Text>
                  <Text className="flex-1 font-bold text-center text-white">
                     {totalNetProfit.toLocaleString()} FCFA
                  </Text>
                  <Text className="flex-1 text-center"></Text>
               </View>
               {/* IRR */}
               <View
                  className="flex-row p-3"
                  style={{ backgroundColor: Colors.light.grayDark }}
               >
                  <Text className="flex-1 font-bold text-center text-white">
                     IRR
                  </Text>
                  <Text className="flex-1 font-bold text-center text-white">
                     18%
                  </Text>
                  <Text className="flex-1 text-center"></Text>
               </View>
            </View>

            {/* Disclaimer */}
            <Text className="text-sm text-gray-600 mt-4 leading-6">
               Disclaimer: The above figures are estimates and subject to change
               based on market conditions. Past performance is not indicative of
               future results. Please consult with a financial advisor before
               making any investment decisions. All investments carry risks,
               including the risk of loss. The information provided is for
               educational purposes only and should not be considered as
               financial advice.
            </Text>
         </ScrollView>

         {/* Footer */}
         <View
            className="p-4 border-t border-gray-300 bg-white"
            style={{
               position: 'absolute',
               bottom: 0,
               left: 0,
               right: 0,
               marginBottom: 10,
            }}
         >
            {/* Unit Controls */}
            <View className="flex-row items-center justify-between mb-4">
               <View className="flex-row items-center">
                  <TouchableOpacity
                     onPress={() => setUnit((prev) => Math.max(prev - 1, 1))}
                     className="p-2 rounded-lg px-4"
                     style={{ backgroundColor: Colors.light.primaryDark }}
                  >
                     <Text className="text-lg font-bold text-white">-</Text>
                  </TouchableOpacity>
                  <Text className="mx-4 text-lg font-bold">{unit}</Text>
                  <TouchableOpacity
                     onPress={() => setUnit((prev) => prev + 1)}
                     className="p-2 rounded-lg px-4"
                     style={{ backgroundColor: Colors.light.primaryDark }}
                  >
                     <Text className="text-lg font-bold text-white">+</Text>
                  </TouchableOpacity>
               </View>
               {/* Total Amount */}
               <Text className="text-lg font-bold">
                  {`FCFA ${(unit * unitPrice).toLocaleString()}`}
               </Text>
            </View>
            {/* Calculate Button */}
            <TouchableOpacity                className="bg-orange-500 p-3 rounded-lg py-5"            >
               <Text className="text-white font-bold text-center">
                  Calculate
               </Text>
            </TouchableOpacity>
         </View>
      </SafeAreaView>
   );
};

export default ProfitSimulationScreen;
