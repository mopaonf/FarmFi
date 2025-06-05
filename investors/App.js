import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AnimatedSplashScreen from './src/screens/AnimatedSplashScreen';
// import your AuthNavigator or Auth screens...

const App = () => {
   const [showSplash, setShowSplash] = useState(true);

   const handleSplashFinish = () => {
      setShowSplash(false);
   };

   if (showSplash) {
      return <AnimatedSplashScreen onFinish={handleSplashFinish} />;
   }

   return (
      <NavigationContainer>
         {/* Replace below with your actual AuthNavigator or main app navigation */}
         {/* <AuthNavigator /> */}
         {/* Example: */}
         {/* <Stack.Navigator>
            <Stack.Screen name="Auth" component={AuthScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
         </Stack.Navigator> */}
      </NavigationContainer>
   );
};

export default App;
