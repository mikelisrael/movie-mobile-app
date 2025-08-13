import Icon from "@react-native-vector-icons/ionicons";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

interface SearchBarProps {
  onPress?: () => void;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onPress,
  placeholder,
  value,
  onChangeText
}) => {
  const content = (
    <>
      <Icon name="search" size={20} color="#ab8bff" />
      <TextInput
        placeholder={placeholder || "Search"}
        placeholderTextColor="#a8b5db"
        value={value}
        className="ml-2 flex-1 text-base text-white"
        onChangeText={onChangeText}
        editable={!onPress}
        pointerEvents={onPress ? "none" : "auto"}
      />
    </>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center rounded-full bg-dark-200 px-5 py-4"
        activeOpacity={0.7}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <View className="flex-row items-center rounded-full bg-dark-200 px-5 py-4">
      {content}
    </View>
  );
};

export default SearchBar;
