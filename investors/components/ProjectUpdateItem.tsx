import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Colors } from '../constants/Colors';

interface ProjectUpdateItemProps {
  projectName: string;
  stages: {
    title: string;
    date: string;
    images: string[];
  }[];
}

const ProjectUpdateItem: React.FC<ProjectUpdateItemProps> = ({
  projectName,
  stages
}) => {
  return (
    <View style={{ backgroundColor: Colors.light.surface }} className="rounded-xl p-4 mb-4 shadow-sm">
      <Text style={{ color: Colors.light.text }} className="text-lg font-semibold mb-4">
        {projectName}
      </Text>
      
      {stages.map((stage, index) => (
        <View key={index} className="mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text style={{ color: Colors.light.text }} className="font-medium text-base">
              {stage.title}
            </Text>
            <Text style={{ color: Colors.light.icon }} className="text-sm">
              {stage.date}
            </Text>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 4 }}
          >
            {[1, 2, 3].map((_, imgIndex) => (
              <View
                key={imgIndex}
                style={{ backgroundColor: Colors.light.text }}
                className="w-[100px] h-[100px] rounded-xl mx-3"
              />
            ))}
          </ScrollView>
        </View>
      ))}
    </View>
  );
};

export default ProjectUpdateItem;
