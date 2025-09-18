// app/page.js
'use client';

import { useState } from 'react';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import SearchHeroSection from './components/SearchHeroSection';
import TranscriptSearchResult from './components/TranscriptSearchResult';
import WelcomeSection from './components/WelcomeSection';

export default function Home() {
  const PLAYLIST_ID = 'PLHe7gljAh4fP8ZcOGKvzCLm2-vrMI7k0S';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  // Handle transcript search
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setError('Please enter a search term');
      return;
    }
    
    setLoading(true);
    setError('');
    setHasSearched(true);
    
    try {
      // const response = await fetch(`/api/search-transcripts?q=${encodeURIComponent(searchTerm.trim())}`);
      const response = await fetch(`/api/search-transcripts?playlistId=${PLAYLIST_ID}&q=${encodeURIComponent(searchTerm.trim())}`);
      console.log('Raw response:', response);
      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error('Server returned non-JSON response. Check if API route exists.');
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Search was not successful');
      }
      
      setSearchResults(data.results || []);
      setTotalResults(data.totalResults || 0);
      
    } catch (err) {
      setError(err.message || 'Failed to search transcripts');
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setError('');
    setHasSearched(false);
    setTotalResults(0);
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <SearchHeroSection 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        loading={loading}
        handleKeyPress={handleKeyPress}
      />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Error State */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
              <div>
                <p className="text-red-800 font-medium">Search Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {hasSearched && !loading && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {totalResults > 0 ? (
                  <>Search Results for "{searchTerm}" ({totalResults} episode{totalResults !== 1 ? 's' : ''})</>
                ) : (
                  <>No results found for "{searchTerm}"</>
                )}
              </h2>
              
              <button
                onClick={clearSearch}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                New Search
              </button>
            </div>
            
            {totalResults > 0 && (
              <div className="space-y-6">
                {searchResults.map((result) => (
                  <TranscriptSearchResult
                    key={result.id}
                    result={result}
                    playlistId={PLAYLIST_ID}
                  />
                ))}
              </div>
            )}
            
            {totalResults === 0 && !loading && (
              <div className="text-center py-12">
                <Search className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No transcript matches found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try different keywords, check your spelling, or search for broader terms.
                </p>
                <p className="text-gray-500 text-sm">
                  Popular searches: AI, technology, healthcare, ethics, machine learning
                </p>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="animate-spin mx-auto text-blue-600 mb-4" size={48} />
            <p className="text-gray-600 text-lg">Searching through transcripts...</p>
            <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
          </div>
        )}

        {/* Welcome State */}
        {!hasSearched && !loading && <WelcomeSection />}
      </div>
    </div>
  );
}








// // app/page.js
// 'use client';

// import { useState, useEffect } from 'react';
// import { Search, Loader2, AlertCircle, Sparkles, Clock, Play } from 'lucide-react';
// import TranscriptSearchResult from './components/TranscriptSearchResult';

// export default function Home() {
//   const PLAYLIST_ID = 'PLHe7gljAh4fP8ZcOGKvzCLm2-vrMI7k0S';
  
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [hasSearched, setHasSearched] = useState(false);
//   const [totalResults, setTotalResults] = useState(0);

//   // Handle transcript search
//   const handleSearch = async (e) => {
//     e.preventDefault();
    
//     if (!searchTerm.trim()) {
//       setError('Please enter a search term');
//       return;
//     }
    
//     setLoading(true);
//     setError('');
//     setHasSearched(true);
    
//     try {
//       const response = await fetch(`/api/search-transcripts?&q=${encodeURIComponent(searchTerm.trim())}`);
//       // const response = await fetch(`/api/search-transcripts?playlistId=${PLAYLIST_ID}&q=${encodeURIComponent(searchTerm.trim())}`);
//       const data = await response.json();
      
//       if (!response.ok) {
//         throw new Error(data.message || 'Search failed');
//       }
      
//       if (!data.success) {
//         throw new Error(data.message || 'Search was not successful');
//       }
      
//       setSearchResults(data.results);
//       setTotalResults(data.totalResults);
      
//     } catch (err) {
//       setError(err.message || 'Failed to search transcripts');
//       setSearchResults([]);
//       setTotalResults(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Clear search
//   const clearSearch = () => {
//     setSearchTerm('');
//     setSearchResults([]);
//     setError('');
//     setHasSearched(false);
//     setTotalResults(0);
//   };

//   // Handle Enter key
//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleSearch(e);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Hero Section */}
//       <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
//         <div className="max-w-4xl mx-auto px-4 py-16 text-center">
//           <div className="flex items-center justify-center gap-3 mb-4">
//             <Sparkles className="text-yellow-300" size={32} />
//             <h1 className="text-4xl font-bold">Podcast Transcript Search</h1>
//           </div>
//           <p className="text-xl text-blue-100 mb-8">
//             Search through podcast transcripts to find exact moments and quotes
//           </p>
          
//           {/* Main Search Bar */}
//           <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
//             <div className="flex gap-3">
//               <div className="relative flex-1">
//                 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   placeholder="Search for quotes, topics, or specific words..."
//                   className="w-full pl-12 pr-4 py-4 text-lg border-0 rounded-lg focus:ring-4 focus:ring-blue-300 focus:outline-none text-gray-900"
//                   disabled={loading}
//                 />
//               </div>
//               <button
//                 type="submit"
//                 disabled={loading || !searchTerm.trim()}
//                 className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-8 py-4 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
//               >
//                 {loading ? (
//                   <>
//                     <Loader2 className="animate-spin" size={20} />
//                     Searching...
//                   </>
//                 ) : (
//                   <>
//                     <Search size={20} />
//                     Search
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>
          
//           <div className="mt-6 text-blue-100 text-sm">
//             <p>💡 Try searching for: "artificial intelligence", "machine learning", "ethics", or "healthcare"</p>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-6xl mx-auto px-4 py-8">
//         {/* Error State */}
//         {error && (
//           <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4">
//             <div className="flex items-center gap-3">
//               <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
//               <div>
//                 <p className="text-red-800 font-medium">Search Error</p>
//                 <p className="text-red-700 text-sm">{error}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Search Results */}
//         {hasSearched && !loading && (
//           <div className="mb-6">
//             <div className="flex items-center justify-between mb-6">
//               <h2 className="text-2xl font-bold text-gray-900">
//                 {totalResults > 0 ? (
//                   <>Search Results for "{searchTerm}" ({totalResults} episode{totalResults !== 1 ? 's' : ''})</>
//                 ) : (
//                   <>No results found for "{searchTerm}"</>
//                 )}
//               </h2>
              
//               <button
//                 onClick={clearSearch}
//                 className="text-blue-600 hover:text-blue-800 font-medium"
//               >
//                 New Search
//               </button>
//             </div>
            
//             {totalResults > 0 && (
//               <div className="space-y-6">
//                 {searchResults.map((result) => (
//                   <TranscriptSearchResult
//                     key={result.id}
//                     result={result}
//                     playlistId={PLAYLIST_ID}
//                     searchTerm={searchTerm}
//                   />
//                 ))}
//               </div>
//             )}
            
//             {totalResults === 0 && !loading && (
//               <div className="text-center py-12">
//                 <Search className="mx-auto text-gray-400 mb-4" size={48} />
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">
//                   No transcript matches found
//                 </h3>
//                 <p className="text-gray-600 mb-4">
//                   Try different keywords, check your spelling, or search for broader terms.
//                 </p>
//                 <p className="text-gray-500 text-sm">
//                   Popular searches: AI, technology, healthcare, ethics, machine learning
//                 </p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Loading State */}
//         {loading && (
//           <div className="text-center py-12">
//             <Loader2 className="animate-spin mx-auto text-blue-600 mb-4" size={48} />
//             <p className="text-gray-600 text-lg">Searching through transcripts...</p>
//             <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
//           </div>
//         )}

//         {/* Welcome State */}
//         {!hasSearched && !loading && (
//           <div className="text-center py-16">
//             <div className="max-w-3xl mx-auto">
//               <Sparkles className="mx-auto text-blue-600 mb-6" size={64} />
//               <h2 className="text-3xl font-bold text-gray-900 mb-4">
//                 Find Exact Moments in Podcast Episodes
//               </h2>
//               <p className="text-xl text-gray-600 mb-8">
//                 Search through full transcripts to find specific quotes, topics, or discussions.
//                 Jump directly to the exact timestamp in any episode.
//               </p>
              
//               <div className="grid md:grid-cols-3 gap-8 text-left">
//                 <div className="bg-white p-6 rounded-lg shadow-sm">
//                   <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
//                     <Search className="text-blue-600" size={24} />
//                   </div>
//                   <h3 className="font-semibold text-gray-900 mb-2">Precise Search</h3>
//                   <p className="text-gray-600 text-sm">
//                     Find exact quotes and mentions across all episodes with highlighted matches.
//                   </p>
//                 </div>
                
//                 <div className="bg-white p-6 rounded-lg shadow-sm">
//                   <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
//                     <Clock className="text-green-600" size={24} />
//                   </div>
//                   <h3 className="font-semibold text-gray-900 mb-2">Timestamped Results</h3>
//                   <p className="text-gray-600 text-sm">
//                     Every result shows the exact timestamp when the topic was discussed.
//                   </p>
//                 </div>
                
//                 <div className="bg-white p-6 rounded-lg shadow-sm">
//                   <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
//                     <Play className="text-purple-600" size={24} />
//                   </div>
//                   <h3 className="font-semibold text-gray-900 mb-2">Direct Jump</h3>
//                   <p className="text-gray-600 text-sm">
//                     Click any result to jump directly to that moment in the YouTube video.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
        
//         {/* Demo Notice */}
//         <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
//           <h3 className="font-semibold text-blue-900 mb-2">🚀 Demo Implementation</h3>
//           <p className="text-blue-800 text-sm mb-3">
//             This is a demonstration of transcript search functionality using mock data. 
//             To enable full transcript search with your actual playlist:
//           </p>
//           <ul className="text-blue-800 text-sm space-y-1 ml-4">
//             <li>• Install <code className="bg-blue-100 px-1 rounded">youtube-transcript-api</code> for transcript extraction</li>
//             <li>• Set up a database to store and index transcripts</li>
//             <li>• Implement full-text search capabilities</li>
//             <li>• Process all videos in your playlist to build the search index</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }