import ErrorComponent from "@/components/error-component";
import { OptimizedMovieRow } from "@/components/optimized-movie-card";
import SearchBar from "@/components/search-bar";
import TrendingCard from "@/components/trending-card";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { useInfiniteMovies } from "@/hooks/use-infinite-movies";
import { useGetResource } from "@/hooks/use-query-resource";
import { getTrendingMovies } from "@/services/appwrite.service";
import { useRouter } from "expo-router";
import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  View
} from "react-native";
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
    movies,
    isLoading: moviesLoading,
    isLoadingMore,
    isError,
    error,
    hasNextPage,
    loadMoreMovies,
    refreshMovies
  } = useInfiniteMovies();

  const movieChunks = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < movies.length; i += 3) {
      chunks.push(movies.slice(i, i + 3));
    }
    return chunks;
  }, [movies]);

  const handleMoviePress = useCallback(
    (movie: Movie) => {
      router.push(`/movies/${movie.id}`);
    },
    [router]
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isLoadingMore) {
      loadMoreMovies();
    }
  }, [hasNextPage, isLoadingMore, loadMoreMovies]);

  const handleRefresh = useCallback(() => {
    refreshMovies();
  }, [refreshMovies]);

  const renderMovieRow = useCallback(
    ({ item: movieRow }: { item: Movie[] }) => (
      <OptimizedMovieRow movies={movieRow} onMoviePress={handleMoviePress} />
    ),
    [handleMoviePress]
  );

  const keyExtractor = useCallback((item: Movie[], index: number) => {
    return `row-${index}-${item[0]?.id || "empty"}`;
  }, []);

  const ListHeaderComponent = useMemo(
    () => (
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

        {!!trendingMoviesData?.length && (
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
              initialNumToRender={3}
              maxToRenderPerBatch={3}
              windowSize={5}
              removeClippedSubviews={true}
              getItemLayout={(data, index) => ({
                length: 150,
                offset: 150 * index,
                index
              })}
            />
          </View>
        )}

        <Text className="mb-3 mt-10 text-lg font-bold text-white">
          Latest Movies
        </Text>
      </View>
    ),
    [trendingMoviesData, router]
  );

  const ListEmptyComponent = useMemo(
    () => (
      <View className="flex-1 items-center justify-center py-20">
        <Text className="text-lg text-white">No movies found</Text>
      </View>
    ),
    []
  );

  const ListFooterComponent = useMemo(() => {
    if (!isLoadingMore) return null;

    return (
      <View className="items-center py-4">
        <ActivityIndicator color={"#0000ff"} size={"small"} />
        <Text className="mt-2 text-white">Loading more movies...</Text>
      </View>
    );
  }, [isLoadingMore]);

  const refreshControl = useMemo(
    () => (
      <RefreshControl
        refreshing={moviesLoading && movies.length > 0}
        onRefresh={handleRefresh}
        tintColor="#0000ff"
      />
    ),
    [moviesLoading, movies.length, handleRefresh]
  );

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

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute z-0 w-full" />

      <FlatList
        data={movieChunks}
        renderItem={renderMovieRow}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 0, // Moved padding to individual components
          paddingBottom: 100
        }}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        refreshControl={refreshControl}
        initialNumToRender={6} // Render 6 rows initially (18 movies)
        maxToRenderPerBatch={3} // Render 3 rows per batch
        windowSize={10} // Keep 10 screens worth of items in memory
        removeClippedSubviews={true} // Remove views outside viewport
        updateCellsBatchingPeriod={50} // Batch updates every 50ms
        // Disable nested scrolling optimizations if needed
        nestedScrollEnabled={false}

        // Optional: Use getItemLayout for better performance if row heights are consistent
        // getItemLayout={(data, index) => ({
        //   length: ITEM_HEIGHT, // Replace with your actual row height
        //   offset: ITEM_HEIGHT * index,
        //   index,
        // })}
      />
    </SafeAreaView>
  );
}
