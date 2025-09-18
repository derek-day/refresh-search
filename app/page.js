// app/page.js
'use client';

import { useState, useEffect } from 'react';
import { Search, Loader2, AlertCircle, Sparkles, Clock, Play } from 'lucide-react';
import TranscriptSearchResult from './components/TranscriptSearchResult';

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
      const response = await fetch(`/api/search-transcripts?&q=${encodeURIComponent(searchTerm.trim())}`);
      // const response = await fetch(`/api/search-transcripts?playlistId=${PLAYLIST_ID}&q=${encodeURIComponent(searchTerm.trim())}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Search failed');
      }
      
      if (!data.success) {
        throw new Error(data.message || 'Search was not successful');
      }
      
      setSearchResults(data.results);
      setTotalResults(data.totalResults);
      
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
                    searchTerm={searchTerm}
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
        {!hasSearched && !loading && (
          <div className="text-center py-16">
            <div className="max-w-3xl mx-auto">
              <Sparkles className="mx-auto text-blue-600 mb-6" size={64} />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Find Exact Moments in Podcast Episodes
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Search through full transcripts to find specific quotes, topics, or discussions.
                Jump directly to the exact timestamp in any episode.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 text-left">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Search className="text-blue-600" size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Precise Search</h3>
                  <p className="text-gray-600 text-sm">
                    Find exact quotes and mentions across all episodes with highlighted matches.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Clock className="text-green-600" size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Timestamped Results</h3>
                  <p className="text-gray-600 text-sm">
                    Every result shows the exact timestamp when the topic was discussed.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Play className="text-purple-600" size={24} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Direct Jump</h3>
                  <p className="text-gray-600 text-sm">
                    Click any result to jump directly to that moment in the YouTube video.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Demo Notice */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">🚀 Demo Implementation</h3>
          <p className="text-blue-800 text-sm mb-3">
            This is a demonstration of transcript search functionality using mock data. 
            To enable full transcript search with your actual playlist:
          </p>
          <ul className="text-blue-800 text-sm space-y-1 ml-4">
            <li>• Install <code className="bg-blue-100 px-1 rounded">youtube-transcript-api</code> for transcript extraction</li>
            <li>• Set up a database to store and index transcripts</li>
            <li>• Implement full-text search capabilities</li>
            <li>• Process all videos in your playlist to build the search index</li>
          </ul>
        </div>
      </div>
    </div>
  );
}














// // app/page.js
// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { Search, Clock, Calendar, Play, ChevronDown, Loader2 } from 'lucide-react';

// export default function Home() {
//   const PLAYLIST_ID = 'PLHe7gljAh4fP8ZcOGKvzCLm2-vrMI7k0S';
  
//   const [videos, setVideos] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [transcriptSearch, setTranscriptSearch] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [filteredVideos, setFilteredVideos] = useState([]);
//   const [nextPageToken, setNextPageToken] = useState('');
//   const [hasSearched, setHasSearched] = useState(false);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [totalResults, setTotalResults] = useState(0);

//   // Parse YouTube duration format (PT1H23M45S)
//   const parseDuration = (duration) => {
//     const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
//     if (!match) return '0:00';
    
//     const hours = parseInt(match[1] || 0);
//     const minutes = parseInt(match[2] || 0);
//     const seconds = parseInt(match[3] || 0);
    
//     if (hours > 0) {
//       return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
//     }
//     return `${minutes}:${seconds.toString().padStart(2, '0')}`;
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   // Fetch playlist videos with pagination
//   const fetchPlaylistVideos = useCallback(async (pageToken = '', append = false) => {
//     try {
//       if (!append) {
//         setLoading(true);
//         setError('');
//       } else {
//         setLoadingMore(true);
//       }
      
//       const response = await fetch(`/api/playlist?playlistId=${PLAYLIST_ID}&pageToken=${pageToken}&maxResults=20`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
      
//       if (data.error) {
//         throw new Error(data.message || 'Failed to fetch playlist');
//       }

//       if (append) {
//         setVideos(prev => [...prev, ...data.videos]);
//       } else {
//         setVideos(data.videos);
//         setTotalResults(data.totalResults);
//       }
      
//       setNextPageToken(data.nextPageToken || '');
      
//     } catch (err) {
//       const errorMessage = err.message || 'Failed to fetch playlist';
//       setError(errorMessage);
//       console.error('Error fetching playlist:', err);
//     } finally {
//       setLoading(false);
//       setLoadingMore(false);
//     }
//   }, []);

//   // Load more videos
//   const loadMoreVideos = () => {
//     if (nextPageToken && !loadingMore) {
//       fetchPlaylistVideos(nextPageToken, true);
//     }
//   };

//   // Handle transcript search
//   const handleTranscriptSearch = async (e) => {
//     e.preventDefault();
//     if (!transcriptSearch.trim()) return;
    
//     setHasSearched(true);
//     setLoading(true);
//     setError('');
    
//     try {
//       // For demo purposes, we'll simulate transcript search
//       // In a real implementation, you'd need to:
//       // 1. Get transcripts for all videos (using a service like youtube-transcript-api)
//       // 2. Search through them
//       // 3. Return matching videos with timestamp information
      
//       await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
//       // Mock results - in reality, this would search actual transcripts
//       const mockResults = videos.filter(video => 
//         video.snippet.title.toLowerCase().includes(transcriptSearch.toLowerCase()) ||
//         video.snippet.description.toLowerCase().includes(transcriptSearch.toLowerCase())
//       ).slice(0, 5); // Limit results for demo
      
//       setFilteredVideos(mockResults);
//       setError('Note: This is a demo search through titles/descriptions. Full transcript search requires additional setup with transcript extraction services.');
      
//     } catch (err) {
//       setError('Failed to search transcripts: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter videos based on title/description search
//   useEffect(() => {
//     if (!searchTerm && !hasSearched) {
//       setFilteredVideos([]);
//     } else if (searchTerm && !hasSearched) {
//       const filtered = videos.filter(video =>
//         video.snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         video.snippet.description.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredVideos(filtered);
//     }
//   }, [searchTerm, videos, hasSearched]);

//   // Load initial videos when component mounts
//   useEffect(() => {
//     fetchPlaylistVideos();
//   }, [fetchPlaylistVideos]);

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-6xl mx-auto">
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2">
//             Podcast Transcript Search
//           </h1>
//           <p className="text-gray-600">
//             Search through podcast transcripts and episodes
//           </p>
//         </div>

//         {/* Transcript Search */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//           <form onSubmit={handleTranscriptSearch} className="space-y-4">
//             <div>
//               <label htmlFor="transcript-search" className="block text-sm font-medium text-gray-700 mb-2">
//                 Search Transcripts
//               </label>
//               <div className="flex gap-2">
//                 <div className="relative flex-1">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                   <input
//                     id="transcript-search"
//                     type="text"
//                     value={transcriptSearch}
//                     onChange={(e) => setTranscriptSearch(e.target.value)}
//                     placeholder="Search for specific topics, quotes, or keywords in transcripts..."
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                 </div>
//                 <button
//                   type="submit"
//                   disabled={loading || !transcriptSearch.trim()}
//                   className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                 >
//                   {loading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
//                   Search
//                 </button>
//               </div>
//             </div>
//           </form>
          
//           <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
//             <p className="text-blue-800 text-sm">
//               <strong>Note:</strong> Full transcript search requires additional setup. Currently searching through video titles and descriptions as a demo.
//               To enable full transcript search, you would need to integrate with transcript extraction services.
//             </p>
//           </div>
//         </div>

//         {/* Regular Search Bar */}
//         {!hasSearched && videos.length > 0 && (
//           <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="Search episodes by title or description..."
//                 className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//             {searchTerm && (
//               <p className="mt-2 text-sm text-gray-600">
//                 Found {filteredVideos.length} episodes matching "{searchTerm}"
//               </p>
//             )}
//           </div>
//         )}

//         {/* Error State */}
//         {error && (
//           <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//             <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
//               <p className="text-yellow-800">{error}</p>
//             </div>
//           </div>
//         )}

//         {/* Results */}
//         {(filteredVideos.length > 0 || (videos.length > 0 && !hasSearched && !searchTerm)) && (
//           <div className="space-y-4">
//             <div className="flex justify-between items-center">
//               <h2 className="text-2xl font-bold text-gray-900">
//                 {hasSearched ? 'Search Results' : 'Episodes'} 
//                 ({hasSearched ? filteredVideos.length : searchTerm ? filteredVideos.length : videos.length}
//                 {totalResults > 0 && !hasSearched && !searchTerm && ` of ${totalResults}`})
//               </h2>
              
//               {hasSearched && (
//                 <button
//                   onClick={() => {
//                     setHasSearched(false);
//                     setTranscriptSearch('');
//                     setSearchTerm('');
//                     setError('');
//                   }}
//                   className="text-blue-600 hover:text-blue-800"
//                 >
//                   Clear Search
//                 </button>
//               )}
//             </div>
            
//             {(hasSearched ? filteredVideos : (searchTerm ? filteredVideos : videos)).map((video) => (
//               <div key={video.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
//                 <div className="flex gap-4">
//                   {/* Thumbnail */}
//                   <div className="flex-shrink-0">
//                     <img
//                       src={video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url}
//                       alt={video.snippet.title}
//                       className="w-32 h-24 object-cover rounded-md"
//                     />
//                   </div>
                  
//                   {/* Content */}
//                   <div className="flex-1 min-w-0">
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
//                       {video.snippet.title}
//                     </h3>
                    
//                     <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
//                       {video.duration && (
//                         <div className="flex items-center gap-1">
//                           <Clock size={16} />
//                           {parseDuration(video.duration)}
//                         </div>
//                       )}
//                       <div className="flex items-center gap-1">
//                         <Calendar size={16} />
//                         {formatDate(video.snippet.publishedAt)}
//                       </div>
//                     </div>
                    
//                     {video.snippet.description && (
//                       <p className="text-gray-700 text-sm line-clamp-3 mb-3">
//                         {video.snippet.description.substring(0, 200)}...
//                       </p>
//                     )}
                    
//                     <div className="flex items-center gap-3">
//                       <a
//                         href={`https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}&list=${PLAYLIST_ID}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
//                       >
//                         <Play size={16} />
//                         Watch Episode
//                       </a>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
            
//             {/* Load More Button */}
//             {!hasSearched && !searchTerm && nextPageToken && (
//               <div className="text-center py-6">
//                 <button
//                   onClick={loadMoreVideos}
//                   disabled={loadingMore}
//                   className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
//                 >
//                   {loadingMore ? (
//                     <>
//                       <Loader2 className="animate-spin" size={16} />
//                       Loading...
//                     </>
//                   ) : (
//                     <>
//                       <ChevronDown size={16} />
//                       Load More Episodes
//                     </>
//                   )}
//                 </button>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Loading State */}
//         {loading && videos.length === 0 && (
//           <div className="text-center py-12">
//             <Loader2 className="animate-spin mx-auto text-blue-600 mb-4" size={48} />
//             <p className="text-gray-600">Loading episodes...</p>
//           </div>
//         )}

//         {/* Empty States */}
//         {!loading && videos.length === 0 && !error && (
//           <div className="text-center py-12">
//             <Search className="mx-auto text-gray-400 mb-4" size={48} />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//               No episodes found
//             </h3>
//             <p className="text-gray-600">
//               Unable to load the podcast episodes
//             </p>
//           </div>
//         )}
        
//         {hasSearched && filteredVideos.length === 0 && !loading && (
//           <div className="text-center py-12">
//             <Search className="mx-auto text-gray-400 mb-4" size={48} />
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//               No results found
//             </h3>
//             <p className="text-gray-600">
//               Try different keywords or check your spelling
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }