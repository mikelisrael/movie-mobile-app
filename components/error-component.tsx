import { images } from "@/constants/images";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface ErrorComponentProps {
  error?: Error;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({ error }) => {
  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute z-0 w-full" />
      <View className="flex-1 items-center justify-center px-5">
        <Text className="mb-1 text-center text-lg text-white">
          Oops! Something went wrong
        </Text>
        <Text className="mb-6 text-center text-sm text-gray-400">
          {error?.message || "Unable to load movies. Please try again."}
        </Text>
        <TouchableOpacity
          className="rounded-lg bg-blue-600 px-6 py-3"
          onPress={() => {}}
        >
          <Text className="font-semibold text-white">Try Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ErrorComponent;
