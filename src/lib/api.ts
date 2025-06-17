import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TMDB_BASE_URL,
  params: { api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY },
});

export const fetchMovieDetails = async (movieId: number) => {
  try {
    const response = await api.get(`/movie/${movieId}`);
    return response.data;
  } catch (error) {
    console.error("TMDB API Error:", error);
    throw error;
  }
};

export const fetchSimilarMovies = async (movieId: number, page: number = 1) => {
  try {
    const response = await api.get(`/movie/${movieId}/similar`, {
      params: { page },
    });
    return response.data;
  } catch (error) {
    console.error("TMDB API Error:", error);
    throw error;
  }
};

// ... other functions (fetchPopularMovies, searchMovies)

export const fetchPopularMovies = async (page: number = 1) => {
  const response = await api.get("/movie/popular", { params: { page } });
  return response.data;
};

export const fetchGenres = async () => {
  const response = await api.get("/genre/movie/list");
  return response.data.genres;
};

export const fetchMoviesByGenre = async (genreId: number, page: number = 1) => {
  const response = await api.get("/discover/movie", {
    params: { with_genres: genreId, page },
  });
  return response.data;
};

export const searchMovies = async (query: string, page: number = 1) => {
  const response = await api.get("/search/movie", { params: { query, page } });
  return response.data;
};
