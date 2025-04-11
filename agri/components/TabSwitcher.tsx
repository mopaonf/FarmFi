import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';

interface TabSwitcherProps {
  activeTab: 'history' | 'updates';
  onTabChange: (tab: 'history' | 'updates') => void;
}

const TabSwitcher: React.FC<TabSwitcherProps> = ({ activeTab, onTabChange }) => {
  return (
    <View className="px-4 pt-4 pb-2">
      <View className="flex-row p-1 bg-gray-100 rounded-xl">
        <TouchableOpacity 
          className="flex-1 py-3 px-4 rounded-lg"
          style={{ 
            backgroundColor: activeTab === 'history' ? Colors.light.primary : 'transparent',
          }}
          onPress={() => onTabChange('history')}
        >
          <Text 
            style={{ 
              color: activeTab === 'history' ? 'white' : Colors.light.text,
              fontFamily: 'Poppins_500Medium'
            }}
            className="text-center text-base"
          >
            Transaction History
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="flex-1 py-3 px-4 rounded-lg"
          style={{ 
            backgroundColor: activeTab === 'updates' ? Colors.light.primary : 'transparent',
          }}
          onPress={() => onTabChange('updates')}
        >
          <Text 
            style={{ 
              color: activeTab === 'updates' ? 'white' : Colors.light.text,
              fontFamily: 'Poppins_500Medium'
            }}
            className="text-center text-base"
          >
            Project Updates
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TabSwitcher;
