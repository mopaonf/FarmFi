import React, { useState, useEffect } from 'react';
import {
   View,
   Text,
   SafeAreaView,
   Image,
   TouchableOpacity,
   ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import ProfileMenuItem from '../../components/ProfileMenuItem';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatCurrency';

interface WalletStats {
   balance: number;
   totalInvested: number;
   totalReturns: number;
   pendingReturns: number;
   recentTransactions: any[]; // We can type this more specifically later
}

const AccountScreen: React.FC = () => {
   const { user, logout } = useAuth();
   const router = useRouter();
   const [walletData, setWalletData] = useState({
      balance: 0,
      totalInvestment: 0,
      totalReturn: 0,
   });
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const fetchWalletData = async () => {
         try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            if (!token || !user?._id) return;

            const response = await fetch(
               `http://192.168.5.1:5000/api/wallets/stats`,
               {
                  headers: {
                     Authorization: `Bearer ${token}`,
                  },
               }
            );

            if (!response.ok) {
               throw new Error('Failed to fetch wallet data');
            }

            const data: WalletStats = await response.json();
            setWalletData({
               balance: data.balance,
               totalInvestment: data.totalInvested,
               totalReturn: data.totalReturns,
            });
            setError(null);
         } catch (error) {
            console.error('Error fetching wallet data:', error);
            setError('Failed to load wallet data');
            setWalletData({
               balance: 0,
               totalInvestment: 0,
               totalReturn: 0,
            });
         } finally {
            setLoading(false);
         }
      };

      fetchWalletData();
   }, [user?._id]);

   const handleLogout = async () => {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      logout();
      router.replace('/(auth)'); // Updated navigation path
   };

   const renderWalletSection = () => {
      if (loading) {
         return (
            <View className="px-6 pb-6">
               <View className="bg-white rounded-2xl p-4 shadow-sm items-center justify-center">
                  <Text className="text-gray-500">Loading wallet data...</Text>
               </View>
            </View>
         );
      }

      if (error) {
         return (
            <View className="px-6 pb-6">
               <View className="bg-white rounded-2xl p-4 shadow-sm items-center justify-center">
                  <Text className="text-red-500">{error}</Text>
                  <TouchableOpacity
                     className="mt-2 bg-gray-100 px-4 py-2 rounded-lg"
                     onPress={() => fetchWalletData()}
                  >
                     <Text>Retry</Text>
                  </TouchableOpacity>
               </View>
            </View>
         );
      }

      return (
         <View className="px-6 pb-6">
            <View className="bg-white rounded-2xl p-4 shadow-sm">
               <Text className="text-lg font-[Poppins_500Medium] text-gray-800 mb-4">
                  Wallet Balance
               </Text>
               <Text className="text-3xl font-[Poppins_600SemiBold] text-gray-900 mb-6">
                  {formatCurrency(walletData.balance)}
               </Text>

               <View className="flex-row justify-between">
                  <View>
                     <Text className="text-sm font-[Poppins_400Regular] text-gray-500">
                        Total Investment
                     </Text>
                     <Text className="text-base font-[Poppins_500Medium] text-gray-800">
                        {formatCurrency(walletData.totalInvestment)}
                     </Text>
                  </View>
                  <View>
                     <Text className="text-sm font-[Poppins_400Regular] text-gray-500">
                        Total Returns
                     </Text>
                     <Text
                        className="text-base font-[Poppins_500Medium]"
                        style={{ color: Colors.light.success }}
                     >
                        +{formatCurrency(walletData.totalReturn)}
                     </Text>
                  </View>
               </View>

               {/* Add Wallet Actions */}
               <View className="flex-row justify-between mt-6 pt-6 border-t border-gray-100">
                  <TouchableOpacity
                     className="flex-1 mr-2 bg-orange-500 py-3 rounded-xl items-center"
                     onPress={() => router.push('/wallet/deposit')}
                  >
                     <Text className="text-white font-[Poppins_500Medium]">
                        Deposit
                     </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                     className="flex-1 ml-2 bg-gray-100 py-3 rounded-xl items-center"
                     onPress={() => router.push('/wallet/withdraw')}
                  >
                     <Text className="text-gray-700 font-[Poppins_500Medium]">
                        Withdraw
                     </Text>
                  </TouchableOpacity>
               </View>
            </View>
         </View>
      );
   };

   return (
      <SafeAreaView
         style={{ backgroundColor: Colors.light.surface }}
         className="flex-1"
      >
         <ScrollView>
            {/* Profile Header Section */}
            <View className="px-6 pt-8 pb-10">
               <View className="flex-row">
                  {/* Profile Picture Container */}
                  <View
                     style={{ backgroundColor: Colors.light.surface }}
                     className="w-[100px] h-[100px] rounded-full shadow-lg relative"
                  >
                     <Image
                        source={require('../../assets/images/Profile_Picture.jpg')}
                        className="w-full h-full rounded-full"
                        resizeMode="cover"
                     />
                     {/* Status Indicator */}
                     <View
                        style={{
                           backgroundColor: Colors.light.success,
                           borderColor: Colors.light.surface,
                        }}
                        className="w-[14px] h-[14px] rounded-full border-2 absolute bottom-0.5 right-0.5"
                     />
                  </View>

                  {/* Profile Info */}
                  <View className="flex-1 justify-center pl-6">
                     <Text
                        style={{ color: Colors.light.text }}
                        className="text-2xl font-[Poppins_500Medium] mb-1"
                     >
                        @{user?.username}
                     </Text>
                     <Text
                        style={{ color: Colors.light.text }}
                        className="text-lg font-[Poppins_400Regular] mb-1"
                     >
                        {user?.name}
                     </Text>
                     <View className="flex-row items-center mb-1">
                        <Feather
                           name="mail"
                           size={14}
                           color={Colors.light.icon}
                        />
                        <Text
                           style={{ color: Colors.light.icon }}
                           className="ml-2 text-sm font-[Poppins_400Regular]"
                        >
                           {user?.email}
                        </Text>
                     </View>
                     <View className="flex-row items-center">
                        <View
                           style={{
                              backgroundColor: Colors.light.primary + '15',
                           }}
                           className="px-3 py-1 mt-2 rounded-full"
                        >
                           <Text
                              style={{ color: Colors.light.primary }}
                              className="text-xs font-[Poppins_500Medium]"
                           >
                              Active Investor
                           </Text>
                        </View>
                     </View>
                  </View>
               </View>
            </View>

            {/* Wallet Section */}
            {renderWalletSection()}

            {/* Menu Section - Modified */}
            <View
               style={{ backgroundColor: Colors.light.surfaceHover }}
               className="rounded-t-[30px] pt-6 pb-8" // Added pb-8 for bottom padding
            >
               <Text
                  style={{ color: Colors.light.text }}
                  className="text-base font-[Poppins_500Medium] ml-6 mb-4"
               >
                  Account Settings
               </Text>
               <View
                  style={{ backgroundColor: Colors.light.surface }}
                  className="mx-4 rounded-2xl shadow-sm"
               >
                  <ProfileMenuItem
                     title="Contact Info"
                     onPress={() => {}}
                     icon="user"
                  />
                  <ProfileMenuItem
                     title="Source of Funding Info"
                     onPress={() => {}}
                     icon="dollar-sign"
                  />
                  <ProfileMenuItem
                     title="Bank Account Info"
                     onPress={() => {}}
                     icon="credit-card"
                  />
                  <ProfileMenuItem
                     title="Document Info"
                     onPress={() => {}}
                     icon="file-text"
                  />
                  <ProfileMenuItem
                     title="Settings"
                     onPress={() => {}}
                     icon="settings"
                  />
                  <ProfileMenuItem
                     title="Logout"
                     onPress={handleLogout}
                     icon="log-out"
                  />
               </View>
            </View>
         </ScrollView>
      </SafeAreaView>
   );
};

export default AccountScreen;
