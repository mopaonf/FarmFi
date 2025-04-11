import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import HomeScreen from './index';
import ProductScreen from './product';
import TransactionScreen from './transaction';
import AccountScreen from './account';
import { Colors } from '../../constants/Colors';

const Tab = createBottomTabNavigator();

const TabLayout: React.FC = () => {
   return (
      <Tab.Navigator
         screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
               let iconName: string;

               if (route.name === 'Home') {
                  iconName = 'home';
               } else if (route.name === 'Product') {
                  iconName = 'shopping-bag';
               } else if (route.name === 'Transaction') {
                  iconName = 'file-text';
               } else if (route.name === 'Account') {
                  iconName = 'user';
               } else {
                  iconName = 'circle'; // Fallback icon if none of the routes match
               }

               return <Feather name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: Colors.light.primary,
            tabBarInactiveTintColor: Colors.light.icon,
            headerShown: false,
         })}
      >
         <Tab.Screen name="Home" component={HomeScreen} />
         <Tab.Screen name="Product" component={ProductScreen} />
         <Tab.Screen name="Transaction" component={TransactionScreen} />
         <Tab.Screen name="Account" component={AccountScreen} />
      </Tab.Navigator>
   );
};

export default TabLayout;
