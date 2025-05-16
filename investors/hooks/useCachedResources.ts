import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

export default function useCachedResources() {
   const [isLoadingComplete, setLoadingComplete] = useState(false);

   useEffect(() => {
      async function loadResourcesAndDataAsync() {
         try {
            await Font.loadAsync({
               'SF Pro Display': require('../assets/fonts/SF-Pro-Display-Regular.otf'),
               'SF Pro Display Bold': require('../assets/fonts/SF-Pro-Display-Bold.otf'),
            });
         } catch (e) {
            console.warn(e);
         } finally {
            setLoadingComplete(true);
         }
      }

      loadResourcesAndDataAsync();
   }, []);

   return isLoadingComplete;
}
