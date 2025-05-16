import React, { useState, useEffect } from 'react';
import {
   View,
   Text,
   TouchableOpacity,
   ScrollView,
   SafeAreaView,
   ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useLocalSearchParams } from 'expo-router';

const ProfitSimulationScreen: React.FC = () => {
   const [unit, setUnit] = useState(1);
   const [project, setProject] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const [data, setData] = useState<any[]>([]); // Ensure this hook is always called
   const navigation = useNavigation();
   const { id } = useLocalSearchParams(); // Get the project ID from route params

   useEffect(() => {
      navigation.setOptions({
         headerShown: false,
      });
   }, [navigation]);

   useEffect(() => {
      const fetchProject = async () => {
         try {
            const res = await fetch(
               `http://172.20.10.5:5000/api/projects/${id}`
            );
            const data = await res.json();
            setProject(data);
         } catch (e) {
            setProject(null);
         } finally {
            setLoading(false);
         }
      };

      if (id) fetchProject();
   }, [id]);

   useEffect(() => {
      if (!project) return;

      const minROI = parseFloat(
         project.expected_roi_range?.split('-')[0]?.replace('%', '') || '0'
      );

      const isMonthly = project.duration_in_months <= 12;
      const startPeriod = parseInt(
         project.return_start_year_or_month?.replace(
            isMonthly ? 'month ' : 'year ',
            ''
         ) || '0'
      );
      const duration = isMonthly
         ? project.duration_in_months
         : Math.ceil(project.duration_in_months / 12);

      const calculatedData = [];
      for (let period = 1; period <= duration; period++) {
         if (period < startPeriod) {
            calculatedData.push({ period, netProfit: 0, roi: '0%' });
         } else {
            const netProfit = Math.round(
               (minROI / 100) * project.investment_per_unit * unit
            );

            calculatedData.push({
               period,
               netProfit,
               roi: `${minROI}%`,
            });
         }
      }

      setData(calculatedData);
   }, [project, unit]);

   if (loading) {
      return (
         <SafeAreaView className="flex-1 bg-white justify-center items-center">
            <ActivityIndicator size="large" />
         </SafeAreaView>
      );
   }

   if (!project) {
      return (
         <SafeAreaView className="flex-1 bg-white justify-center items-center">
            <Text>Project not found.</Text>
         </SafeAreaView>
      );
   }

   const totalNetProfit = data.reduce(
      (sum, record) => sum + record.netProfit,
      0
   );

   const isMonthly = project.duration_in_months <= 12;

   return (
      <SafeAreaView className="flex-1 bg-white">
         {/* Header */}
         <View
            style={{
               height: 80,
               backgroundColor: Colors.light.white,
               justifyContent: 'center',
               paddingHorizontal: 16,
               marginTop: 40,
               position: 'absolute',
               width: '100%',
               zIndex: 10,
               borderBottomWidth: 1,
               borderBottomColor: '#e0e0e0',
               shadowColor: '#000',
               shadowOffset: { width: 0, height: 2 },
               shadowOpacity: 0.1,
               shadowRadius: 3,
               elevation: 3,
            }}
         >
            <View className="flex-row items-center justify-center">
               <TouchableOpacity
                  style={{ position: 'absolute', left: 16 }}
                  onPress={() => navigation.goBack()}
               >
                  <Feather name="arrow-left" size={24} color="black" />
               </TouchableOpacity>
               <View className="items-center">
                  <Text className="text-black text-xl font-bold">
                     {project.title}
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
                     {isMonthly ? 'Month' : 'Year'}
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
                        {record.period}
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
                  style={{ backgroundColor: Colors.light.grayDark }}
               >
                  <Text className="flex-1 font-bold text-center text-white">
                     Total
                  </Text>
                  <Text className="flex-1 font-bold text-center text-white">
                     {totalNetProfit.toLocaleString()} FCFA
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
                  {`FCFA ${(
                     unit * project.investment_per_unit
                  ).toLocaleString()}`}
               </Text>
            </View>
            {/* Calculate Button */}
            <TouchableOpacity className="bg-orange-500 p-3 rounded-lg py-5">
               <Text className="text-white font-bold text-center">
                  Calculate
               </Text>
            </TouchableOpacity>
         </View>
      </SafeAreaView>
   );
};

export default ProfitSimulationScreen;
