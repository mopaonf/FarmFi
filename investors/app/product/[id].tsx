import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const ProductDetailScreen: React.FC = () => {
   const { id } = useLocalSearchParams();
   const [project, setProject] = useState<any>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchProject = async () => {
         try {
            const res = await fetch(
               `http://172.20.10.5:5000/api/projects/${id}`
            );
            const data = await res.json();
            setProject(data);
         } catch (e) {
            setProject(null);
         } finally {
            setLoading(false);
         }
      };
      if (id) fetchProject();
   }, [id]);

   return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
         {loading ? (
            <ActivityIndicator size="large" />
         ) : !project ? (
            <Text>Project not found.</Text>
         ) : (
            <View>
               <Text className="text-2xl font-bold">{project.title}</Text>
               {/* Add more project details here as needed */}
            </View>
         )}
      </SafeAreaView>
   );
};

export default ProductDetailScreen;
