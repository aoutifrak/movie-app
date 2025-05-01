import { fetchPopular } from "@/lib/api";
import { convertTMDBArray } from "@/lib/data-utils";
import MovieCard from "@/components/movie-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function PopularMovies({ page }: { page: string }) {
  const currentPage = Number(page) || 1;
  const data = await fetchPopular('movie', currentPage);
  const movies = convertTMDBArray(data?.results || []);
  const totalPages = data?.total_pages || 1;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
      <div className="flex justify-center items-center gap-2 pt-8">
        {currentPage > 1 && (
          <Link href={`/movies?page=${currentPage - 1}&tab=popular`}>
            <Button variant="outline">Previous</Button>
          </Link>
        )}
        <span className="px-4 py-2">
          Page {currentPage} of {Math.min(totalPages, 500)}
        </span>
        {currentPage < Math.min(totalPages, 500) && (
          <Link href={`/movies?page=${currentPage + 1}&tab=popular`}>
            <Button variant="outline">Next</Button>
          </Link>
        )}
      </div>
    </div>
  );
} 