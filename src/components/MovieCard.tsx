"use client";

import { Movie } from "@/types/movie";
import Image from "next/image";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-transform hover:scale-105">
      <Image
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        alt={movie.title}
        width={500}
        height={750}
        className="w-full h-64 object-cover cursor-pointer"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-100">{movie.title}</h3>
        <p className="text-sm text-gray-400">{movie.release_date}</p>
        <p className="text-sm text-gray-300 mt-2 line-clamp-3">
          {movie.overview}
        </p>
      </div>
    </div>
  );
}
