"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMoviesStart } from "@/redux/Slices/movieSlice";
import { RootState } from "@/redux/store";
import MovieCard from "@/components/MovieCard";
import Pagination from "@/components/Pagination";

export default function Home() {
  const dispatch = useDispatch();
  const { movies, page, totalPages, loading, error } = useSelector(
    (state: RootState) => state.movies
  );

  useEffect(() => {
    dispatch(fetchMoviesStart());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  console.log(movies);
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold ">Popular Movies</h1>
        <h2>Total Pages: {totalPages}</h2>
      </div>
      <p className="mb-4">
        Page {page} of {totalPages}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      <Pagination currentPage={page} totalPages={totalPages} />
    </div>
  );
}
