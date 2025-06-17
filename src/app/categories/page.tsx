"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGenresStart } from "@/redux/Slices/genreSlice";
import { RootState } from "@/redux/store";
import MovieCard from "@/components/MovieCard";
import Pagination from "@/components/Pagination";

export default function Categories() {
  const dispatch = useDispatch();
  const {
    genres,
    loading: genresLoading,
    error: genresError,
  } = useSelector((state: RootState) => state.genres);
  const {
    movies,
    page,
    totalPages,
    loading: moviesLoading,
    error: moviesError,
  } = useSelector((state: RootState) => state.movies);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchGenresStart());
  }, [dispatch]);

  useEffect(() => {
    if (selectedGenre) {
      dispatch({
        type: "FETCH_MOVIES_BY_GENRE",
        payload: { genreId: selectedGenre, page },
      });
    }
  }, [dispatch, selectedGenre, page]);

  if (genresLoading)
    return <p className="text-gray-300 text-center">Loading genres...</p>;
  if (genresError)
    return <p className="text-red-400 text-center">Error: {genresError}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-100 mb-6">
        Browse by Category
      </h1>
      <div className="flex flex-wrap gap-2 mb-6">
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => setSelectedGenre(genre.id)}
            className={`px-4 py-2 rounded font-medium transition ${
              selectedGenre === genre.id
                ? "bg-blue-600 text-gray-100"
                : "bg-gray-700 text-gray-200 hover:bg-blue-500 hover:text-gray-100"
            }`}
          >
            {genre.name}
          </button>
        ))}
      </div>
      {selectedGenre && (
        <>
          {moviesLoading ? (
            <p className="text-gray-300 text-center">Loading movies...</p>
          ) : moviesError ? (
            <p className="text-red-400 text-center">Error: {moviesError}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
          <Pagination currentPage={page} totalPages={totalPages} />
        </>
      )}
    </div>
  );
}
