import { icons } from "@/constants/icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface MovieCardProps {
  item: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ item }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      className="flex-1"
      onPress={() => router.push(`/movies/${item.id}`)}
    >
      <Image
        source={{
          uri: `https://image.tmdb.org/t/p/w500${item.poster_path}`
        }}
        className="h-52 w-full rounded-lg"
        resizeMode="cover"
      />
      <Text className="mt-2 text-sm font-semibold text-white" numberOfLines={2}>
        {item.title}
      </Text>

      <View className="flex-row items-center justify-start gap-x-1">
        <Image source={icons.star} className="size-4" />
        <Text className="text-xs font-bold text-white">
          {Math.round(item.vote_average / 2)}
        </Text>
      </View>

      <View className="flex-row items-center justify-between gap-x-1">
        <Text className="mt-1 text-xs font-medium text-light-300">
          {item.release_date?.split("-")[0] || "Unknown"}
        </Text>
        <Text className="mt-1 text-xs font-medium text-light-300">Movie</Text>
      </View>
    </TouchableOpacity>
  );
};

export default MovieCard;
