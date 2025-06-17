"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import Image from "next/image";
// import { fetchMoviesStart, setPage } from "@/redux/slices/movieSlice";
import { RootState } from "@/redux/store";
import MovieCard from "@/components/MovieCard";
import Pagination from "@/components/Pagination";
import { fetchMovieDetails } from "@/lib/api";
import { Movie } from "@/types/movie";

export default function MovieDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { movies, page, totalPages, loading, error } = useSelector(
    (state: RootState) => state.movies
  );
  const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  useEffect(() => {
    const loadMovieDetails = async () => {
      try {
        setDetailsLoading(true);
        const details = await fetchMovieDetails(Number(id));
        setMovieDetails(details);
      } catch (err) {
        setDetailsError("Failed to load movie details");
        console.log(err);
      } finally {
        setDetailsLoading(false);
      }
    };
    loadMovieDetails();
  }, [id]);

  useEffect(() => {
    if (id) {
      dispatch({
        type: "FETCH_SIMILAR_MOVIES",
        payload: { movieId: Number(id), page },
      });
    }
  }, [dispatch, id, page]);

  if (detailsLoading)
    return (
      <p className="text-gray-300 text-center">Loading movie details...</p>
    );
  if (detailsError)
    return <p className="text-red-400 text-center">Error: {detailsError}</p>;
  if (!movieDetails)
    return <p className="text-gray-300 text-center">Movie not found</p>;

  return (
    <div className="container mx-auto p-4">
      {/* Movie Details Section */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-shrink-0">
          <Image
            src={`https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`}
            alt={movieDetails.title}
            width={300}
            height={450}
            className="rounded-lg shadow-lg"
          />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-100 mb-2">
            {movieDetails.title}
          </h1>
          <p className="text-gray-400 mb-2">
            <span className="font-semibold">Release Date:</span>{" "}
            {movieDetails.release_date}
          </p>
          <p className="text-gray-400 mb-2">
            <span className="font-semibold">Rating:</span>{" "}
            {movieDetails.vote_average.toFixed(1)}/10
          </p>
          {movieDetails.genres && (
            <p className="text-gray-400 mb-2">
              <span className="font-semibold">Genres:</span>{" "}
              {movieDetails.genres.map((g) => g.name).join(", ")}
            </p>
          )}
          {movieDetails.runtime && (
            <p className="text-gray-400 mb-2">
              <span className="font-semibold">Runtime:</span>{" "}
              {movieDetails.runtime} minutes
            </p>
          )}
          <p className="text-gray-300 mt-4">{movieDetails.overview}</p>
        </div>
      </div>

      {/* Similar Movies Section */}
      <h2 className="text-2xl font-bold text-gray-100 mb-4">Similar Movies</h2>
      {loading ? (
        <p className="text-gray-300 text-center">Loading similar movies...</p>
      ) : error ? (
        <p className="text-red-400 text-center">Error: {error}</p>
      ) : movies.length === 0 ? (
        <p className="text-gray-300 text-center">No similar movies found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <Pagination currentPage={page} totalPages={totalPages} />
      )}
    </div>
  );
}
