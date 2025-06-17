import { Epic, ofType } from "redux-observable";
import { from, of } from "rxjs";
import { mergeMap, catchError, map } from "rxjs/operators";
import {
  fetchMoviesByGenre,
  fetchPopularMovies,
  fetchSimilarMovies,
  searchMovies,
} from "@/lib/api";
import {
  fetchMoviesStart,
  fetchMoviesSuccess,
  fetchMoviesFailure,
  setPage,
} from "@/redux/Slices/movieSlice";

export const fetchMoviesEpic: Epic = (action$) =>
  action$.pipe(
    ofType(fetchMoviesStart.type, setPage.type),
    mergeMap((action: { type: string; payload?: number }) => {
      const page = action.type === setPage.type ? action.payload : 1;
      return from(fetchPopularMovies(page)).pipe(
        // wrapped with 'from()'
        map((response) => fetchMoviesSuccess(response)),
        catchError((error) => of(fetchMoviesFailure(error.message)))
      );
    })
  );

export const fetchMoviesByGenreEpic: Epic = (action$) =>
  action$.pipe(
    ofType("FETCH_MOVIES_BY_GENRE"),
    mergeMap((action: { payload: { genreId: number; page: number } }) => {
      const { genreId, page } = action.payload;
      return from(fetchMoviesByGenre(genreId, page)).pipe(
        // wrapped with 'from()'
        map((response) => fetchMoviesSuccess(response)),
        catchError((error) => of(fetchMoviesFailure(error.message)))
      );
    })
  );

export const fetchSimilarMoviesEpic: Epic = (action$) =>
  action$.pipe(
    ofType("FETCH_SIMILAR_MOVIES"),
    mergeMap((action: { payload: { movieId: number; page: number } }) => {
      const { movieId, page } = action.payload;
      return from(fetchSimilarMovies(movieId, page)).pipe(
        map((response) => fetchMoviesSuccess(response)),
        catchError((error) => of(fetchMoviesFailure(error.message)))
      );
    })
  );

export const fetchSearchMoviesEpic: Epic = (action$) =>
  action$.pipe(
    ofType("FETCH_SEARCH_MOVIES"),
    mergeMap((action: { payload: { query: string; page: number } }) => {
      const { query, page } = action.payload;
      return from(searchMovies(query, page)).pipe(
        map((response) => fetchMoviesSuccess(response)),
        catchError((error) => of(fetchMoviesFailure(error.message)))
      );
    })
  );
