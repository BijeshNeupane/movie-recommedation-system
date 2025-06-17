import { configureStore } from "@reduxjs/toolkit";
import { createEpicMiddleware } from "redux-observable";
import { combineEpics } from "redux-observable";
import movieReducer from "./Slices/movieSlice";
import genreReducer from "./Slices/genreSlice";
import {
  fetchMoviesEpic,
  fetchMoviesByGenreEpic,
  fetchSimilarMoviesEpic,
  fetchSearchMoviesEpic,
} from "./epics/movieEpics";
import { fetchGenresEpic } from "./epics/genreEpics";

const epicMiddleware = createEpicMiddleware();
const rootEpic = combineEpics(
  fetchMoviesEpic,
  fetchMoviesByGenreEpic,
  fetchSimilarMoviesEpic,
  fetchSearchMoviesEpic,
  fetchGenresEpic
);

export const store = configureStore({
  reducer: {
    movies: movieReducer,
    genres: genreReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(epicMiddleware),
});

epicMiddleware.run(rootEpic);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
