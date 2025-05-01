import { Suspense } from 'react';
import Image from 'next/image';
import { fetchTrending, fetchPopular, fetchTopRated } from '@/lib/api';
import { convertTMDBArray } from '@/lib/data-utils';
import Hero from '@/components/hero';
import MovieSlider from '@/components/movie-slider';
import CategoryGrid from '@/components/category-grid';
import { Skeleton } from '@/components/ui/skeleton';

// Loading fallback for movie sliders
const MovieSliderSkeleton = ({ title }: { title: string }) => (
  <section className="py-6">
    <div className="container px-4 md:px-6">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-[300px] w-full rounded-lg" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default async function Home() {
  // Fetch data for different sections
  const [trendingData, popularMovies, topRatedMovies] = await Promise.all([
    fetchTrending('all', 'week'),
    fetchPopular('movie'),
    fetchTopRated('movie')
  ]);

  // Process data
  const trending = convertTMDBArray(trendingData?.results?.slice(0, 10) || []);
  const popular = convertTMDBArray(popularMovies?.results?.slice(0, 20) || []);
  const topRated = convertTMDBArray(topRatedMovies?.results?.slice(0, 20) || []);
  
  // Featured movies for hero (using first 5 trending items)
  const featuredMovies = trending.slice(0, 5);

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <Suspense fallback={
        <div className="w-full h-[70vh] md:h-[80vh] bg-gradient-to-b from-background/20 to-background relative">
          <Skeleton className="absolute inset-0" />
        </div>
      }>
        <Hero featuredMovies={featuredMovies} />
      </Suspense>
      
      {/* Trending Movies */}
      <Suspense fallback={<MovieSliderSkeleton title="Trending Now" />}>
        <MovieSlider 
          title="Trending Now" 
          subtitle="The most popular movies and shows this week"
          movies={trending} 
          viewAllLink="/trending"
          variant="featured"
        />
      </Suspense>
      
      {/* Popular Movies */}
      <Suspense fallback={<MovieSliderSkeleton title="Popular Movies" />}>
        <MovieSlider 
          title="Popular Movies" 
          movies={popular} 
          viewAllLink="/movies/popular"
        />
      </Suspense>
      
      {/* Categories */}
      <CategoryGrid />
      
      {/* Top Rated Movies */}
      <Suspense fallback={<MovieSliderSkeleton title="Top Rated Movies" />}>
        <MovieSlider 
          title="Top Rated Movies" 
          subtitle="Highest rated movies of all time"
          movies={topRated} 
          viewAllLink="/movies/top-rated"
        />
      </Suspense>
    </div>
  );
}