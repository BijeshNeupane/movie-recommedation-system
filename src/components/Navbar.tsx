"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-gray-100 text-lg font-bold hover:text-blue-400 transition"
        >
          Movie Recommender
        </Link>
        <div className="space-x-4">
          <Link
            href="/"
            className="text-gray-200 hover:text-blue-400 transition"
          >
            Home
          </Link>
          <Link
            href="/categories"
            className="text-gray-200 hover:text-blue-400 transition"
          >
            Categories
          </Link>
        </div>
      </div>
    </nav>
  );
}
