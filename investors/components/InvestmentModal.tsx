import React, { useState } from 'react';
import {
   Modal,
   View,
   Text,
   TextInput,
   TouchableOpacity,
   ActivityIndicator,
   Alert,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { formatCurrency } from '../utils/formatCurrency';

interface InvestmentModalProps {
   visible: boolean;
   onClose: () => void;
   onConfirm: (description: string) => void;
   amount: number;
   units: number;
   projectTitle: string;
}

const InvestmentModal: React.FC<InvestmentModalProps> = ({
   visible,
   onClose,
   onConfirm,
   amount,
   units,
   projectTitle,
}) => {
   const [description, setDescription] = useState('');
   const [loading, setLoading] = useState(false);

   const handleConfirm = async () => {
      setLoading(true);
      await onConfirm(description);
      setLoading(false);
   };

   return (
      <Modal
         visible={visible}
         transparent
         animationType="slide"
         onRequestClose={onClose}
      >
         <View className="flex-1 justify-end">
            <View className="bg-white rounded-t-3xl p-6">
               <Text className="text-xl font-[Poppins_600SemiBold] mb-4">
                  Confirm Investment
               </Text>

               <View className="bg-gray-50 p-4 rounded-xl mb-4">
                  <Text className="text-base font-[Poppins_500Medium] mb-2">
                     {projectTitle}
                  </Text>
                  <View className="flex-row justify-between mb-2">
                     <Text className="text-gray-600">Amount:</Text>
                     <Text className="font-[Poppins_600SemiBold]">
                        {formatCurrency(amount)}
                     </Text>
                  </View>
                  <View className="flex-row justify-between">
                     <Text className="text-gray-600">Units:</Text>
                     <Text className="font-[Poppins_600SemiBold]">{units}</Text>
                  </View>
               </View>

               <TextInput
                  className="bg-gray-50 p-4 rounded-xl mb-6"
                  placeholder="Add a note to your investment (optional)"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
               />

               <View className="flex-row gap-4">
                  <TouchableOpacity
                     className="flex-1 py-4 bg-gray-100 rounded-xl"
                     onPress={onClose}
                     disabled={loading}
                  >
                     <Text className="text-center font-[Poppins_500Medium] text-gray-700">
                        Cancel
                     </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                     className="flex-1 py-4 bg-orange-500 rounded-xl"
                     onPress={handleConfirm}
                     disabled={loading}
                  >
                     {loading ? (
                        <ActivityIndicator color="white" />
                     ) : (
                        <Text className="text-center font-[Poppins_500Medium] text-white">
                           Confirm
                        </Text>
                     )}
                  </TouchableOpacity>
               </View>
            </View>
         </View>
      </Modal>
   );
};

export default InvestmentModal;
