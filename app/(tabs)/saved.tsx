import Icon from "@react-native-vector-icons/ionicons";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Saved = () => {
  return (
    <SafeAreaView className="flex-1 bg-primary px-10">
      <View className="flex flex-1 flex-col items-center justify-center gap-5">
        <Icon name="book-outline" size={40} color="#fff" />
        <Text className="text-base text-gray-500">Saved</Text>
      </View>
    </SafeAreaView>
  );
};

export default Saved;
