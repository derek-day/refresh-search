// app/components/SearchHeroSection.js
'use client';

import { Search, Loader2, Sparkles } from 'lucide-react';

export default function SearchHeroSection({ 
  searchTerm, 
  setSearchTerm, 
  handleSearch, 
  loading, 
  handleKeyPress 
}) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="text-yellow-300" size={32} />
          <h1 className="text-4xl font-bold">Podcast Transcript Search</h1>
        </div>
        <p className="text-xl text-blue-100 mb-8">
          Search through podcast transcripts to find exact moments and quotes
        </p>
        
        {/* Main Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for quotes, topics, or specific words..."
                className="w-full pl-12 pr-4 py-4 text-lg border-0 rounded-lg focus:ring-4 focus:ring-blue-300 focus:outline-none text-gray-900"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchTerm.trim()}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-4 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Searching...
                </>
              ) : (
                <>
                  <Search size={20} />
                  Search
                </>
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-blue-100 text-sm">
          <p>💡 Try searching for: "artificial intelligence", "machine learning", "ethics", or "healthcare"</p>
        </div>
      </div>
    </div>
  );
}