"use client";

import Link from "next/link";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setSearchQuery } from "@/redux/Slices/movieSlice";
import { useRouter } from "next/navigation";
import SplitText from "@/blocks/TextAnimations/SplitText/SplitText";

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
  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };

  return (
    <nav className="bg-red-800 p-4 shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link
          href="/"
          className="text-gray-100 text-lg md:text-2xl font-bold hover:text-gray-300 transition"
        >
          <SplitText
            text="Movie Recommender"
            className="text-2xl font-semibold text-center"
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
            onLetterAnimationComplete={handleAnimationComplete}
          />
        </Link>
        <div className="flex items-center flex-wrap gap-4 justify-center space-x-4">
          <div className="space-x-4">
            <Link href="/">
              <button className="bg-black text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-gray-900 transition hover:scale-105 active:scale-95">
                Home
              </button>
            </Link>
            <Link href="/categories" className="">
              <button className="bg-black text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-gray-900 transition hover:scale-105 active:scale-95">
                Categories
              </button>
            </Link>
          </div>
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search movies..."
              className="px-3 py-2 rounded-l-md bg-black text-white border-none focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Search movies"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-r-md text-gray-100 bg-[#ED0800] hover:bg-[#ff0800] transition cursor-pointer active:scale-95"
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
