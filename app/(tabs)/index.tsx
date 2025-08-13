import ErrorComponent from "@/components/error-component";
import MovieCard from "@/components/movie-card";
import SearchBar from "@/components/search-bar";
import TrendingCard from "@/components/trending-card";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useGetResource } from "@/hooks/use-query-resource";
import { getTrendingMovies } from "@/services/appwrite.service";
import { fetchMovies } from "@/services/movie.service";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();

  const {
    data: trendingMoviesData,
    isLoading: trendingMoviesLoading,
    isError: isTrendingMoviesError
  } = useGetResource({
    key: ["movies", "trending"],
    fn: getTrendingMovies
  });

  const {
    data: moviesData,
    isLoading: moviesLoading,
    isError,
    error
  } = useGetResource({
    key: ["movies", "recent"],
    fn: () => fetchMovies({})
  });

  if (moviesLoading || trendingMoviesLoading) {
    return (
      <View className="flex-1 items-center bg-primary">
        <Image source={images.bg} className="absolute z-0 w-full" />
        <ActivityIndicator color={"#0000ff"} size={"large"} className="mt-52" />
      </View>
    );
  }

  if (isError || isTrendingMoviesError) {
    return <ErrorComponent error={error ?? undefined} />;
  }

  const movies = moviesData?.results || [];

  // Create chunks of movies for grid display (3 columns)
  const movieChunks = [];
  for (let i = 0; i < movies.length; i += 3) {
    movieChunks.push(movies.slice(i, i + 3));
  }

  const renderMovieRow = ({
    item: movieRow,
    index
  }: {
    item: Movie[];
    index: number;
  }) => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "flex-start",
        gap: 20,
        marginBottom: 12,
        paddingRight: 4
      }}
    >
      {movieRow.map((movie) => (
        <MovieCard key={movie.id} item={movie} />
      ))}
    </View>
  );

  const ListHeaderComponent = () => (
    <View>
      <Image
        source={icons.logo}
        className="mb-5 mt-5 h-10 w-12 self-center"
        resizeMode="contain"
      />

      <View className="px-5">
        <SearchBar
          onPress={() => router.push("/search")}
          placeholder="Search for a movie"
        />
      </View>

      {!!trendingMoviesData.length && (
        <View className="mt-10">
          <Text className="mb-3 ml-1 text-lg font-bold text-white">
            Trending Movies
          </Text>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 4, paddingRight: 20 }}
            ItemSeparatorComponent={() => <View className="w-4" />}
            data={trendingMoviesData}
            renderItem={({ item }: { item: TrendingMovie }) => (
              <TrendingCard
                movie={item}
                index={trendingMoviesData.indexOf(item)}
              />
            )}
            keyExtractor={(item) => item.movie_id.toString()}
          />
        </View>
      )}

      <Text className="mb-3 mt-10 text-lg font-bold text-white">
        Latest Movies
      </Text>
    </View>
  );

  const ListEmptyComponent = () => (
    <View className="flex-1 items-center justify-center py-20">
      <Text className="text-lg text-white">No movies found</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute z-0 w-full" />

      <FlatList
        data={movieChunks}
        renderItem={renderMovieRow}
        keyExtractor={(item, index) => `row-${index}`}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 5,
          paddingBottom: 100
        }}
      />
    </SafeAreaView>
  );
}
