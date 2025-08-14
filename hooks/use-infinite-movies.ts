import { fetchMovies } from "@/services/movie.service";
import { useCallback, useEffect, useState } from "react";

export const useInfiniteMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  const loadMovies = useCallback(async (page: number, reset = false) => {
    try {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      setIsError(false);

      const response = await fetchMovies({ page });
      const newMovies = response.results || [];

      if (reset || page === 1) {
        setMovies(newMovies);
      } else {
        setMovies((prev) => [...prev, ...newMovies]);
      }

      setHasNextPage(page < (response.total_pages || 1));
    } catch (err) {
      setIsError(true);
      setError(err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  const loadMoreMovies = useCallback(() => {
    if (!isLoadingMore && hasNextPage) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadMovies(nextPage);
    }
  }, [currentPage, isLoadingMore, hasNextPage, loadMovies]);

  const refreshMovies = useCallback(() => {
    setCurrentPage(1);
    loadMovies(1, true);
  }, [loadMovies]);

  useEffect(() => {
    loadMovies(1);
  }, [loadMovies]);

  return {
    movies,
    isLoading,
    isLoadingMore,
    isError,
    error,
    hasNextPage,
    loadMoreMovies,
    refreshMovies
  };
};
