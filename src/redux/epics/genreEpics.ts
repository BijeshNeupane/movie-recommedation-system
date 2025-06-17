import { Epic, ofType } from "redux-observable";
import { from, of } from "rxjs";
import { mergeMap, catchError, map } from "rxjs/operators";
import { fetchGenres } from "@/lib/api";
import {
  fetchGenresStart,
  fetchGenresSuccess,
  fetchGenresFailure,
} from "@/redux/Slices/genreSlice";

export const fetchGenresEpic: Epic = (action$) =>
  action$.pipe(
    ofType(fetchGenresStart.type),
    mergeMap(() =>
      from(fetchGenres()).pipe(
        map((genres) => fetchGenresSuccess(genres)),
        catchError((error) => of(fetchGenresFailure(error.message)))
      )
    )
  );
