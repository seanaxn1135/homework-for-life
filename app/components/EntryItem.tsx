import React from 'react';
import { View, Text } from 'react-native';

type EntryItemProps = {
  text: string;
};

export function EntryItem({ text }: EntryItemProps) {
  return (
    <View className="p-4 border-b border-gray-200">
      <Text className="text-base text-gray-800">{text}</Text>
    </View>
  );
}