import { Suspense } from "react";
import SearchResults from "@/components/SearchResults";

export default function SearchPage() {
  return (
    <div className="container mx-auto p-4">
      <Suspense
        fallback={
          <p className="text-gray-300 text-center">Loading search results...</p>
        }
      >
        <SearchResults />
      </Suspense>
    </div>
  );
}

// Force dynamic rendering to avoid static prerendering issues
export const dynamic = "force-dynamic";
