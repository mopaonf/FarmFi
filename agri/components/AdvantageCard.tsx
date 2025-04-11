import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

interface AdvantageCardProps {
   title: string;
   description: string;
   icon: keyof typeof Feather.glyphMap;
}

const AdvantageCard: React.FC<AdvantageCardProps> = ({ title, description, icon }) => {
   return (
      <View className="bg-white p-4 rounded-xl shadow-sm">
         <View className={`bg-[${Colors.light.surfaceHover}] w-12 h-12 rounded-full items-center justify-center mb-3`}>
            <Feather name={icon} size={24} color={Colors.light.primary} />
         </View>
         <Text className="text-lg font-semibold mb-2">{title}</Text>
         <Text className="text-gray-600 text-sm leading-5">{description}</Text>
      </View>
   );
};

export default AdvantageCard;
