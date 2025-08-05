"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import Image from "next/image";
import MovieCard from "@/components/MovieCard";
import Pagination from "@/components/Pagination";
import MoviePlayerModal from "@/components/MoviePlayerModal";
// import { setPage } from "@/redux/Slices/movieSlice";
import { RootState } from "@/redux/store";
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
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [streamLoading, setStreamLoading] = useState(false);

  useEffect(() => {
    const movieId = Number(id);
    if (isNaN(movieId)) {
      setDetailsError("Invalid movie ID");
      setDetailsLoading(false);
      return;
    }

    const loadMovieDetails = async () => {
      try {
        setDetailsLoading(true);
        const details = await fetchMovieDetails(movieId);
        setMovieDetails(details);
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setDetailsError("Failed to load movie details");
      } finally {
        setDetailsLoading(false);
      }
    };
    loadMovieDetails();
  }, [id]);

  useEffect(() => {
    const movieId = Number(id);
    if (!isNaN(movieId)) {
      dispatch({
        type: "FETCH_SIMILAR_MOVIES", 
        payload: { movieId, page },
      });
    }
  }, [dispatch, id, page]);

  const handleWatchClick = async () => {
    if (!movieDetails) return;
    setStreamLoading(true);
    try {
      const response = await fetch(
        `/api/youtube-search?movieId=${id}&title=${encodeURIComponent(
          movieDetails.title
        )}`
      );
      const data = await response.json();
      if (data.error) {
        console.log("YouTube search error:", data.error);
        setStreamUrl(null);
      } else {
        setStreamUrl(data.streamUrl);
      }
    } catch (err) {
      console.error("Error fetching YouTube stream:", err);
      setStreamUrl(null);
    } finally {
      setStreamLoading(false);
      setIsPlayerOpen(true);
    }
  };

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
            src={
              movieDetails.poster_path
                ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`
                : "/placeholder.jpg"
            }
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
            {movieDetails.vote_average?.toFixed(1)}/10
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
          {/* Watch Button */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
            <button
              onClick={handleWatchClick}
              disabled={streamLoading}
              className={`px-4 py-2 rounded font-semibold transition cursor-pointer ${
                streamLoading
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-[#ED0800] hover:bg-[#ff0800] text-white border-2 border-[#ED0800] hover:border-[#ff0800] hover:-translate-y-1"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95`}
              aria-label={`Watch ${movieDetails.title}`}
            >
              {streamLoading ? "Searching..." : "Watch Now"}
            </button>
            <a
              href={`https://tubitv.com/search/${encodeURIComponent(
                movieDetails.title
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded border-2 border-[#ED0800] hover:bg-[#ff0800] text-white text-center transition active:scale-95 hover:-translate-y-1"
              aria-label={`Search ${movieDetails.title} on Tubi`}
            >
              Try Tubi
            </a>
          </div>
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

      {/* Movie Player Modal */}
      <MoviePlayerModal
        isOpen={isPlayerOpen}
        onClose={() => {
          setIsPlayerOpen(false);
          setStreamUrl(null);
        }}
        url={streamUrl || ""}
        title={movieDetails.title}
      />
    </div>
  );
}
