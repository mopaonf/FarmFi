# FarmFi App

## Navigation Structure Resolution

The app navigation was fixed by implementing the following structure:

1. Root Layout (`app/_layout.tsx`):

   -  Configures the main Stack navigator
   -  Defines all available screens
   -  Removes headerShown for clean UI

2. Root Index (`app/index.tsx`):

   -  Handles initial redirect to auth page
   -  Uses `<Redirect href="/auth" />` pattern

3. Auth Screen (`app/auth/index.tsx`):
   -  Implements login/signup functionality
   -  Acts as the initial screen for the app

## Common Issues Resolved

1. "Couldn't find screen named 'auth'" Error:

   -  Fixed by properly configuring Stack.Screen components
   -  Removed initialRouteName in favor of index redirect

2. Authentication Flow:
   -  Entry point → index.tsx → auth screen → tabs
   -  Clean navigation without unnecessary headers
