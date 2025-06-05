import React, { useState, useEffect } from 'react';
import {
   View,
   Text,
   TouchableOpacity,
   ScrollView,
   SafeAreaView,
   ActivityIndicator,
   Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import InvestmentModal from '../../components/InvestmentModal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfitSimulationScreen: React.FC = () => {
   const [unit, setUnit] = useState(1);
   const [project, setProject] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const [data, setData] = useState<any[]>([]); // Ensure this hook is always called
   const [showInvestModal, setShowInvestModal] = useState(false);
   const [walletBalance, setWalletBalance] = useState(0);
   const navigation = useNavigation();
   const { id } = useLocalSearchParams(); // Get the project ID from route params
   const router = useRouter(); // Add this line

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
               (minROI / 100) * project.unitPrice * unit
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

   useEffect(() => {
      fetchWalletBalance();
   }, []);

   const fetchWalletBalance = async () => {
      try {
         const token = await AsyncStorage.getItem('token');
         const response = await fetch(
            'http://192.168.5.1:5000/api/wallets/stats',
            {
               headers: { Authorization: `Bearer ${token}` },
            }
         );
         const data = await response.json();
         setWalletBalance(data.balance);
      } catch (error) {
         console.error('Error fetching wallet balance:', error);
      }
   };

   const handleInvestment = async () => {
      const investmentAmount = unit * project.unitPrice;

      if (walletBalance < investmentAmount) {
         Alert.alert(
            'Insufficient Balance',
            'Would you like to add funds to your wallet?',
            [
               {
                  text: 'Cancel',
                  style: 'cancel',
               },
               {
                  text: 'Add Funds',
                  onPress: () =>
                     router.push({
                        pathname: '/wallet/deposit',
                        params: {
                           returnTo: 'profit-simulation',
                           projectId: project._id,
                        },
                     }),
               },
            ]
         );
         return;
      }

      setShowInvestModal(true);
   };

   const handleConfirmInvestment = async (description: string) => {
      try {
         const token = await AsyncStorage.getItem('token');
         const response = await fetch(
            'http://192.168.5.1:5000/api/wallets/invest',
            {
               method: 'POST',
               headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                  projectId: project._id,
                  amount: unit * project.unitPrice,
                  units: unit,
                  description,
               }),
            }
         );

         if (!response.ok) {
            throw new Error('Investment failed');
         }

         Alert.alert('Success', 'Investment submitted successfully', [
            { text: 'OK', onPress: () => router.back() },
         ]);
      } catch (error) {
         Alert.alert('Error', 'Failed to process investment');
      } finally {
         setShowInvestModal(false);
      }
   };

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

   // Calculate max units available
   const maxUnits =
      project &&
      typeof project.totalUnits === 'number' &&
      typeof project.unitsInvested === 'number'
         ? project.totalUnits - project.unitsInvested
         : 0;

   return (
      <SafeAreaView className="flex-1 bg-white">
         {/* Header with refined styling */}
         <View
            style={{
               height: 115,
               paddingTop: 20,
               backgroundColor: Colors.light.primaryLightnew,
               justifyContent: 'center',
               paddingHorizontal: 16,
               marginTop: 10,
               position: 'absolute',
               width: '100%',
               zIndex: 10,
               borderBottomWidth: 1,
               borderBottomColor: '#f3f4f6',
               shadowColor: '#000',
               shadowOffset: { width: 0, height: 2 },
               shadowOpacity: 0.05,
               shadowRadius: 3,
               elevation: 3,
            }}
         >
            <View className="flex-row items-center">
               <TouchableOpacity
                  style={{
                     padding: 8,
                     borderRadius: 8,
                     backgroundColor: '#F0FFF4',
                  }}
                  onPress={() => navigation.goBack()}
               >
                  <Feather name="arrow-left" size={24} color="#374151" />
               </TouchableOpacity>
               <View className="flex-1 items-center">
                  <Text className="text-gray-900 text-xl font-bold text-center">
                     {project.title}
                  </Text>
                  <Text className="text-gray-500 text-sm text-center">
                     Profit Simulator
                  </Text>
               </View>
               <View style={{ width: 40 }}>
                  <Text> </Text>
               </View>
            </View>
         </View>

         <ScrollView className="flex-1 px-4 pt-32">
            {/* Professional table styling */}
            <View
               className="rounded-xl overflow-hidden border border-gray-200"
               style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 6,
                  elevation: 6,
                  backgroundColor: 'white',
               }}
            >
               <View className="bg-gray-50 p-4 border-b border-gray-200">
                  {/* <Text className="text-lg font-semibold text-gray-900">
                     {isMonthly ? 'Monthly' : 'Yearly'} Return Projection
                  </Text> */}
               </View>

               {/* Column Headers */}
               <View className="flex-row bg-gray-50 border-b border-gray-200">
                  <Text className="flex-1 py-4 px-4 text-sm font-semibold text-gray-700">
                     {isMonthly ? 'Month' : 'Year'}
                  </Text>
                  <Text className="flex-1 py-4 px-4 text-sm font-semibold text-gray-700 text-center">
                     Net Profit (FCFA)
                  </Text>
                  <Text className="flex-1 py-4 px-4 text-sm font-semibold text-gray-700 text-right">
                     ROI
                  </Text>
               </View>

               {/* Table Body */}
               {data.map((record, index) => (
                  <View
                     key={index}
                     className={`flex-row border-b border-gray-100 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-green-50'
                     }`}
                  >
                     <Text className="flex-1 py-4 px-4 text-sm text-gray-900">
                        {record.period}
                     </Text>
                     <Text className="flex-1 py-4 px-4 text-sm text-gray-900 text-center">
                        {record.netProfit.toLocaleString()} FCFA
                     </Text>
                     <Text className="flex-1 py-4 px-4 text-sm text-gray-900 text-right">
                        {record.roi}
                     </Text>
                  </View>
               ))}

               {/* Table Footer */}
               <View
                  className="flex-row bg-green-100 p-4"
                  style={{
                     borderTopWidth: 2,
                     borderTopColor: '#e2e8f0',
                  }}
               >
                  <Text className="flex-1 font-semibold text-gray-900">
                     Total
                  </Text>
                  <Text className="flex-1 font-semibold text-gray-900 text-center">
                     {totalNetProfit.toLocaleString()} FCFA
                  </Text>
                  <Text className="flex-1"></Text>
               </View>
            </View>

            {/* Disclaimer */}
            <View className="mt-6 p-4 bg-gray-50 rounded-lg">
               <Text className="text-sm text-gray-600 leading-relaxed">
                  The figures presented are estimates based on historical data
                  and projections. Actual returns may vary depending on market
                  conditions and other factors. Please consult with a financial
                  advisor before making investment decisions.
               </Text>
            </View>
         </ScrollView>

         {/* Footer Controls */}
         <View className="border-t border-gray-200 bg-white p-4">
            <View className="flex-row items-center justify-between mb-4">
               <View className="flex-row items-center space-x-4">
                  <TouchableOpacity
                     onPress={() => setUnit((prev) => Math.max(prev - 1, 1))}
                     className="w-10 h-10 rounded-lg items-center justify-center"
                     style={{
                        backgroundColor: '#f3f4f6',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                     }}
                  >
                     <Text className="text-gray-900 text-lg font-bold">-</Text>
                  </TouchableOpacity>

                  <Text className="text-lg font-medium text-gray-900 mx-3">
                     {unit} {unit === 1 ? 'Unit' : 'Units'}
                  </Text>

                  <TouchableOpacity
                     onPress={() =>
                        setUnit((prev) =>
                           maxUnits > 0 ? Math.min(prev + 1, maxUnits) : prev
                        )
                     }
                     className="w-10 h-10 rounded-lg items-center justify-center "
                     style={{
                        backgroundColor: '#f3f4f6',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                     }}
                     disabled={unit >= maxUnits}
                  >
                     <Text className="text-gray-900 text-lg font-bold">+</Text>
                  </TouchableOpacity>
               </View>

               <Text className="text-lg font-bold text-gray-900">
                  {(unit * project.unitPrice).toLocaleString()} FCFA
               </Text>
            </View>

            <TouchableOpacity
               className="bg-green-800 p-4 rounded-xl h-14"
               style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 4,
               }}
               onPress={handleInvestment}
            >
               <Text className="text-white font-bold text-center">
                  Invest Now ({unit} {unit === 1 ? 'Unit' : 'Units'})
               </Text>
            </TouchableOpacity>
         </View>

         <InvestmentModal
            visible={showInvestModal}
            onClose={() => setShowInvestModal(false)}
            onConfirm={handleConfirmInvestment}
            amount={unit * project.unitPrice}
            units={unit}
            projectTitle={project.title}
         />
      </SafeAreaView>
   );
};

export default ProfitSimulationScreen;
