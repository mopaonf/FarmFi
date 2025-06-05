import React, { useEffect, useState } from 'react';
import {
   View,
   Text,
   SafeAreaView,
   ActivityIndicator,
   ScrollView,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const ProductDetailScreen: React.FC = () => {
   const { id } = useLocalSearchParams();
   const [project, setProject] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const fetchProject = async () => {
         try {
            const response = await fetch(
               `http://192.168.5.1:5000/api/projects/${id}`
            );
            const data = await response.json();
            if (!response.ok)
               throw new Error(data.message || 'Failed to fetch project');
            setProject(data);
         } catch (err) {
            setError(err.message);
         } finally {
            setLoading(false);
         }
      };

      if (id) fetchProject();
   }, [id]);

   if (loading) {
      return (
         <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
         >
            <ActivityIndicator size="large" color="#2e7d32" />
         </View>
      );
   }

   if (error) {
      return (
         <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
         >
            <Text style={{ color: 'red' }}>{error}</Text>
         </View>
      );
   }

   return (
      <SafeAreaView style={{ flex: 1 }}>
         <ScrollView>
            {project && (
               <View style={{ padding: 20 }}>
                  <Text style={{ fontSize: 24, fontWeight: 'bold' }}>
                     {project.title}
                  </Text>
                  {/* Add more project details here */}
               </View>
            )}
         </ScrollView>
      </SafeAreaView>
   );
};

export default ProductDetailScreen;
