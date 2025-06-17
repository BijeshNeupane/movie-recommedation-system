"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Movie } from "@/types/movie";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [imgError, setImgError] = useState(false);

  const imageSrc =
    !imgError && movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "/placeholder.jpg";

  return (
    <Link
      href={`/movies/${movie.id}`}
      className="group block rounded-lg overflow-hidden shadow-lg hover:shadow-blue-500/50 transition-shadow bg-gray-800"
    >
      <div className="relative h-80">
        <Image
          src={imageSrc}
          alt={movie.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          onError={() => setImgError(true)}
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-100 truncate">
          {movie.title}
        </h3>
        <p className="text-sm text-gray-400">
          {movie.release_date?.slice(0, 4)}
        </p>
      </div>
    </Link>
  );
}
