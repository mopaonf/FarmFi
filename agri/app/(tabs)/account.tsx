import React from 'react';
import { View, Text, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import ProfileMenuItem from '../../components/ProfileMenuItem';
import { useAuth } from '../../context/AuthContext';

const AccountScreen: React.FC = () => {
   const { user, logout } = useAuth();
   const router = useRouter();

   const handleLogout = async () => {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      logout();
      router.replace('/(auth)'); // Updated navigation path
   };

   return (
      <SafeAreaView
         style={{ backgroundColor: Colors.light.surface }}
         className="flex-1"
      >
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
                     <Feather name="mail" size={14} color={Colors.light.icon} />
                     <Text
                        style={{ color: Colors.light.icon }}
                        className="ml-2 text-sm font-[Poppins_400Regular]"
                     >
                        {user?.email}
                     </Text>
                  </View>
                  <View className="flex-row items-center">
                     <View
                        style={{ backgroundColor: Colors.light.primary + '15' }}
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

         {/* Menu Section */}
         <View
            style={{ backgroundColor: Colors.light.surfaceHover }}
            className="flex-1 rounded-t-[30px] pt-6"
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
      </SafeAreaView>
   );
};

export default AccountScreen;
