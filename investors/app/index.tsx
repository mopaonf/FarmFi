import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function Index() {
   const [isLoading, setIsLoading] = useState(true);
   const [isAuthenticated, setIsAuthenticated] = useState(false);
   const { login } = useAuth();

   useEffect(() => {
      // Check for existing token when app starts
      const checkToken = async () => {
         try {
            const token = await AsyncStorage.getItem('token');
            const userJson = await AsyncStorage.getItem('user');

            if (token && userJson) {
               const user = JSON.parse(userJson);
               // Restore the authentication state
               login(user, token);
               setIsAuthenticated(true);
            }
         } catch (error) {
            console.error('Error checking authentication:', error);
            // If there's an error, we'll just redirect to login
         } finally {
            setIsLoading(false);
         }
      };

      checkToken();
   }, [login]);

   if (isLoading) {
      // Show loading spinner while checking auth status
      return (
         <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
         >
            <ActivityIndicator size="large" color="#16a34a" />
         </View>
      );
   }

   // Redirect based on authentication status
   return isAuthenticated ? (
      <Redirect href="/(tabs)" />
   ) : (
      <Redirect href="/(auth)" />
   );
}
