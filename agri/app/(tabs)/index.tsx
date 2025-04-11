import React from 'react';
import {
   View,
   Text,
   SafeAreaView,
   ScrollView,
   TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import SearchBar from '../../components/SearchBar';
import CategoryCard from '../../components/CategoryCard';
import FilterSelector from '../../components/FilterSelector';
import ProductCard from '../../components/ProductCard';
import ReferenceCard from '../../components/ReferenceCard';
import AdvantageCard from '../../components/AdvantageCard';
import Product_Banana from '../../assets/images/Product_Banana.png';
import Product_Banana2 from '../../assets/images/Product_Banana.png';
import Product_Apple from '../../assets/images/Product_Banana.png';
import Product_Mango from '../../assets/images/Product_Banana.png';
import Ref_WhitePepper from '../../assets/images/Product_WhitePepper.png';
import Ref_SpiceTrade from '../../assets/images/Product_WhitePepper.png';
import Ref_Agriculture from '../../assets/images/Product_WhitePepper.png';
// Import other product images...

const HomeScreen: React.FC = () => {
   return (
      <SafeAreaView className="flex-1 bg-white">
         <View className="pt-2 px-6 flex-row items-center justify-between bg-">
            <View className="w-[85%]">
               <SearchBar />
            </View>
            <TouchableOpacity>
               <Feather name="bell" size={26} color="#9ca3af" />
            </TouchableOpacity>
         </View>

         <View className="mt-8 pl-3">
            <FilterSelector />
         </View>

         <ScrollView className="pt-6">
            {/* Products Section */}
            <View className="mt-6">
               {/* First Row */}
               <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="px-4"
               >
                  <ProductCard
                     name="Banana"
                     isAvailable={true}
                     returnRate={47}
                     investmentAmount="Fcfa 5.000.000"
                     images={[Product_Banana]}
                  />
                  <ProductCard
                     name="Apple"
                     isAvailable={false}
                     returnRate={38}
                     investmentAmount="Fcfa 3.500.000"
                     images={[Product_Apple]}
                  />
                  <ProductCard
                     name="Mango"
                     returnRate={42}
                     investmentAmount="Fcfa 4.200.000"
                     images={[Product_Mango]}
                  />
                  {/* Add more cards as needed */}
               </ScrollView>
            </View>

            {/* References Section */}
            <View className="pt-6 pb-6">
               <View className="flex-row justify-between items-center px-4 mb-6">
                  <Text className="text-xl font-semibold">References</Text>
                  <TouchableOpacity>
                     <Text className="text-sm text-gray-500">See more</Text>
                  </TouchableOpacity>
               </View>

               <View className="flex-col px-4 space-y-6">
                  <ReferenceCard
                     title="White Pepper, Used to be more Valuable than gold"
                     author="Muhaimin Iqbal"
                     imageUrl={Ref_WhitePepper}
                  />
                  <ReferenceCard
                     title="The History of Spice Trade in Indonesia"
                     author="Sarah Johnson"
                     imageUrl={Ref_SpiceTrade}
                  />
                  <ReferenceCard
                     title="Agricultural Investment Opportunities"
                     author="David Chen"
                     imageUrl={Ref_Agriculture}
                  />
               </View>
            </View>

            {/* Advantages Section */}
            <View className="pt-6 pb-6">
               <Text className="px-4 text-xl font-semibold mb-6">
                  Advantages of iPlant
               </Text>

               <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="px-4"
               >
                  <View className="flex-row space-x-4">
                     <View className="w-[280px]">
                        <AdvantageCard
                           title="Practical and Safe"
                           description="Secure transactions with advanced encryption and real-time monitoring"
                           icon="shield"
                        />
                     </View>
                     <View className="w-[280px]">
                        <AdvantageCard
                           title="Free Transaction"
                           description="No hidden fees or charges on all your investments"
                           icon="dollar-sign"
                        />
                     </View>
                     <View className="w-[280px]">
                        <AdvantageCard
                           title="Expert Support"
                           description="24/7 access to agricultural investment experts"
                           icon="headphones"
                        />
                     </View>
                  </View>
               </ScrollView>
            </View>
         </ScrollView>
      </SafeAreaView>
   );
};

export default HomeScreen;
