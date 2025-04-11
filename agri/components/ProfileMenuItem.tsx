import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../constants/Colors';

interface ProfileMenuItemProps {
  title: string;
  onPress: () => void;
  icon: keyof typeof Feather.glyphMap;
}

const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({ title, onPress, icon }) => {
  return (
    <TouchableOpacity 
      className="flex-row items-center py-4 px-6 border-b border-gray-100"
      onPress={onPress}
    >
      <View className="w-9 h-9 rounded-xl bg-green-50 items-center justify-center mr-3">
        <Feather name={icon} size={20} color={Colors.light.primary} />
      </View>
      <Text className="flex-1 text-base font-[Poppins_400Regular] text-gray-900">
        {title}
      </Text>
      <Feather name="chevron-right" size={20} color={Colors.light.icon} />
    </TouchableOpacity>
  );
};

export default ProfileMenuItem;
