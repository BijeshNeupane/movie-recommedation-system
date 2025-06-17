import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Movie, MovieResponse } from "@/types/movie";

interface MovieState {
  movies: Movie[];
  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

const initialState: MovieState = {
  movies: [],
  page: 1,
  totalPages: 1,
  loading: false,
  error: null,
  searchQuery: "",
};

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    fetchMoviesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchMoviesSuccess(state, action: PayloadAction<MovieResponse>) {
      state.movies = action.payload.results;
      state.page = action.payload.page;
      state.totalPages = action.payload.total_pages;
      state.loading = false;
    },
    fetchMoviesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
      state.page = 1;
    },
  },
});

export const {
  fetchMoviesStart,
  fetchMoviesSuccess,
  fetchMoviesFailure,
  setPage,
  setSearchQuery,
} = movieSlice.actions;
export default movieSlice.reducer;
