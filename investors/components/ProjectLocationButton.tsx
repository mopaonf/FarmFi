import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

interface ProjectLocationButtonProps {
   style?: any;
   title?: string;
   projectId?: string;
   variant?: 'primary' | 'secondary' | 'outline';
}

const ProjectLocationButton: React.FC<ProjectLocationButtonProps> = ({
   style,
   title = 'View Project Locations',
   projectId,
   variant = 'outline', // Changed default to 'outline'
}) => {
   const router = useRouter();

   const handlePress = () => {
      if (projectId) {
         router.push({
            pathname: '/map-view',
            params: { projectId },
         });
      } else {
         router.push('/map-view');
      }
   };

   return (
      <TouchableOpacity
         style={[
            styles.button,
            variant === 'secondary' && styles.secondaryButton,
            variant === 'outline' && styles.outlineButton,
            style,
         ]}
         onPress={handlePress}
      >
         <Feather
            name="map-pin"
            size={18}
            color={variant === 'primary' ? '#fff' : '#2e7d32'}
         />
         <Text
            style={[
               styles.buttonText,
               (variant === 'secondary' || variant === 'outline') &&
                  styles.secondaryButtonText,
            ]}
         >
            {title}
         </Text>
      </TouchableOpacity>
   );
};

const styles = StyleSheet.create({
   button: {
      backgroundColor: '#2e7d32',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 10,
   },
   secondaryButton: {
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#2e7d32',
   },
   outlineButton: {
      backgroundColor: 'transparent', // Transparent background
      borderWidth: 1,
      borderColor: '#2e7d32',
   },
   buttonText: {
      color: '#fff',
      marginLeft: 8,
      fontWeight: '600',
   },
   secondaryButtonText: {
      color: '#2e7d32',
   },
});

export default ProjectLocationButton;
