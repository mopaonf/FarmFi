import React, { useState } from 'react';
import {
   View,
   Text,
   SafeAreaView,
   TouchableOpacity,
   TextInput,
   ActivityIndicator,
   Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/Colors';

const WalletOperationScreen: React.FC = () => {
   const { type } = useLocalSearchParams<{ type: 'deposit' | 'withdraw' }>();
   const router = useRouter();
   const [amount, setAmount] = useState('');
   const [description, setDescription] = useState('');
   const [loading, setLoading] = useState(false);

   const isDeposit = type === 'deposit';

   const handleSubmit = async () => {
      if (!amount || parseFloat(amount) <= 0) {
         Alert.alert('Error', 'Please enter a valid amount');
         return;
      }

      setLoading(true);
      try {
         const token = await AsyncStorage.getItem('token');
         const response = await fetch(
            `http://192.168.5.1:5000/api/wallet/${type}`,
            {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
               },
               body: JSON.stringify({
                  amount: parseFloat(amount),
                  description: description || `${type} transaction`,
               }),
            }
         );

         const data = await response.json();
         if (response.ok) {
            Alert.alert(
               'Success',
               isDeposit
                  ? 'Deposit initiated successfully'
                  : 'Withdrawal request submitted',
               [{ text: 'OK', onPress: () => router.back() }]
            );
         } else {
            Alert.alert('Error', data.message);
         }
      } catch (error) {
         Alert.alert('Error', 'Transaction failed. Please try again.');
      } finally {
         setLoading(false);
      }
   };

   return (
      <SafeAreaView className="flex-1 bg-white">
         {/* Header */}
         <View className="px-4 py-4 border-b border-gray-100">
            <View className="flex-row items-center">
               <TouchableOpacity
                  onPress={() => router.back()}
                  className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
               >
                  <Feather name="arrow-left" size={24} color="#374151" />
               </TouchableOpacity>
               <Text className="flex-1 text-xl font-semibold text-center mr-10">
                  {isDeposit ? 'Deposit Funds' : 'Withdraw Funds'}
               </Text>
            </View>
         </View>

         <View className="p-6">
            {/* Amount Input */}
            <View className="mb-6">
               <Text className="text-sm text-gray-600 mb-2">Amount (FCFA)</Text>
               <View className="flex-row items-center border border-gray-200 rounded-xl px-4 py-3 bg-gray-50">
                  <Text className="text-lg text-gray-700 mr-2">FCFA</Text>
                  <TextInput
                     className="flex-1 text-lg"
                     keyboardType="numeric"
                     placeholder="0.00"
                     value={amount}
                     onChangeText={setAmount}
                  />
               </View>
            </View>

            {/* Description Input */}
            <View className="mb-8">
               <Text className="text-sm text-gray-600 mb-2">
                  Description (Optional)
               </Text>
               <TextInput
                  className="border border-gray-200 rounded-xl px-4 py-3 bg-gray-50"
                  placeholder={`Enter ${type} description`}
                  value={description}
                  onChangeText={setDescription}
                  multiline
               />
            </View>

            {/* Transaction Method Selection */}
            <View className="mb-8">
               <Text className="text-sm text-gray-600 mb-4">Select Method</Text>
               <View className="flex-row justify-between">
                  {['Mobile Money', 'Bank Transfer', 'Card'].map((method) => (
                     <TouchableOpacity
                        key={method}
                        className="bg-gray-50 p-4 rounded-xl items-center justify-center border border-gray-200"
                        style={{ width: '31%' }}
                     >
                        <Feather
                           name={
                              method === 'Mobile Money'
                                 ? 'smartphone'
                                 : method === 'Bank Transfer'
                                 ? 'briefcase'
                                 : 'credit-card'
                           }
                           size={24}
                           color={Colors.light.primary}
                        />
                        <Text className="text-sm text-gray-700 mt-2">
                           {method}
                        </Text>
                     </TouchableOpacity>
                  ))}
               </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
               className={`py-4 rounded-xl ${
                  loading ? 'bg-gray-300' : 'bg-orange-500'
               }`}
               onPress={handleSubmit}
               disabled={loading}
            >
               {loading ? (
                  <ActivityIndicator color="white" />
               ) : (
                  <Text className="text-white text-center font-semibold text-lg">
                     {isDeposit ? 'Deposit Now' : 'Withdraw Now'}
                  </Text>
               )}
            </TouchableOpacity>

            {/* Additional Info */}
            <View className="mt-6 p-4 bg-blue-50 rounded-xl">
               <Text className="text-sm text-blue-800">
                  {isDeposit
                     ? '• Deposits are typically processed within 24 hours\n• Minimum deposit amount: 5,000 FCFA'
                     : '• Withdrawals are processed within 1-3 business days\n• Minimum withdrawal: 10,000 FCFA'}
               </Text>
            </View>
         </View>
      </SafeAreaView>
   );
};

export default WalletOperationScreen;
