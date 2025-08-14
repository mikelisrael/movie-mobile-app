import React, { memo } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

interface OptimizedMovieCardProps {
  item: Movie;
  onPress?: (movie: Movie) => void;
}

const OptimizedMovieCard = memo<OptimizedMovieCardProps>(
  ({ item, onPress }) => {
    const handlePress = React.useCallback(() => {
      onPress?.(item);
    }, [item, onPress]);

    return (
      <TouchableOpacity
        onPress={handlePress}
        style={{
          width: "30%",
          marginHorizontal: 4
        }}
      >
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w342${item.poster_path}` }}
          style={{
            width: "100%",
            aspectRatio: 2 / 3,
            borderRadius: 8
          }}
          resizeMode="cover"
        />
        <Text
          numberOfLines={2}
          style={{
            color: "white",
            fontSize: 12,
            marginTop: 4,
            fontWeight: "500"
          }}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.item.id === nextProps.item.id &&
      prevProps.item.title === nextProps.item.title &&
      prevProps.item.poster_path === nextProps.item.poster_path
    );
  }
);

OptimizedMovieCard.displayName = "OptimizedMovieCard";

interface OptimizedMovieRowProps {
  movies: Movie[];
  onMoviePress?: (movie: Movie) => void;
}

const OptimizedMovieRow = memo<OptimizedMovieRowProps>(
  ({ movies, onMoviePress }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 12,
          paddingHorizontal: 5
        }}
      >
        {movies.map((movie) => (
          <OptimizedMovieCard
            key={movie.id}
            item={movie}
            onPress={onMoviePress}
          />
        ))}

        {Array.from({ length: 3 - movies.length }).map((_, index) => (
          <View key={`empty-${index}`} style={{ width: "30%" }} />
        ))}
      </View>
    );
  },
  (prevProps, nextProps) => {
    // Only re-render if the movies array actually changed
    if (prevProps.movies.length !== nextProps.movies.length) return false;

    return prevProps.movies.every(
      (movie, index) => movie.id === nextProps.movies[index]?.id
    );
  }
);

OptimizedMovieRow.displayName = "OptimizedMovieRow";

export { OptimizedMovieCard, OptimizedMovieRow };
