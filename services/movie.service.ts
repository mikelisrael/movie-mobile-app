import { apiGet, appendMovieQueryParams } from "./_http.service";

export const fetchMovies = async ({
  query,
  page = 1,
  includeAdult = false
}: {
  query?: string;
  page?: number;
  includeAdult?: boolean;
}) => {
  if (query) {
    const searchPath = appendMovieQueryParams("/search/movie", {
      query,
      page,
      include_adult: includeAdult
    });
    return await apiGet(searchPath);
  }

  const discoverPath = appendMovieQueryParams("/discover/movie", {
    sort_by: "popularity.desc",
    page,
    include_adult: includeAdult,
    include_video: false,
    language: "en-US"
  });

  return await apiGet(discoverPath);
};

export const getSIngleMovie = async (id: string) => {
  const moviePath = `/movie/${id}`;
  return await apiGet(moviePath);
};
