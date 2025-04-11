import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

interface TransactionHistoryItemProps {
  type: 'increase' | 'decrease';
  projectName: string;
  date: string;
  amount: string;
  percentage: number;
}

const TransactionHistoryItem: React.FC<TransactionHistoryItemProps> = ({
  type,
  projectName,
  date,
  amount,
  percentage
}) => {
  return (
    <View className="flex-row items-center p-4 bg-white rounded-xl mb-3 shadow-sm">
      {/* Left Section (15%) - Icon */}
      <View className="w-[15%]">
        <View className={`w-10 h-10 rounded-full items-center justify-center ${
          type === 'increase' ? 'bg-green-100' : 'bg-red-100'
        }`}>
          <Feather 
            name={type === 'increase' ? 'arrow-up-right' : 'arrow-down-left'} 
            size={24} 
            color={type === 'increase' ? Colors.light.success : Colors.light.error}
          />
        </View>
      </View>

      {/* Middle Section (50%) - Project Details */}
      <View className="w-[50%]">
        <Text className="font-medium text-base">{projectName}</Text>
        <Text className="text-gray-500 text-sm">{date}</Text>
      </View>

      {/* Right Section (35%) - Amount & Percentage */}
      <View className="w-[35%] items-end">
        <Text className="font-semibold text-base">{amount}</Text>
        <Text 
          className="text-sm font-medium"
          style={{ 
            color: type === 'increase' ? Colors.light.success : Colors.light.error 
          }}
        >
          {type === 'increase' ? '+' : '-'}{percentage}%
        </Text>
      </View>
    </View>
  );
};

export default TransactionHistoryItem;
