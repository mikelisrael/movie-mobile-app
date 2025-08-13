import ErrorComponent from "@/components/error-component";
import MovieCard from "@/components/movie-card";
import SearchBar from "@/components/search-bar";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useDebounce } from "@/hooks/use-debounce";
import { useGetResource } from "@/hooks/use-query-resource";
import { updateSearchCount } from "@/services/appwrite.service";
import { fetchMovies } from "@/services/movie.service";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  View
} from "react-native";

const Search = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

  const {
    data,
    isLoading: moviesLoading,
    isError,
    error
  } = useGetResource({
    key: ["movies", debouncedQuery],
    fn: () =>
      fetchMovies({
        query: debouncedQuery
      }),
    onSuccess: (data) => {
      const movies = data?.results || [];
      if (movies.length > 0 && movies?.[0] && debouncedQuery) {
        updateSearchCount(debouncedQuery, movies[0] as Movie);
      }
    }
  });
  const movies = data?.results || [];

  const handleSearchChange = useCallback((text: string) => {
    setQuery(text);
  }, []);

  if (isError) {
    return <ErrorComponent error={error} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute z-0 w-full"
        resizeMode="cover"
      />

      <View className="w-full items-center justify-center px-5 pb-4">
        <Image
          source={icons.logo}
          className="mb-5 mt-14 h-10 w-12 self-center"
          resizeMode="contain"
        />

        <SearchBar
          onChangeText={handleSearchChange}
          value={query}
          placeholder="Search movies..."
        />

        {moviesLoading && debouncedQuery.trim() && (
          <ActivityIndicator
            color={"#0000ff"}
            size={"large"}
            className="my-3"
          />
        )}

        {!moviesLoading &&
          !error &&
          debouncedQuery.trim() &&
          movies.length > 0 && (
            <Text className="mb-3 mt-5 w-full text-xl font-bold text-white">
              Search Results for{" "}
              <Text className="text-accent"> {debouncedQuery}</Text>
            </Text>
          )}
      </View>

      {!moviesLoading && debouncedQuery.trim() && movies.length === 0 && (
        <View className="flex-1 items-center justify-center bg-primary py-20">
          <Text className="text-lg text-white">No movies found</Text>
        </View>
      )}

      <FlatList
        data={movies}
        renderItem={({ item }: { item: Movie }) => <MovieCard item={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 5,
          paddingBottom: 100
        }}
        columnWrapperStyle={{
          justifyContent: "center",
          gap: 16,
          marginVertical: 16
        }}
      />
    </SafeAreaView>
  );
};

export default Search;
