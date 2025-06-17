import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Genre } from "@/types/genre";

interface GenreState {
  genres: Genre[];
  loading: boolean;
  error: string | null;
}

const initialState: GenreState = {
  genres: [],
  loading: false,
  error: null,
};

const genreSlice = createSlice({
  name: "genres",
  initialState,
  reducers: {
    fetchGenresStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchGenresSuccess(state, action: PayloadAction<Genre[]>) {
      state.genres = action.payload;
      state.loading = false;
    },
    fetchGenresFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchGenresStart, fetchGenresSuccess, fetchGenresFailure } =
  genreSlice.actions;
export default genreSlice.reducer;
