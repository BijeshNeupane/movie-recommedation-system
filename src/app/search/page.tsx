"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { setSearchQuery } from "@/redux/Slices/movieSlice";
import { RootState } from "@/redux/store";
import MovieCard from "@/components/MovieCard";
import Pagination from "@/components/Pagination";

export default function Search() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const { movies, page, totalPages, loading, error, searchQuery } = useSelector(
    (state: RootState) => state.movies
  );

  useEffect(() => {
    if (query && query !== searchQuery) {
      dispatch(setSearchQuery(query));
    }
    if (query) {
      dispatch({
        type: "FETCH_SEARCH_MOVIES",
        payload: { query, page },
      });
    }
  }, [dispatch, query, page, searchQuery]);

  if (!query)
    return (
      <p className="text-gray-300 text-center">Please enter a search query</p>
    );
  if (loading)
    return (
      <p className="text-gray-300 text-center">Loading search results...</p>
    );
  if (error) return <p className="text-red-400 text-center">Error: {error}</p>;
  if (movies.length === 0)
    return (
      <p className="text-gray-300 text-center">No movies found for {query}</p>
    );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-100">
          Search Results for {query}
        </h1>
        <h2 className="text-gray-200">Total Pages: {totalPages}</h2>
      </div>
      <p className="mb-4 text-gray-300">
        Page {page} of {totalPages}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} />
      )}
    </div>
  );
}
