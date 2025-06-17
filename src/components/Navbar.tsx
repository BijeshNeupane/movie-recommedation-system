"use client";

import Link from "next/link";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setSearchQuery } from "@/redux/Slices/movieSlice";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [searchInput, setSearchInput] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      dispatch(setSearchQuery(searchInput.trim()));
      router.push(`/search?query=${encodeURIComponent(searchInput.trim())}`);
      setSearchInput(""); // Clear input after search
    }
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link
          href="/"
          className="text-gray-100 text-lg font-bold hover:text-blue-400 transition"
        >
          Movie Recommender
        </Link>
        <div className="flex items-center flex-wrap gap-4 justify-center space-x-4">
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
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search movies..."
              className="px-3 py-2 rounded-l-md bg-gray-700 text-gray-200 border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search movies"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-r-md bg-blue-600 text-gray-100 hover:bg-blue-500 transition"
              aria-label="Submit search"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
