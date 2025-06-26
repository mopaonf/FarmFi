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
import ProjectLocationButton from '../../components/ProjectLocationButton';

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

interface Project {
   _id: string;
   name?: string;
   title?: string;
   description: string;
   updates: ProjectUpdate[];
   fundingProgress?: number;
   funding_progress?: number; // Backend uses this field name
   status?: string;
   fundingStatus?: string; // Backend uses this field name
   expectedReturn?: number;
   expected_roi_range?: string;
   unitPrice?: number;
}

interface ProjectUpdate {
   title: string;
   date: string;
   images: string[];
}

interface UserInvestment {
   _id: string;
   project: Project;
   amount: number;
   units: number;
   status: string;
   createdAt?: string;
   updatedAt?: string;
}

const TransactionScreen: React.FC = () => {
   const [transactions, setTransactions] = useState<Transaction[]>([]);
   const [filteredTransactions, setFilteredTransactions] = useState<
      Transaction[]
   >([]);
   const [userInvestments, setUserInvestments] = useState<UserInvestment[]>([]);
   const [loading, setLoading] = useState(true);
   const [loadingInvestments, setLoadingInvestments] = useState(true);
   const [activeTab, setActiveTab] = React.useState<'history' | 'updates'>(
      'history'
   );
   const [refreshing, setRefreshing] = useState(false);

   const fetchTransactions = async () => {
      try {
         const token = await AsyncStorage.getItem('token');
         const response = await fetch(
            'http://172.20.10.5:5000/api/wallets/transactions',
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
   const fetchUserInvestments = async () => {
      try {
         setLoadingInvestments(true);
         const token = await AsyncStorage.getItem('token');
         if (!token) {
            throw new Error('No authentication token found');
         }

         const response = await fetch(
            'http://172.20.10.5:5000/api/investments/my-investments',
            {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            }
         );

         if (!response.ok) {
            throw new Error('Failed to fetch investments');
         }

         const data = await response.json();
         console.log('Fetched investments data:', data);
         console.log(
            'First investment project structure:',
            data.length > 0 ? data[0].project : 'No investments'
         );

         // Ensure data is an array before setting it
         setUserInvestments(Array.isArray(data) ? data : []);
      } catch (error) {
         console.error('Error fetching user investments:', error);
         setUserInvestments([]);
      } finally {
         setLoadingInvestments(false);
      }
   };

   useEffect(() => {
      fetchTransactions();
      fetchUserInvestments();
   }, []);

   const onRefresh = useCallback(async () => {
      setRefreshing(true);
      if (activeTab === 'history') {
         await fetchTransactions();
      } else {
         await fetchUserInvestments();
      }
      setRefreshing(false);
   }, [activeTab]);

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

      // Updates tab
      if (loadingInvestments) {
         return (
            <View className="flex-1 justify-center items-center">
               <ActivityIndicator size="large" color={Colors.light.primary} />
            </View>
         );
      }

      // Ensure userInvestments is an array before using map()
      const investments = Array.isArray(userInvestments) ? userInvestments : [];

      if (investments.length === 0) {
         return (
            <View className="flex-1 justify-center items-center p-4">
               <Text className="text-gray-500 text-center">
                  You haven't invested in any projects yet
               </Text>
            </View>
         );
      }

      // Group investments by project ID and sum up total units
      const projectSummaries = investments.reduce<Record<string, any>>(
         (acc, investment) => {
            if (
               investment.project &&
               (investment.project._id ||
                  investment.project.title ||
                  investment.project.name)
            ) {
               const projectId = String(
                  investment.project._id ||
                     investment.project.title ||
                     investment.project.name
               );

               if (!acc[projectId]) {
                  acc[projectId] = {
                     project: investment.project,
                     totalUnitsInvested: 0,
                     totalAmountInvested: 0,
                     investmentDate:
                        investment.createdAt || new Date().toISOString(),
                  };
               }

               // Sum up units and amount for this project
               acc[projectId].totalUnitsInvested += investment.units || 0;
               acc[projectId].totalAmountInvested += investment.amount || 0;

               // Keep track of earliest investment date
               const currentDate = new Date(investment.createdAt || new Date());
               const existingDate = new Date(acc[projectId].investmentDate);
               if (currentDate < existingDate) {
                  acc[projectId].investmentDate = investment.createdAt;
               }
            }
            return acc;
         },
         {}
      );

      // Convert to array
      const projectSummaryList = Object.values(projectSummaries);

      // Sort projects by name/title for consistency
      projectSummaryList.sort((a, b) => {
         const nameA = (a.project.title || a.project.name || '').toLowerCase();
         const nameB = (b.project.title || b.project.name || '').toLowerCase();
         return nameA.localeCompare(nameB);
      });

      console.log(
         `Found ${investments.length} investments across ${projectSummaryList.length} unique projects`
      );

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
            <View className="my-3 mx-2">
               <ProjectLocationButton />
            </View>

            {projectSummaryList.map((summary, index) => {
               // Extract project data
               const project = summary.project;

               // Ensure all fields have values or reasonable defaults
               const returnRate = parseFloat(
                  project.expectedReturn ||
                     (project.expected_roi_range
                        ? project.expected_roi_range.split('-')[0]
                        : '10')
               );

               const unitPrice = project.unitPrice || 1000;

               const expectedProfit =
                  project.expectedProfit ||
                  summary.totalAmountInvested * (returnRate / 100);

               // Use the correct field names from the backend
               const fundingProgress =
                  typeof project.funding_progress !== 'undefined'
                     ? project.funding_progress
                     : typeof project.fundingProgress !== 'undefined'
                     ? project.fundingProgress
                     : 0;

               const projectStatus =
                  project.fundingStatus || project.status || '';

               console.log(
                  `Project ${
                     project.title || project.name || 'Unknown'
                  } - Status: ${projectStatus}, Progress: ${fundingProgress}`
               );

               return (
                  <ProjectUpdateItem
                     key={project._id || index}
                     projectId={project._id}
                     projectName={
                        project.title || project.name || 'Unnamed Project'
                     }
                     description={
                        project.description ||
                        'This farming project aims to deliver sustainable returns while promoting agricultural development.'
                     }
                     stages={
                        project.updates && project.updates.length > 0
                           ? project.updates
                           : [
                                {
                                   title: 'Project Started',
                                   date: new Date(
                                      summary.investmentDate || new Date()
                                   ).toLocaleDateString(),
                                   images: [],
                                },
                             ]
                     }
                     totalUnitsInvested={summary.totalUnitsInvested}
                     unitPrice={unitPrice}
                     totalAmountInvested={summary.totalAmountInvested} // Pass the actual total amount invested
                     returnRate={returnRate}
                     investmentDate={summary.investmentDate}
                     expectedProfit={expectedProfit}
                     fundingProgress={fundingProgress}
                     status={projectStatus}
                  />
               );
            })}
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
               placeholder={
                  activeTab === 'history'
                     ? 'Search transactions...'
                     : 'Search projects...'
               }
            />
         </View>

         <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
         {loading && activeTab === 'history' ? (
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
