import React, { useEffect } from 'react';
import {
   View,
   Text,
   StyleSheet,
   Animated,
   Easing,
   Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

const AnimatedSplashScreen = ({ onAnimationComplete }) => {
   // Animations for text
   const agriX = React.useRef(new Animated.Value(-width)).current;
   const vestX = React.useRef(new Animated.Value(width)).current;

   // Animations for lotus petals (opacity and scale)
   const centerPetalScale = React.useRef(new Animated.Value(0)).current;
   const centerPetalOpacity = React.useRef(new Animated.Value(0)).current;

   const leftPetalScale = React.useRef(new Animated.Value(0)).current;
   const leftPetalOpacity = React.useRef(new Animated.Value(0)).current;

   const rightPetalScale = React.useRef(new Animated.Value(0)).current;
   const rightPetalOpacity = React.useRef(new Animated.Value(0)).current;

   const farLeftPetalScale = React.useRef(new Animated.Value(0)).current;
   const farLeftPetalOpacity = React.useRef(new Animated.Value(0)).current;

   const farRightPetalScale = React.useRef(new Animated.Value(0)).current;
   const farRightPetalOpacity = React.useRef(new Animated.Value(0)).current;

   const containerSlideUp = React.useRef(new Animated.Value(0)).current;

   useEffect(() => {
      Animated.sequence([
         // First animate the center petal
         Animated.parallel([
            Animated.timing(centerPetalScale, {
               toValue: 1,
               duration: 600,
               useNativeDriver: true,
               easing: Easing.elastic(1),
            }),
            Animated.timing(centerPetalOpacity, {
               toValue: 1,
               duration: 600,
               useNativeDriver: true,
            }),
         ]),
         // Then the side petals
         Animated.parallel([
            Animated.timing(leftPetalScale, {
               toValue: 1,
               duration: 500,
               useNativeDriver: true,
               easing: Easing.elastic(1),
            }),
            Animated.timing(leftPetalOpacity, {
               toValue: 1,
               duration: 500,
               useNativeDriver: true,
            }),
            Animated.timing(rightPetalScale, {
               toValue: 1,
               duration: 500,
               useNativeDriver: true,
               easing: Easing.elastic(1),
            }),
            Animated.timing(rightPetalOpacity, {
               toValue: 1,
               duration: 500,
               useNativeDriver: true,
            }),
         ]),
         // Finally the outer petals
         Animated.parallel([
            Animated.timing(farLeftPetalScale, {
               toValue: 1,
               duration: 400,
               useNativeDriver: true,
               easing: Easing.elastic(1),
            }),
            Animated.timing(farLeftPetalOpacity, {
               toValue: 1,
               duration: 400,
               useNativeDriver: true,
            }),
            Animated.timing(farRightPetalScale, {
               toValue: 1,
               duration: 400,
               useNativeDriver: true,
               easing: Easing.elastic(1),
            }),
            Animated.timing(farRightPetalOpacity, {
               toValue: 1,
               duration: 400,
               useNativeDriver: true,
            }),
         ]),
         // Then animate text sliding in from sides
         Animated.parallel([
            Animated.spring(agriX, {
               toValue: 0,
               useNativeDriver: true,
               friction: 6,
               tension: 40,
            }),
            Animated.spring(vestX, {
               toValue: 0,
               useNativeDriver: true,
               friction: 6,
               tension: 40,
            }),
         ]),
         // Finally slide everything up
         Animated.timing(containerSlideUp, {
            toValue: -200,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
         }),
      ]).start(() => {
         if (onAnimationComplete) onAnimationComplete();
      });
   }, [onAnimationComplete]);

   // Lotus Petal Component
   const LotusPetal = ({ style, animatedStyle }) => (
      <Animated.View style={[styles.petal, style, animatedStyle]} />
   );

   return (
      <Animated.View
         style={[
            styles.container,
            { transform: [{ translateY: containerSlideUp }] },
         ]}
      >
         <View style={styles.logoContainer}>
            {/* Lotus Flower */}
            <View style={styles.lotusContainer}>
               {/* Far Left Petal */}
               <LotusPetal
                  style={[styles.farLeftPetal]}
                  animatedStyle={{
                     opacity: farLeftPetalOpacity,
                     transform: [{ scale: farLeftPetalScale }],
                  }}
               />

               {/* Far Right Petal */}
               <LotusPetal
                  style={[styles.farRightPetal]}
                  animatedStyle={{
                     opacity: farRightPetalOpacity,
                     transform: [{ scale: farRightPetalScale }],
                  }}
               />

               {/* Left Petal */}
               <LotusPetal
                  style={[styles.leftPetal]}
                  animatedStyle={{
                     opacity: leftPetalOpacity,
                     transform: [{ scale: leftPetalScale }],
                  }}
               />

               {/* Right Petal */}
               <LotusPetal
                  style={[styles.rightPetal]}
                  animatedStyle={{
                     opacity: rightPetalOpacity,
                     transform: [{ scale: rightPetalScale }],
                  }}
               />

               {/* Center Petal */}
               <LotusPetal
                  style={[styles.centerPetal]}
                  animatedStyle={{
                     opacity: centerPetalOpacity,
                     transform: [{ scale: centerPetalScale }],
                  }}
               />

               {/* Center White Dot */}
               <View style={styles.centerDot} />
            </View>
         </View>

         {/* ANIMATED TEXT */}
         <View style={styles.textRow}>
            <Animated.Text
               style={[
                  styles.text,
                  styles.textLeft,
                  { transform: [{ translateX: agriX }] },
               ]}
            >
               Agri
            </Animated.Text>
            <Animated.Text
               style={[
                  styles.text,
                  styles.textRight,
                  { transform: [{ translateX: vestX }] },
               ]}
            >
               Vest
            </Animated.Text>
         </View>
      </Animated.View>
   );
};

const styles = StyleSheet.create({
   container: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
   },
   logoContainer: {
      width: 200, // Increased from 150
      height: 200, // Increased from 150
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 40,
   },
   lotusContainer: {
      width: 180, // Increased from 120
      height: 60, // Increased from 40
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
   },
   petal: {
      position: 'absolute',
      borderRadius: 35, // Increased from 25
   },
   centerPetal: {
      width: 50, // Increased from 25
      height: 100, // Increased from 50
      backgroundColor: '#2e7d32', // Changed to green
      top: 20, // Adjusted for new size
      zIndex: 5,
   },
   leftPetal: {
      width: 45, // Increased from 22
      height: 90, // Increased from 45
      backgroundColor: '#388e3c', // Slightly lighter green
      top: 25, // Adjusted for new size
      left: 35, // Adjusted for new size
      transform: [{ rotate: '-25deg' }],
      zIndex: 4,
   },
   rightPetal: {
      width: 45, // Increased from 22
      height: 90, // Increased from 45
      backgroundColor: '#388e3c', // Slightly lighter green
      top: 25, // Adjusted for new size
      right: 35, // Adjusted for new size
      transform: [{ rotate: '25deg' }],
      zIndex: 4,
   },
   farLeftPetal: {
      width: 40, // Increased from 20
      height: 80, // Increased from 40
      backgroundColor: '#43a047', // Even lighter green
      top: 30, // Adjusted for new size
      left: 12, // Adjusted for new size
      transform: [{ rotate: '-50deg' }],
      zIndex: 3,
   },
   farRightPetal: {
      width: 40, // Increased from 20
      height: 80, // Increased from 40
      backgroundColor: '#43a047', // Even lighter green
      top: 30, // Adjusted for new size
      right: 12, // Adjusted for new size
      transform: [{ rotate: '50deg' }],
      zIndex: 3,
   },
   centerDot: {
      width: 12, // Increased from 8
      height: 12, // Increased from 8
      backgroundColor: '#fff',
      borderRadius: 6,
      position: 'absolute',
      top: 60, // Adjusted for new size
      zIndex: 6,
   },
   textRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: -40,
   },
   text: {
      fontSize: 55,
      fontWeight: 'bold',
      color: '#2e7d32',
      letterSpacing: 1,
   },
   textLeft: {
      marginRight: 5,
   },
   textRight: {
      marginLeft: 5,
   },
});

export default AnimatedSplashScreen;
