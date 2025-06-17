export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  genres?: { id: number; name: string }[]; // Add genres for details
  runtime?: number; // Add runtime for details
  budget?: number; // Optional fields for details
  revenue?: number;
}

export interface MovieResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}
