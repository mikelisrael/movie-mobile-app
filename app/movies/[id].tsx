import ErrorComponent from "@/components/error-component";
import { icons } from "@/constants/icons";
import { useGetResource } from "@/hooks/use-query-resource";
import { getSIngleMovie } from "@/services/movie.service";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="mt-5 flex-col items-start justify-center">
    <Text className="text-sm font-normal text-light-200">{label}</Text>
    <Text className="mt-2 text-sm font-bold text-light-100">
      {value || "N/A"}
    </Text>
  </View>
);

const MovieDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const {
    data: movie,
    isLoading,
    isError,
    error
  } = useGetResource({
    key: ["movies", id as string],
    fn: () => getSIngleMovie(id as string),
    enabled: !!id
  });

  if (isError) {
    return <ErrorComponent error={error} />;
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center bg-primary">
        <ActivityIndicator color={"#0000ff"} size={"large"} className="mt-52" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View className="relative">
          <Image
            source={{
              uri: "https://image.tmdb.org/t/p/w500" + movie?.poster_path || ""
            }}
            className="h-[550px] w-full"
          />

          <LinearGradient
            colors={["rgba(0,0,0,0.8)", "rgba(0,0,0,0.4)", "transparent"]}
            locations={[0, 0.3, 0.7]}
            className="absolute left-0 right-0 top-0 h-32"
          />
        </View>

        <View className="mt-5 flex-col items-start justify-start px-5">
          <Text className="text-xl font-bold text-white">
            {movie?.title || "Movie Title"}
          </Text>

          <View className="mt-2 flex-row items-center gap-x-1">
            <Text className="mt-2 text-sm text-light-200">
              {movie?.release_date?.split("-")[0]}
            </Text>

            <Text className="mt-2 text-sm text-light-200">
              {movie?.runtime}m
            </Text>
          </View>

          <View className="mt-2 flex-row items-center gap-x-1 rounded-md bg-dark-100 px-2 py-1">
            <Image source={icons.star} className="size-4" />
            <Text className="text-sm font-bold text-white">
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>
            <Text className="text-sm text-light-200">
              ({movie?.vote_count} votes)
            </Text>
          </View>

          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo
            label="Genres"
            value={movie?.genres?.map((g: any) => g.name).join(" • ") || "N/A"}
          />

          {(movie?.budget || movie?.revenue) && (
            <View className="flex w-1/2 flex-row justify-between">
              <MovieInfo
                label="Budget"
                value={`$${(movie?.budget ?? 0) / 1_000_000} million`}
              />
              <MovieInfo
                label="Revenue"
                value={`$${Math.round(
                  (movie?.revenue ?? 0) / 1_000_000
                )} million`}
              />
            </View>
          )}

          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies
                ?.map((c: any) => c.name)
                .join(" • ") || "N/A"
            }
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 z-50 mx-5 flex flex-row items-center justify-center rounded-lg bg-accent py-3.5"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="mr-1 mt-0.5 size-5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-base font-semibold text-white">Go Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MovieDetails;
