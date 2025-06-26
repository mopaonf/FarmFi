import React, { useEffect, useRef, useState } from 'react';
import {
   View,
   Text,
   ScrollView,
   TouchableOpacity,
   Animated,
   Easing,
   Dimensions,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { Feather } from '@expo/vector-icons';
import { formatCurrency } from '../utils/formatCurrency';
import { useElapsedTime } from '../hooks/useElapsedTime';
import { useRouter } from 'expo-router';

interface ProjectUpdateItemProps {
   projectId?: string;
   projectName: string;
   description?: string;
   stages: {
      title: string;
      date: string;
      images: string[];
   }[];
   totalUnitsInvested?: number;
   unitPrice?: number;
   totalAmountInvested?: number; // Add this to accept the actual amount invested
   returnRate?: number;
   investmentDate?: string;
   expectedProfit?: number;
   fundingProgress?: number;
   status?: string; // Add status field to check for "funded" status
}

const ProjectUpdateItem: React.FC<ProjectUpdateItemProps> = ({
   projectId,
   projectName,
   description = 'This project aims to improve agricultural yields and provide sustainable returns on investment.',
   stages,
   totalUnitsInvested = 0,
   unitPrice = 0,
   totalAmountInvested = 0, // Set default to 0
   returnRate = 0,
   investmentDate,
   expectedProfit = 0,
   fundingProgress = 0,
   status = '',
}) => {
   const router = useRouter();

   // Check if the project is completed (100% funded or status is "funded")
   const isCompleted =
      fundingProgress >= 100 ||
      status.toLowerCase() === 'funded' ||
      status.toLowerCase() === 'completed';

   console.log(
      `Project ${projectName} - Status: ${status}, Progress: ${fundingProgress}, isCompleted: ${isCompleted}`
   );

   // Only use time elapsed animation if project is not complete
   const timeElapsed = isCompleted ? '- -' : useElapsedTime(investmentDate);
   const pulseAnim = new Animated.Value(1);
   const scrollAnim = useRef(new Animated.Value(0)).current;
   const [contentWidth, setContentWidth] = useState(0);

   // Create animation values for images outside the map function - fix for conditional hooks
   const imageOpacities = [
      useRef(new Animated.Value(0)).current,
      useRef(new Animated.Value(0)).current,
      useRef(new Animated.Value(0)).current,
   ];

   // Setup pulse animation for the clock - only if project is active
   useEffect(() => {
      if (isCompleted) return;

      const pulse = Animated.loop(
         Animated.sequence([
            Animated.timing(pulseAnim, {
               toValue: 1.1,
               duration: 500,
               easing: Easing.inOut(Easing.ease),
               useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
               toValue: 1,
               duration: 500,
               easing: Easing.inOut(Easing.ease),
               useNativeDriver: true,
            }),
         ])
      );

      pulse.start();
      return () => pulse.stop();
   }, [isCompleted]);

   // Setup animations for images
   useEffect(() => {
      // Animate all images with different delays
      imageOpacities.forEach((opacity, index) => {
         Animated.timing(opacity, {
            toValue: 1,
            duration: 500,
            delay: index * 200,
            useNativeDriver: true,
         }).start();
      });
   }, []);

   // Setup scrolling ticker animation for the description
   useEffect(() => {
      if (contentWidth > 0) {
         Animated.loop(
            Animated.timing(scrollAnim, {
               toValue: -contentWidth, // Scroll to the negative content width (moving left)
               duration: contentWidth * 50, // Increased from 20 to 50 to make it slower
               easing: Easing.linear,
               useNativeDriver: true,
            })
         ).start();
      }
      return () => scrollAnim.resetAnimation();
   }, [contentWidth]);

   // Calculate the total value either from the provided amount or by multiplying units by price
   const calculatedTotalValue =
      totalAmountInvested > 0
         ? totalAmountInvested
         : totalUnitsInvested * unitPrice;

   const handleCardPress = () => {
      if (projectId) {
         // Navigate to project details page
         router.push({
            pathname: '/product-details',
            params: { id: projectId },
         });
      }
   };

   return (
      <TouchableOpacity
         activeOpacity={0.7}
         onPress={handleCardPress}
         disabled={!projectId}
      >
         <View
            style={{
               backgroundColor: isCompleted
                  ? Colors.light.grayLight
                  : Colors.light.surface,
            }}
            className="rounded-xl p-4 mb-4 shadow-sm"
         >
            <View className="flex-row justify-between items-center mb-3">
               <View className="flex-row items-center">
                  <Text
                     style={{
                        color: isCompleted
                           ? Colors.light.grayDark
                           : Colors.light.text,
                     }}
                     className="text-lg font-semibold"
                  >
                     {projectName}
                     {isCompleted && ' (Completed)'}
                  </Text>
                  {projectId && (
                     <Feather
                        name="chevron-right"
                        size={18}
                        color={
                           isCompleted
                              ? Colors.light.grayDark
                              : Colors.light.primary
                        }
                        style={{ marginLeft: 6 }}
                     />
                  )}
               </View>

               {totalUnitsInvested > 0 && (
                  <View
                     style={{
                        backgroundColor: isCompleted
                           ? Colors.light.grayLight + '70'
                           : Colors.light.primary + '15',
                     }}
                     className="px-2 py-1 rounded-lg"
                  >
                     <Text
                        style={{
                           color: isCompleted
                              ? Colors.light.grayDark
                              : Colors.light.primary,
                        }}
                        className="text-xs font-medium"
                     >
                        {totalUnitsInvested} units
                     </Text>
                  </View>
               )}
            </View>

            {/* Investment Stats */}
            {totalUnitsInvested > 0 && (
               <Animated.View
                  className="bg-gray-50 p-4 rounded-lg mb-4 w-full"
                  style={{
                     shadowColor: Colors.light.text,
                     shadowOffset: { width: 0, height: 2 },
                     shadowOpacity: 0.1,
                     shadowRadius: 6,
                     elevation: 2,
                     opacity: isCompleted ? 0.8 : 1,
                  }}
               >
                  <View className="flex-row justify-between items-center mb-3 w-full">
                     <Text
                        className="text-sm font-medium"
                        style={{
                           color: isCompleted
                              ? Colors.light.grayDark
                              : Colors.light.primary,
                        }}
                     >
                        Investment Summary
                     </Text>
                     {investmentDate && (
                        <Animated.View
                           className="flex-row items-center px-3 py-2 rounded-md"
                           style={{
                              backgroundColor: isCompleted
                                 ? Colors.light.grayLight
                                 : Colors.light.background,
                              transform: [
                                 { scale: isCompleted ? 1 : pulseAnim },
                              ],
                              shadowColor: isCompleted
                                 ? Colors.light.grayDark
                                 : Colors.light.primary,
                              shadowOffset: { width: 0, height: 0 },
                              shadowOpacity: isCompleted ? 0.1 : 0.3,
                              shadowRadius: isCompleted ? 3 : 5,
                              elevation: isCompleted ? 1 : 3,
                           }}
                        >
                           <Feather
                              name={isCompleted ? 'check-circle' : 'clock'}
                              size={14}
                              color={
                                 isCompleted
                                    ? Colors.light.grayDark
                                    : Colors.light.primary
                              }
                              style={{ marginRight: 6 }}
                           />
                           <Text
                              className="text-sm font-semibold"
                              style={{
                                 color: isCompleted
                                    ? Colors.light.grayDark
                                    : Colors.light.primary,
                              }}
                           >
                              {timeElapsed}
                           </Text>
                        </Animated.View>
                     )}
                  </View>

                  <View className="flex-row justify-between items-center mb-3 w-full">
                     <View>
                        <Text className="text-xs text-gray-500 mb-1">
                           Units Invested
                        </Text>
                        <Text className="text-sm font-semibold">
                           {isCompleted ? '- -' : totalUnitsInvested}
                        </Text>
                     </View>
                     <View>
                        <Text className="text-xs text-gray-500 mb-1 text-right">
                           Total Value
                        </Text>
                        <Text className="text-sm font-semibold">
                           {isCompleted
                              ? '- -'
                              : formatCurrency(calculatedTotalValue)}
                        </Text>
                     </View>
                  </View>

                  <Animated.View
                     className="bg-white p-3 rounded-md"
                     style={{
                        shadowColor: isCompleted ? '#999' : '#4caf50',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: isCompleted ? 0.05 : 0.1,
                        shadowRadius: isCompleted ? 2 : 3,
                        elevation: isCompleted ? 1 : 2,
                     }}
                  >
                     <View className="flex-row justify-between items-center w-full">
                        <Text className="text-xs text-gray-500">
                           {isCompleted
                              ? 'Project Completed'
                              : 'Expected Profit (First Refund)'}
                        </Text>
                        <Text
                           className={`text-sm font-bold ${
                              isCompleted ? 'text-gray-500' : 'text-green-600'
                           }`}
                        >
                           {isCompleted
                              ? '- -'
                              : formatCurrency(
                                   expectedProfit ||
                                      (calculatedTotalValue * returnRate) / 100
                                )}
                        </Text>
                     </View>
                  </Animated.View>
               </Animated.View>
            )}

            {stages.map((stage, index) => (
               <View key={index} className="mb-6 w-full">
                  <View className="flex-row justify-between items-center mb-3 w-full">
                     <Text
                        style={{
                           color: isCompleted
                              ? Colors.light.grayDark
                              : Colors.light.text,
                        }}
                        className="font-medium text-base"
                     >
                        {stage.title}
                     </Text>
                     <Text
                        style={{
                           color: isCompleted
                              ? Colors.light.grayDark
                              : Colors.light.icon,
                        }}
                        className="text-sm"
                     >
                        {stage.date}
                     </Text>
                  </View>

                  <ScrollView
                     horizontal
                     showsHorizontalScrollIndicator={false}
                     contentContainerStyle={{ paddingHorizontal: 4 }}
                  >
                     {[1, 2, 3].map((_, imgIndex) => (
                        <Animated.View
                           key={imgIndex}
                           style={{
                              backgroundColor: Colors.light.text,
                              opacity: imageOpacities[imgIndex],
                              transform: [
                                 {
                                    scale: imageOpacities[imgIndex].interpolate(
                                       {
                                          inputRange: [0, 1],
                                          outputRange: [0.8, 1],
                                       }
                                    ),
                                 },
                              ],
                           }}
                           className="w-[100px] h-[100px] rounded-xl mx-3 shadow-md overflow-hidden"
                        >
                           {/* Image placeholder with subtle animation */}
                           <Animated.View
                              className="absolute inset-0 bg-opacity-20"
                              style={{
                                 backgroundColor: isCompleted
                                    ? `${Colors.light.grayLight}50`
                                    : `${Colors.light.primary}30`,
                              }}
                           />
                        </Animated.View>
                     ))}
                  </ScrollView>

                  {/* Custom scrolling ticker with project description */}
                  <View className="mt-3 bg-gray-50 rounded-md overflow-hidden h-[36px] w-full justify-center">
                     <View className="overflow-hidden w-full">
                        <Animated.View
                           style={{
                              transform: [{ translateX: scrollAnim }],
                              flexDirection: 'row',
                           }}
                        >
                           <Text
                              className={`text-xs py-2 px-1 whitespace-nowrap ${
                                 isCompleted ? 'text-gray-500' : 'text-gray-700'
                              }`}
                              onLayout={(event) => {
                                 // Get text width for animation
                                 setContentWidth(
                                    event.nativeEvent.layout.width
                                 );
                              }}
                           >
                              {description}
                              <Text style={{ paddingLeft: 40 }}>
                                 {description}
                              </Text>
                           </Text>
                        </Animated.View>
                     </View>
                  </View>
               </View>
            ))}
         </View>
      </TouchableOpacity>
   );
};

export default ProjectUpdateItem;
