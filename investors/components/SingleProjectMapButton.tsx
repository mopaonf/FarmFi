import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';

interface SingleProjectMapButtonProps {
   projectId: string;
   style?: any;
   buttonText?: string;
   small?: boolean;
}

const SingleProjectMapButton: React.FC<SingleProjectMapButtonProps> = ({
   projectId,
   style,
   buttonText = 'View Location',
   small = false,
}) => {
   const handlePress = () => {
      router.push({
         pathname: '/map-view',
         params: { projectId },
      });
   };

   return (
      <TouchableOpacity
         style={[styles.button, small && styles.smallButton, style]}
         onPress={handlePress}
      >
         <Feather name="map-pin" size={small ? 14 : 18} color="#fff" />
         <Text style={[styles.buttonText, small && styles.smallButtonText]}>
            {buttonText}
         </Text>
      </TouchableOpacity>
   );
};

const styles = StyleSheet.create({
   button: {
      backgroundColor: '#2e7d32',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 8,
      marginVertical: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
   },
   smallButton: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 6,
      marginVertical: 5,
   },
   buttonText: {
      color: '#fff',
      marginLeft: 8,
      fontWeight: '600',
      fontSize: 15,
   },
   smallButtonText: {
      fontSize: 12,
   },
});

export default SingleProjectMapButton;
