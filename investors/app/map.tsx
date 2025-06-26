import React from 'react';
import { Redirect, useLocalSearchParams } from 'expo-router';

/**
 * This is a redirector component to the map-view.tsx route
 * It handles the mapping of search params to make sure we keep the same API
 */
const MapScreen = () => {
   const params = useLocalSearchParams<{ projectId?: string }>();
   const redirectPath = params.projectId
      ? `/map-view?projectId=${params.projectId}`
      : '/map-view';

   // Using 'as any' to resolve TypeScript issues with the Redirect component
   return <Redirect href={redirectPath as any} />;
};

export default MapScreen;
