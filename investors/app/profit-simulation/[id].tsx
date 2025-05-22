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
               `http://192.168.5.1:5000/api/projects/${id}`
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

      // Parse the annual net profit estimate
      const [minProfit, maxProfit] = project.annual_net_profit_estimate
         ?.replace('Between ', '')
         .replace('M', '')
         .split(' - ')
         .map((value) => parseFloat(value) * 1000000) || [0, 0];

      const startYear = parseInt(
         project.return_start_year_or_month?.replace('year ', '') || '0'
      );
      const duration = 10; // Assuming a 10-year contract

      const calculatedData = [];
      for (let year = 1; year <= duration; year++) {
         if (year < startYear) {
            calculatedData.push({ year, netProfit: 0, roi: '0%' });
         } else {
            const netProfit =
               project.return_frequency === 'yearly'
                  ? Math.round((minProfit + maxProfit) / 2)
                  : Math.round((minProfit + maxProfit) / 2 / 12);

            const roi =
               project.return_frequency === 'yearly'
                  ? `${Math.round((netProfit / project.unitPrice) * 100)}%`
                  : `${Math.round(
                       ((netProfit * 12) / project.unitPrice) * 100
                    )}%`;

            calculatedData.push({ year, netProfit, roi });
         }
      }

      setData(calculatedData);
   }, [project]);

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
               borderBottomWidth: 1,
               borderBottomColor: '#e0e0e0',
               shadowColor: '#000',
               shadowOffset: { width: 0, height: 2 },
               shadowOpacity: 0.1,
               shadowRadius: 3,
               elevation: 3,
            }}
         >
            <View className="flex-row items-center">
               <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Feather name="arrow-left" size={24} color="black" />
               </TouchableOpacity>
               <View className="pl-32 items-center">
                  <Text className="text-black text-lg font-bold">
                     {project.title || 'Profit Simulator'}
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
         </ScrollView>
      </SafeAreaView>
   );
};

export default ProfitSimulationScreen;
