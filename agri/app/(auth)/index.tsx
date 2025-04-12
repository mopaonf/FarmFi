import React, { useState } from 'react';
import {
   View,
   Text,
   TextInput,
   TouchableOpacity,
   StyleSheet,
   Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../context/AuthContext';

const AuthScreen: React.FC = () => {
   const [isLogin, setIsLogin] = useState(true);
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [username, setUsername] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [loading, setLoading] = useState(false);
   const router = useRouter();
   const { login } = useAuth();

   const handleAuth = async () => {
      try {
         setLoading(true);

         // Validate passwords match for signup
         if (!isLogin && password !== confirmPassword) {
            throw new Error('Passwords do not match');
         }

         // Validate required fields
         if (
            !isLogin &&
            (!username || !email || !password || !confirmPassword)
         ) {
            throw new Error('All fields are required');
         }

         if (isLogin && (!email || !password)) {
            throw new Error('Email and password are required');
         }

         const endpoint = isLogin ? 'login' : 'signup';
         const body = isLogin
            ? { email, password }
            : { username, name: username, email, password }; // Add name field

         // Replace 192.168.1.X with your computer's IP address
         const response = await fetch(
            `http://172.20.10.5:5000/api/users/${endpoint}`,
            {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(body),
            }
         );

         const data = await response.json();
         if (!response.ok) throw new Error(data.error);

         // Store token and user data
         await AsyncStorage.setItem('token', data.token);
         await AsyncStorage.setItem('user', JSON.stringify(data.user));
         login(data.user, data.token);

         router.replace('/(tabs)'); // Updated navigation path
      } catch (error: any) {
         const errorMessage =
            error instanceof Error
               ? error.message
               : 'An unexpected error occurred';
         Alert.alert('Error', errorMessage);
      } finally {
         setLoading(false);
      }
   };

   return (
      <View style={styles.container}>
         <Text style={styles.title}>{isLogin ? 'Login' : 'Sign Up'}</Text>
         {!isLogin && (
            <TextInput
               style={styles.input}
               placeholder="Username"
               value={username}
               onChangeText={setUsername}
               autoCapitalize="none"
            />
         )}
         <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
         />
         <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
         />
         {!isLogin && (
            <TextInput
               style={styles.input}
               placeholder="Confirm Password"
               value={confirmPassword}
               onChangeText={setConfirmPassword}
               secureTextEntry
            />
         )}
         <TouchableOpacity
            style={styles.button}
            onPress={handleAuth}
            disabled={loading}
         >
            <Text style={styles.buttonText}>
               {isLogin ? 'Login' : 'Sign Up'}
            </Text>
         </TouchableOpacity>
         <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.toggleText}>
               {isLogin
                  ? "Don't have an account? Sign Up"
                  : 'Already have an account? Login'}
            </Text>
         </TouchableOpacity>
      </View>
   );
};

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#ffffff',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
   },
   title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#333333',
   },
   input: {
      width: '100%',
      height: 50,
      borderWidth: 1,
      borderColor: '#cccccc',
      borderRadius: 8,
      paddingHorizontal: 10,
      marginBottom: 15,
      fontSize: 16,
   },
   button: {
      width: '100%',
      height: 50,
      backgroundColor: '#ffa726',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 8,
      marginBottom: 10,
   },
   buttonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: 'bold',
   },
   toggleText: {
      color: '#007bff',
      fontSize: 14,
      marginTop: 10,
   },
});

export default AuthScreen;
