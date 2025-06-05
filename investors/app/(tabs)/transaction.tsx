import React, { useEffect, useState, useCallback } from 'react';
import {
   View,
   SafeAreaView,
   ScrollView,
   Text,
   ActivityIndicator,
   RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { formatCurrency } from '../../utils/formatCurrency';
import TabSwitcher from '../../components/TabSwitcher';
import TransactionHistoryItem from '../../components/TransactionHistoryItem';
import ProjectUpdateItem from '../../components/ProjectUpdateItem';
import SearchBar from '../../components/SearchBar';

interface Transaction {
   type: 'deposit' | 'withdrawal' | 'investment' | 'payout';
   amount: number;
   description: string;
   timestamp: string;
   status: 'pending' | 'confirmed' | 'failed';
   reference: string;
   projectDetails?: {
      title: string;
      units: number;
   };
}

const TransactionScreen: React.FC = () => {
   const [transactions, setTransactions] = useState<Transaction[]>([]);
   const [filteredTransactions, setFilteredTransactions] = useState<
      Transaction[]
   >([]);
   const [loading, setLoading] = useState(true);
   const [activeTab, setActiveTab] = React.useState<'history' | 'updates'>(
      'history'
   );
   const [refreshing, setRefreshing] = useState(false);

   const fetchTransactions = async () => {
      try {
         const token = await AsyncStorage.getItem('token');
         const response = await fetch(
            'http://192.168.5.1:5000/api/wallets/transactions',
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         );
         if (!response.ok) {
            throw new Error('Failed to fetch transactions');
         }
         const data = await response.json();
         setTransactions(data);
         setFilteredTransactions(data);
      } catch (error) {
         console.error('Error fetching transactions:', error);
         setTransactions([]);
         setFilteredTransactions([]);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchTransactions();
   }, []);

   const onRefresh = useCallback(async () => {
      setRefreshing(true);
      await fetchTransactions();
      setRefreshing(false);
   }, []);

   const handleSearch = (searchText: string) => {
      if (!searchText.trim()) {
         setFilteredTransactions(transactions);
         return;
      }

      const searchQuery = searchText.toLowerCase();
      const filtered = transactions.filter((transaction) => {
         return (
            transaction.description?.toLowerCase().includes(searchQuery) ||
            transaction.reference?.toLowerCase().includes(searchQuery) ||
            transaction.projectDetails?.title
               ?.toLowerCase()
               .includes(searchQuery)
         );
      });

      setFilteredTransactions(filtered);
   };

   const getTransactionIcon = (type: string) => {
      switch (type) {
         case 'deposit':
            return 'arrow-down-circle';
         case 'withdrawal':
            return 'arrow-up-circle';
         case 'investment':
            return 'shopping-bag';
         case 'payout':
            return 'dollar-sign';
         default:
            return 'circle';
      }
   };

   const getTransactionColor = (type: string) => {
      switch (type) {
         case 'deposit':
         case 'payout':
            return Colors.light.success;
         case 'withdrawal':
         case 'investment':
            return Colors.light.primary;
         default:
            return Colors.light.text;
      }
   };

   const renderContent = () => {
      if (activeTab === 'history') {
         if (filteredTransactions.length === 0) {
            return (
               <View className="flex-1 justify-center items-center p-4">
                  <Text className="text-gray-500 text-center">
                     No transactions found
                  </Text>
               </View>
            );
         }

         return (
            <ScrollView
               className="flex-1 px-4"
               refreshControl={
                  <RefreshControl
                     refreshing={refreshing}
                     onRefresh={onRefresh}
                     colors={['#2e7d32']}
                     tintColor="#2e7d32"
                  />
               }
            >
               {filteredTransactions.map((transaction, index) => (
                  <View
                     key={transaction.reference || index}
                     className="flex-row items-center p-4 bg-white rounded-xl mb-3 shadow-sm"
                  >
                     <View
                        style={{
                           backgroundColor: `${getTransactionColor(
                              transaction.type
                           )}15`,
                        }}
                        className="w-12 h-12 rounded-full items-center justify-center mr-4"
                     >
                        <Feather
                           name={getTransactionIcon(transaction.type)}
                           size={24}
                           color={getTransactionColor(transaction.type)}
                        />
                     </View>
                     <View className="flex-1">
                        <Text className="text-base font-[Poppins_500Medium] text-gray-900">
                           {transaction.description}
                        </Text>
                        {transaction.type === 'investment' &&
                           transaction.projectDetails && (
                              <Text className="text-xs text-gray-500 mt-1">
                                 {transaction.projectDetails.units} units
                              </Text>
                           )}
                        <View className="flex-row items-center mt-1">
                           <Text className="text-sm text-gray-500 mr-2">
                              {new Date(
                                 transaction.timestamp
                              ).toLocaleDateString()}
                           </Text>
                           <View
                              style={{
                                 backgroundColor:
                                    getStatusColor(transaction.status) + '15',
                                 paddingHorizontal: 8,
                                 paddingVertical: 2,
                                 borderRadius: 12,
                              }}
                           >
                              <Text
                                 style={{
                                    color: getStatusColor(transaction.status),
                                 }}
                                 className="text-xs font-[Poppins_500Medium] capitalize"
                              >
                                 {transaction.status}
                              </Text>
                           </View>
                        </View>
                     </View>
                     <Text
                        className={`text-base font-[Poppins_600SemiBold] ${
                           ['deposit', 'payout'].includes(transaction.type)
                              ? 'text-green-600'
                              : 'text-orange-500'
                        }`}
                     >
                        {['deposit', 'payout'].includes(transaction.type)
                           ? '+'
                           : '-'}
                        {formatCurrency(transaction.amount)}
                     </Text>
                  </View>
               ))}
            </ScrollView>
         );
      }

      return (
         <ScrollView className="flex-1 px-4">
            <ProjectUpdateItem
               projectName="Durian Investment"
               stages={[
                  {
                     title: 'Planting Seeds',
                     date: '2024-01-01',
                     images: [
                        'path/to/seed1.jpg',
                        'path/to/seed2.jpg',
                        'path/to/seed3.jpg',
                     ],
                  },
                  {
                     title: 'Land Cultivation',
                     date: '2024-01-15',
                     images: ['path/to/land1.jpg', 'path/to/land2.jpg'],
                  },
               ]}
            />
            <ProjectUpdateItem
               projectName="Corn Partnership with Sipurio Farmer Group"
               stages={[
                  {
                     title: 'Initial Planting',
                     date: '2024-01-05',
                     images: ['path/to/corn1.jpg', 'path/to/corn2.jpg'],
                  },
               ]}
            />
         </ScrollView>
      );
   };

   const getStatusColor = (status: string) => {
      switch (status) {
         case 'pending':
            return Colors.light.warning;
         case 'confirmed':
            return Colors.light.success;
         case 'failed':
            return Colors.light.error;
         default:
            return Colors.light.text;
      }
   };

   return (
      <SafeAreaView className="flex-1 bg-white">
         <View className="pt-2 px-6">
            <SearchBar
               onSearch={handleSearch}
               placeholder="Search transactions..."
            />
         </View>

         <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
         {loading ? (
            <View className="flex-1 justify-center items-center">
               <ActivityIndicator size="large" color={Colors.light.primary} />
            </View>
         ) : (
            renderContent()
         )}
      </SafeAreaView>
   );
};

export default TransactionScreen;
