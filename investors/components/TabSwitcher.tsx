import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const TabSwitcher = ({ activeTab, onTabChange }) => {
   return (
      <View className="flex-row bg-gray-100 p-1 mx-6 mt-4 my-4 rounded-xl">
         <TouchableOpacity
            className={`flex-1 py-4 rounded-lg ${
               activeTab === 'history' ? 'bg-[#2e7d32]' : ''
            }`}
            onPress={() => onTabChange('history')}
         >
            <Text
               className={`text-center font-medium ${
                  activeTab === 'history' ? 'text-white' : 'text-gray-600'
               }`}
            >
               Transaction History
            </Text>
         </TouchableOpacity>
         <TouchableOpacity
            className={`flex-1 py-4 rounded-lg ${
               activeTab === 'updates' ? 'bg-[#2e7d32]' : ''
            }`}
            onPress={() => onTabChange('updates')}
         >
            <Text
               className={`text-center font-medium ${
                  activeTab === 'updates' ? 'text-white' : 'text-gray-600'
               }`}
            >
               Project Updates
            </Text>
         </TouchableOpacity>
      </View>
   );
};

export default TabSwitcher;
