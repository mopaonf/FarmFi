import React, { useState } from 'react';
import {
   View,
   Text,
   SafeAreaView,
   TouchableOpacity,
   TextInput,
   ActivityIndicator,
   Alert,
   StatusBar,
   ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Professional color palette
const Colors = {
   primary: '#2e7d32',
   primaryLight: '#4caf50',
   primaryDark: '#1b5e20',
   surface: '#ffffff',
   background: '#f8fdf9',
   card: '#ffffff',
   text: '#1a1a1a',
   textSecondary: '#6b7280',
   border: '#e5e7eb',
   success: '#10b981',
   warning: '#f59e0b',
   error: '#ef4444',
   info: '#3b82f6',
   shadow: 'rgba(46, 125, 50, 0.08)',
   inputBg: '#f9fafb',
};

interface PaymentMethod {
   id: string;
   name: string;
   icon: string;
   description: string;
}

const WalletOperationScreen: React.FC = () => {
   const { type } = useLocalSearchParams<{ type: 'deposit' | 'withdraw' }>();
   const router = useRouter();
   const [amount, setAmount] = useState('');
   const [displayAmount, setDisplayAmount] = useState('');
   const [description, setDescription] = useState('');
   const [selectedMethod, setSelectedMethod] = useState<string>('mobile');
   const [loading, setLoading] = useState(false);
   const [phoneNumber, setPhoneNumber] = useState('');
   const [ussdCode, setUssdCode] = useState('');

   const isDeposit = type === 'deposit';

   const paymentMethods: PaymentMethod[] = [
      {
         id: 'mobile',
         name: 'Mobile Money',
         icon: 'smartphone',
         description: 'MTN/Orange Money',
      },
      {
         id: 'bank',
         name: 'Bank Transfer',
         icon: 'briefcase',
         description: 'Direct transfer',
      },
      {
         id: 'card',
         name: 'Credit Card',
         icon: 'credit-card',
         description: 'Visa/Mastercard',
      },
   ];

   const handleSubmit = async () => {
      if (!amount || parseFloat(amount) <= 0) {
         console.log('Validation failed: Invalid amount', { amount });
         Alert.alert('Invalid Amount', 'Please enter a valid amount');
         return;
      }

      const minAmount = isDeposit ? 2 : 10000;
      if (parseFloat(amount) < minAmount) {
         console.log('Validation failed: Amount below minimum', {
            amount,
            minAmount,
         });
         Alert.alert(
            'Amount Too Low',
            `Minimum ${
               isDeposit ? 'deposit' : 'withdrawal'
            } is ${minAmount.toLocaleString()} FCFA`
         );
         return;
      }

      setLoading(true);
      console.log('Starting transaction...', {
         type,
         amount: parseFloat(amount),
         phoneNumber,
         method: selectedMethod,
         description,
      });

      try {
         const token = await AsyncStorage.getItem('token');
         console.log('Authorization token retrieved');

         console.log(
            'Sending request to:',
            `http://172.20.10.5:5000/api/wallets/${type}`
         );
         const response = await fetch(
            `http://172.20.10.5:5000/api/wallets/${type}`,
            {
               method: 'POST',
               headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
               },
               body: JSON.stringify({
                  amount: parseFloat(amount),
                  description: description || `${type} via ${selectedMethod}`,
                  method: selectedMethod,
                  phoneNumber,
               }),
            }
         );
         console.log('Response received:', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
         });

         const data = await response.json();
         console.log('Response data:', data);

         if (response.ok) {
            if (isDeposit && data.ussdCode) {
               setUssdCode(data.ussdCode);
               Alert.alert(
                  'Payment Instructions',
                  `Please dial ${data.ussdCode} to complete your payment\n\nOperator: ${data.operator}`,
                  [
                     {
                        text: 'OK',
                        onPress: async () => {
                           // Force refresh wallet data before going back
                           const token = await AsyncStorage.getItem('token');
                           await fetch(
                              'http://172.20.10.5:5000/api/wallets/stats',
                              {
                                 headers: { Authorization: `Bearer ${token}` },
                              }
                           );
                           router.back();
                        },
                     },
                  ]
               );
            } else {
               console.log('Transaction initiated successfully');
               Alert.alert(
                  'Transaction Initiated',
                  isDeposit
                     ? 'Your deposit request has been submitted. Follow the payment instructions.'
                     : 'Your withdrawal request has been submitted and will be processed shortly.',
                  [{ text: 'Continue', onPress: () => router.back() }]
               );
            }
         } else {
            console.error('Transaction failed:', data);
            Alert.alert(
               'Transaction Failed',
               data.message || 'Please try again'
            );
         }
      } catch (error) {
         console.error('Transaction error:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            response: error.response?.data,
         });

         let errorMessage = 'Please check your connection and try again';

         if (error instanceof SyntaxError && error.message.includes('JSON')) {
            errorMessage =
               'Invalid response from server. Please try again later.';
         } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
         } else if (error.message) {
            errorMessage = error.message;
         }

         Alert.alert('Transaction Failed', errorMessage, [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Retry', onPress: () => handleSubmit() },
         ]);
      } finally {
         setLoading(false);
         console.log('Transaction flow completed');
      }
   };

   const formatAmount = (value: string) => {
      const numericValue = value.replace(/[^0-9]/g, '');
      return numericValue ? parseInt(numericValue).toLocaleString() : '';
   };

   const handleAmountChange = (text: string) => {
      const numericValue = text.replace(/[^0-9]/g, '');
      setAmount(numericValue); // Store raw numeric value
      setDisplayAmount(formatAmount(numericValue)); // Display formatted value
   };

   const HeaderSection = () => (
      <View
         style={{
            backgroundColor: Colors.surface,
            shadowColor: Colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 4,
            elevation: 4,
         }}
         className="px-6 py-4"
      >
         <View className="flex-row items-center justify-between">
            <TouchableOpacity
               onPress={() => router.back()}
               style={{ backgroundColor: Colors.background }}
               className="w-12 h-12 items-center justify-center rounded-2xl"
            >
               <Feather name="arrow-left" size={20} color={Colors.text} />
            </TouchableOpacity>

            <View className="flex-1 items-center">
               <Text
                  style={{ color: Colors.text }}
                  className="text-xl font-bold"
               >
                  {isDeposit ? 'Add Funds' : 'Withdraw Funds'}
               </Text>
               <Text
                  style={{ color: Colors.textSecondary }}
                  className="text-sm mt-1"
               >
                  {isDeposit
                     ? 'Deposit money to your wallet'
                     : 'Transfer money from your wallet'}
               </Text>
            </View>

            <View className="w-12" />
         </View>
      </View>
   );

   const AmountInput = () => (
      <View
         style={{
            backgroundColor: Colors.card,
            shadowColor: Colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 8,
            elevation: 4,
         }}
         className="mx-6 mt-6 p-6 rounded-3xl"
      >
         <Text
            style={{ color: Colors.textSecondary }}
            className="text-sm font-medium mb-3 uppercase tracking-wide"
         >
            Transaction Amount
         </Text>

         <View className="flex-row items-center mb-2">
            <Text
               style={{ color: Colors.text, fontSize: 40, fontWeight: '300' }}
               className="mr-2"
            >
               FCFA
            </Text>
            <TextInput
               style={{
                  color: Colors.text,
                  fontSize: 40,
                  fontWeight: '300',
                  flex: 1,
               }}
               keyboardType="numeric"
               placeholder="0"
               placeholderTextColor={Colors.textSecondary}
               value={displayAmount}
               onChangeText={handleAmountChange}
            />
         </View>

         <View
            style={{ backgroundColor: Colors.border }}
            className="h-px my-4"
         />

         <TextInput
            style={{
               backgroundColor: Colors.inputBg,
               color: Colors.text,
            }}
            className="px-4 py-3 rounded-xl text-base"
            placeholder={`Add a note (optional)`}
            placeholderTextColor={Colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={2}
         />

         <TextInput
            style={{
               backgroundColor: Colors.inputBg,
               color: Colors.text,
            }}
            className="px-4 py-3 rounded-xl text-base mt-4"
            placeholder="Enter phone number"
            placeholderTextColor={Colors.textSecondary}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
         />
      </View>
   );

   const PaymentMethodSection = () => (
      <View className="mx-6 mt-6">
         <Text
            style={{ color: Colors.text }}
            className="text-lg font-bold mb-4"
         >
            Payment Method
         </Text>

         <View
            style={{
               backgroundColor: Colors.card,
               shadowColor: Colors.shadow,
               shadowOffset: { width: 0, height: 2 },
               shadowOpacity: 1,
               shadowRadius: 8,
               elevation: 4,
            }}
            className="rounded-2xl overflow-hidden"
         >
            {paymentMethods.map((method, index) => (
               <TouchableOpacity
                  key={method.id}
                  onPress={() => setSelectedMethod(method.id)}
                  style={{
                     backgroundColor:
                        selectedMethod === method.id
                           ? Colors.primary + '10'
                           : Colors.surface,
                     borderBottomWidth:
                        index < paymentMethods.length - 1 ? 1 : 0,
                     borderBottomColor: Colors.border,
                  }}
                  className="flex-row items-center p-4"
               >
                  <View
                     style={{
                        backgroundColor:
                           selectedMethod === method.id
                              ? Colors.primary
                              : Colors.background,
                     }}
                     className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                  >
                     <Feather
                        name={method.icon as any}
                        size={20}
                        color={
                           selectedMethod === method.id
                              ? Colors.surface
                              : Colors.textSecondary
                        }
                     />
                  </View>

                  <View className="flex-1">
                     <Text
                        style={{
                           color:
                              selectedMethod === method.id
                                 ? Colors.primary
                                 : Colors.text,
                        }}
                        className="text-base font-semibold"
                     >
                        {method.name}
                     </Text>
                     <Text
                        style={{ color: Colors.textSecondary }}
                        className="text-sm mt-1"
                     >
                        {method.description}
                     </Text>
                  </View>

                  {selectedMethod === method.id && (
                     <View
                        style={{ backgroundColor: Colors.primary }}
                        className="w-6 h-6 rounded-full items-center justify-center"
                     >
                        <Feather
                           name="check"
                           size={14}
                           color={Colors.surface}
                        />
                     </View>
                  )}
               </TouchableOpacity>
            ))}
         </View>
      </View>
   );

   const InfoCard = () => (
      <View className="mx-6 mt-6">
         <View
            style={{
               backgroundColor: isDeposit
                  ? Colors.success + '15'
                  : Colors.warning + '15',
               borderLeftWidth: 4,
               borderLeftColor: isDeposit ? Colors.success : Colors.warning,
            }}
            className="p-4 rounded-xl"
         >
            <View className="flex-row items-center mb-2">
               <Feather
                  name="info"
                  size={16}
                  color={isDeposit ? Colors.success : Colors.warning}
               />
               <Text
                  style={{ color: isDeposit ? Colors.success : Colors.warning }}
                  className="ml-2 font-semibold text-sm"
               >
                  Transaction Information
               </Text>
            </View>
            <Text
               style={{ color: Colors.text }}
               className="text-sm leading-relaxed"
            >
               {isDeposit
                  ? '• Deposits are processed within 5-30 minutes\n• Minimum deposit: 5,000 FCFA\n• No transaction fees for deposits above 20,000 FCFA'
                  : '• Withdrawals take 1-3 business days to process\n• Minimum withdrawal: 10,000 FCFA\n• Standard processing fee: 2.5% (max 5,000 FCFA)'}
            </Text>
         </View>
      </View>
   );

   return (
      <SafeAreaView
         style={{ backgroundColor: Colors.background }}
         className="flex-1"
      >
         <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

         <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
         >
            <HeaderSection />
            <AmountInput />
            <PaymentMethodSection />
            <InfoCard />

            {/* Submit Button */}
            <View className="mx-6 mt-8 mb-6">
               <TouchableOpacity
                  style={{
                     backgroundColor: loading
                        ? Colors.textSecondary
                        : Colors.primary,
                     shadowColor: Colors.primary,
                     shadowOffset: { width: 0, height: 4 },
                     shadowOpacity: 0.3,
                     shadowRadius: 8,
                     elevation: 8,
                  }}
                  className="py-4 rounded-2xl"
                  onPress={handleSubmit}
                  disabled={loading || !amount}
               >
                  {loading ? (
                     <View className="flex-row items-center justify-center">
                        <ActivityIndicator
                           color={Colors.surface}
                           size="small"
                        />
                        <Text className="text-white font-semibold text-lg ml-2">
                           Processing...
                        </Text>
                     </View>
                  ) : (
                     <Text className="text-white text-center font-bold text-lg">
                        {isDeposit ? 'Initiate Deposit' : 'Request Withdrawal'}
                     </Text>
                  )}
               </TouchableOpacity>
            </View>
         </ScrollView>
      </SafeAreaView>
   );
};

export default WalletOperationScreen;
