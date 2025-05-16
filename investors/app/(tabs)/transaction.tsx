import React from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import TabSwitcher from '../../components/TabSwitcher';
import TransactionHistoryItem from '../../components/TransactionHistoryItem';
import ProjectUpdateItem from '../../components/ProjectUpdateItem';
import SearchBar from '../../components/SearchBar';

const TransactionScreen: React.FC = () => {
   const [activeTab, setActiveTab] = React.useState<'history' | 'updates'>(
      'history'
   );

   const renderContent = () => {
      if (activeTab === 'history') {
         return (
            <ScrollView className="flex-1 px-4">
               <TransactionHistoryItem
                  type="increase"
                  projectName="Durian Investment"
                  date="2024-01-15"
                  amount="Fcfa 3.000.000"
                  percentage={150}
               />
               <TransactionHistoryItem
                  type="increase"
                  projectName="Corn Partnership"
                  date="2024-01-10"
                  amount="Fcfa 2.500.000"
                  percentage={50}
               />
               {/* Add more transaction items */}
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

   return (
      <SafeAreaView className="flex-1 bg-white">
         <View className="pt-2 px-6">
            <SearchBar />
         </View>

         <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />
         {renderContent()}
      </SafeAreaView>
   );
};

export default TransactionScreen;
