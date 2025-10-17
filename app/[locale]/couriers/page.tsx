'use client';

import SimpleFooter from '@/components/SimpleFooter';
import SimpleHeader from '@/components/SimpleHeader';
import { getLanguageByCode } from '@/lib/languages';
import { motion } from 'framer-motion';
import { CheckCircle, Filter, Loader2, MapPin, Search, Star, Truck } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface CourierSearchResult {
  _id: string;
  name: string;
  city?: string;
  country?: string;
  profileImage?: string;
  transportType?: string;
  rating?: number;
  completedDeliveries?: number;
}

interface SearchFilters {
  city?: string;
  country?: string;
  minRating: number;
}

export default function CourierSearchPage() {
  const t = useTranslations('courier.search');
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = getLanguageByCode(locale)?.culturalTheme;
  
  const [couriers, setCouriers] = useState<CourierSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    city: searchParams.get('city') || undefined,
    country: searchParams.get('country') || undefined,
    minRating: parseFloat(searchParams.get('minRating') || '0'),
  });
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalCouriers, setTotalCouriers] = useState(0);
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    fetchCouriers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);
  
  async function fetchCouriers() {
    try {
      setLoading(true);
      
      // Build query string
      const queryParams = new URLSearchParams();
      if (filters.city) queryParams.set('city', filters.city);
      if (filters.country) queryParams.set('country', filters.country);
      if (filters.minRating > 0) queryParams.set('minRating', filters.minRating.toString());
      queryParams.set('page', page.toString());
      queryParams.set('limit', '12');
      
      const response = await fetch(`/api/couriers?${queryParams.toString()}`);
      
      if (response.ok) {
        const data = await response.json();
        setCouriers(data.couriers);
        setTotalCouriers(data.pagination.total);
      } else {
        setError(t('fetchError'));
      }
    } catch (err) {
      console.error('Error fetching couriers:', err);
      setError(t('fetchError'));
    } finally {
      setLoading(false);
    }
  }
  
  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setFilters({
      ...filters,
      city: searchQuery || undefined
    });
    setPage(1);
  }
  
  function handleFilterChange(key: keyof SearchFilters, value: any) {
    setFilters({
      ...filters,
      [key]: value
    });
    setPage(1);
  }
  
  // Format rating display
  const formatRating = (rating?: number): string => {
    if (!rating) return '—';
    return rating.toFixed(1);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SimpleHeader />
      
      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">{t('title')}</h1>
          <p className="text-gray-600 mt-2">{t('subtitle')}</p>
        </div>
        
        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full px-5 py-3 pl-12 border rounded-lg focus:ring-2 transition-all"
                style={{ borderColor: theme?.primary, outlineColor: theme?.primary }}
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-lg font-medium text-white hover:opacity-90 transition-all"
              style={{ backgroundColor: theme?.primary }}
            >
              {t('search')}
            </button>
            <button
              type="button"
              onClick={() => setFiltersVisible(!filtersVisible)}
              className={`px-4 py-3 rounded-lg font-medium border flex items-center ${
                filtersVisible ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
              }`}
            >
              <Filter className={`mr-2 ${filtersVisible ? 'text-blue-600' : 'text-gray-400'}`} />
              {t('filters')}
            </button>
          </form>
        </div>
        
        {/* Filters */}
        {filtersVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8"
          >
            <h3 className="font-semibold mb-4">{t('filterBy')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Minimum Rating Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t('minRating')}
                </label>
                <div className="flex items-center space-x-4">
                  {[0, 3, 3.5, 4, 4.5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleFilterChange('minRating', rating)}
                      className={`flex items-center px-3 py-1.5 rounded ${
                        filters.minRating === rating 
                          ? 'bg-blue-100 text-blue-700 border border-blue-300' 
                          : 'bg-gray-100 border border-gray-200'
                      }`}
                    >
                      {rating === 0 ? t('any') : (
                        <>
                          <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                          {rating.toFixed(1)}+
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Applied Filters */}
            {(filters.city || filters.country || filters.minRating > 0) && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-500">{t('activeFilters')}:</span>
                  
                  {filters.city && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100">
                      <MapPin className="w-3 h-3 mr-1" />
                      {filters.city}
                      <button 
                        onClick={() => handleFilterChange('city', undefined)}
                        className="ml-1 text-gray-400 hover:text-gray-600"
                      >
                        &times;
                      </button>
                    </span>
                  )}
                  
                  {filters.country && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100">
                      {filters.country}
                      <button 
                        onClick={() => handleFilterChange('country', undefined)}
                        className="ml-1 text-gray-400 hover:text-gray-600"
                      >
                        &times;
                      </button>
                    </span>
                  )}
                  
                  {filters.minRating > 0 && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100">
                      <Star className="w-3 h-3 mr-1 text-yellow-400 fill-current" />
                      {filters.minRating.toFixed(1)}+
                      <button 
                        onClick={() => handleFilterChange('minRating', 0)}
                        className="ml-1 text-gray-400 hover:text-gray-600"
                      >
                        &times;
                      </button>
                    </span>
                  )}
                  
                  <button
                    onClick={() => setFilters({ minRating: 0 })}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {t('clearAll')}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
        
        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {loading ? t('searching') : t('resultsCount', { count: totalCouriers })}
          </h2>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          </div>
        )}
        
        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchCouriers}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {t('retry')}
            </button>
          </div>
        )}
        
        {/* No Results */}
        {!loading && !error && couriers.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">{t('noResults')}</h3>
            <p className="text-yellow-700">{t('noResultsMessage')}</p>
            <button
              onClick={() => setFilters({ minRating: 0 })}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {t('clearFilters')}
            </button>
          </div>
        )}
        
        {/* Courier Cards */}
        {!loading && !error && couriers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {couriers.map((courier) => (
              <Link
                key={courier._id}
                href={`/couriers/${courier._id}`}
                className="block group"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden h-full flex flex-col"
                >
                  <div className="p-6">
                    <div className="flex items-start">
                      {/* Profile Image */}
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex-shrink-0 overflow-hidden border-2 border-gray-100 mr-4">
                        {courier.profileImage ? (
                          <img
                            src={courier.profileImage}
                            alt={courier.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-xl font-bold">
                            {courier.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      
                      {/* Courier Info */}
                      <div className="flex-1">
                        <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">
                          {courier.name}
                        </h3>
                        
                        {/* Location */}
                        {(courier.city || courier.country) && (
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>
                              {courier.city && courier.country ? 
                                `${courier.city}, ${courier.country}` : 
                                courier.city || courier.country}
                            </span>
                          </div>
                        )}
                        
                        {/* Transport Type */}
                        {courier.transportType && (
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            <Truck className="w-4 h-4 mr-1" />
                            <span>{courier.transportType}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
                      {/* Rating */}
                      <div>
                        <div className="flex items-center">
                          <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                          <span className="font-medium text-gray-900">
                            {formatRating(courier.rating)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{t('rating')}</p>
                      </div>
                      
                      {/* Completed Deliveries */}
                      <div>
                        <div className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-1" />
                          <span className="font-medium text-gray-900">
                            {courier.completedDeliveries || 0}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{t('completedDeliveries')}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* View Profile Button */}
                  <div className="mt-auto p-4 border-t border-gray-100 bg-gray-50">
                    <span className="text-blue-600 text-sm font-medium flex justify-center items-center">
                      {t('viewProfile')}
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
        
        {/* Pagination */}
        {!loading && !error && totalCouriers > 0 && (
          <div className="flex justify-center mt-8">
            <nav className="inline-flex rounded-md shadow">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('previous')}
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page * 12 >= totalCouriers}
                className="px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('next')}
              </button>
            </nav>
          </div>
        )}
      </main>
      
      <SimpleFooter />
    </div>
  );
}