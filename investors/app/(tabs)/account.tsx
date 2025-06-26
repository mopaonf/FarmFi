import React, { useState, useEffect } from 'react';
import {
   View,
   Text,
   SafeAreaView,
   Image,
   TouchableOpacity,
   ScrollView,
   StatusBar,
   RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import ProfileMenuItem from '../../components/ProfileMenuItem';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/formatCurrency';

// Professional color palette based on green theme
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
   shadow: 'rgba(46, 125, 50, 0.08)',
};

interface WalletStats {
   balance: number;
   totalInvested: number;
   totalReturns: number;
   pendingReturns: number;
   recentTransactions: any[];
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
   const [refreshing, setRefreshing] = useState(false);

   useEffect(() => {
      fetchWalletData();
   }, [user?._id]);

   const fetchWalletData = async () => {
      try {
         setLoading(true);
         const token = await AsyncStorage.getItem('token');
         if (!token || !user?._id) return;

         const response = await fetch(
            `http://172.20.10.5:5000/api/wallets/stats`,
            {
               headers: { Authorization: `Bearer ${token}` },
            }
         );

         if (!response.ok) throw new Error('Failed to fetch wallet data');

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
         setWalletData({ balance: 0, totalInvestment: 0, totalReturn: 0 });
      } finally {
         setLoading(false);
      }
   };

   const handleLogout = async () => {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      logout();
      router.replace('/(auth)');
   };

   const onRefresh = React.useCallback(async () => {
      setRefreshing(true);
      await fetchWalletData();
      setRefreshing(false);
   }, []);

   const WalletCard = () => (
      <View className="mx-6 mb-6">
         <View
            style={{
               backgroundColor: Colors.card,
               shadowColor: Colors.shadow,
               shadowOffset: { width: 0, height: 4 },
               shadowOpacity: 1,
               shadowRadius: 12,
               elevation: 8,
            }}
            className="rounded-3xl p-6"
         >
            <View className="flex-row items-center justify-between mb-6">
               <Text
                  style={{ color: Colors.textSecondary }}
                  className="text-sm font-medium uppercase tracking-wide"
               >
                  Portfolio Overview
               </Text>
               <View
                  style={{ backgroundColor: Colors.primary + '15' }}
                  className="px-3 py-1 rounded-full"
               >
                  <Text
                     style={{ color: Colors.primary }}
                     className="text-xs font-semibold"
                  >
                     ACTIVE
                  </Text>
               </View>
            </View>

            {loading ? (
               <View className="items-center py-8">
                  <Text style={{ color: Colors.textSecondary }}>
                     Loading portfolio...
                  </Text>
               </View>
            ) : error ? (
               <View className="items-center py-8">
                  <Text
                     style={{ color: Colors.error }}
                     className="text-sm mb-3"
                  >
                     {error}
                  </Text>
                  <TouchableOpacity
                     onPress={fetchWalletData}
                     style={{ backgroundColor: Colors.primary }}
                     className="px-4 py-2 rounded-lg"
                  >
                     <Text className="text-white font-medium">Retry</Text>
                  </TouchableOpacity>
               </View>
            ) : (
               <>
                  <View className="mb-8">
                     <Text
                        style={{ color: Colors.textSecondary }}
                        className="text-sm font-medium mb-1"
                     >
                        Total Balance
                     </Text>
                     <Text
                        style={{ color: Colors.text }}
                        className="text-4xl font-bold"
                     >
                        {formatCurrency(walletData.balance)}
                     </Text>
                  </View>

                  <View className="flex-row justify-between mb-8">
                     <View className="flex-1">
                        <Text
                           style={{ color: Colors.textSecondary }}
                           className="text-xs font-medium mb-1"
                        >
                           INVESTED
                        </Text>
                        <Text
                           style={{ color: Colors.text }}
                           className="text-lg font-semibold"
                        >
                           {formatCurrency(walletData.totalInvestment)}
                        </Text>
                     </View>
                     <View className="flex-1 items-end">
                        <Text
                           style={{ color: Colors.textSecondary }}
                           className="text-xs font-medium mb-1"
                        >
                           RETURNS
                        </Text>
                        <Text
                           style={{ color: Colors.success }}
                           className="text-lg font-semibold"
                        >
                           +{formatCurrency(walletData.totalReturn)}
                        </Text>
                     </View>
                  </View>

                  <View className="flex-row space-x-3">
                     <TouchableOpacity
                        onPress={() => router.push('/wallet/deposit')}
                        style={{ backgroundColor: Colors.primary }}
                        className="flex-1 py-4 rounded-2xl items-center"
                     >
                        <Text className="text-white font-semibold text-base">
                           Deposit
                        </Text>
                     </TouchableOpacity>
                     <TouchableOpacity
                        onPress={() => router.push('/wallet/withdraw')}
                        style={{
                           backgroundColor: Colors.background,
                           borderWidth: 2,
                           borderColor: Colors.border,
                        }}
                        className="flex-1 py-4 rounded-2xl items-center"
                     >
                        <Text
                           style={{ color: Colors.text }}
                           className="font-semibold text-base"
                        >
                           Withdraw
                        </Text>
                     </TouchableOpacity>
                  </View>
               </>
            )}
         </View>
      </View>
   );

   const ProfileHeader = () => (
      <View className="px-6 pt-4 pb-6">
         <View className="flex-row items-center">
            <View className="relative">
               <Image
                  source={require('../../assets/images/Profile_Picture.jpg')}
                  className="w-20 h-20 rounded-2xl"
                  resizeMode="cover"
               />
               <View
                  style={{ backgroundColor: Colors.success }}
                  className="w-4 h-4 rounded-full border-2 border-white absolute -bottom-1 -right-1"
               />
            </View>

            <View className="flex-1 ml-4">
               <Text
                  style={{ color: Colors.text }}
                  className="text-xl font-bold mb-1"
               >
                  {user?.name}
               </Text>
               <Text
                  style={{ color: Colors.textSecondary }}
                  className="text-base mb-2"
               >
                  @{user?.username}
               </Text>
               <View className="flex-row items-center">
                  <Feather name="mail" size={14} color={Colors.textSecondary} />
                  <Text
                     style={{ color: Colors.textSecondary }}
                     className="ml-2 text-sm"
                  >
                     {user?.email}
                  </Text>
               </View>
            </View>
         </View>
      </View>
   );

   const MenuSection = () => (
      <View
         style={{ backgroundColor: Colors.background }}
         className="flex-1 rounded-t-3xl pt-6"
      >
         <Text
            style={{ color: Colors.text }}
            className="text-lg font-bold px-6 mb-4"
         >
            Account Management
         </Text>

         <View className="mx-6 mb-6">
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
               <ProfileMenuItem
                  title="Contact Information"
                  onPress={() => {}}
                  icon="user"
               />
               <ProfileMenuItem
                  title="Funding Sources"
                  onPress={() => {}}
                  icon="dollar-sign"
               />
               <ProfileMenuItem
                  title="Bank Accounts"
                  onPress={() => {}}
                  icon="credit-card"
               />
               <ProfileMenuItem
                  title="Documents"
                  onPress={() => {}}
                  icon="file-text"
               />
               <ProfileMenuItem
                  title="Settings"
                  onPress={() => {}}
                  icon="settings"
               />
               <ProfileMenuItem
                  title="Sign Out"
                  onPress={handleLogout}
                  icon="log-out"
               />
            </View>
         </View>
      </View>
   );

   return (
      <SafeAreaView
         style={{ backgroundColor: Colors.surface }}
         className="flex-1"
      >
         <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
         <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={
               <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[Colors.primary]}
                  tintColor={Colors.primary}
               />
            }
         >
            <ProfileHeader />
            <WalletCard />
            <MenuSection />
         </ScrollView>
      </SafeAreaView>
   );
};

export default AccountScreen;
