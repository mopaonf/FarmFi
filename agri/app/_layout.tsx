import {
   DarkTheme,
   DefaultTheme,
   ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '@/global.css';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
   const colorScheme = useColorScheme();
   const [loaded] = useFonts({
      SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
   });

   if (!loaded) {
      return null; // Wait for fonts to load
   }

   return (
      <AuthProvider>
         <ThemeProvider
            value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
         >
            <Stack screenOptions={{ headerShown: false }}>
               <Stack.Screen name="index" />
               <Stack.Screen
                  name="(auth)"
                  options={{
                     headerShown: false,
                     title: '',
                  }}
               />
               <Stack.Screen name="(tabs)" />
               <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="auto" />
         </ThemeProvider>
      </AuthProvider>
   );
}
