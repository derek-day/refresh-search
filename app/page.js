// app/page.js
'use client';

import { useState, useEffect } from 'react';
import { Search, Clock, Calendar, Play } from 'lucide-react';

export default function Home() {
  const PLAYLIST_ID = 'PLHe7gljAh4fP8ZcOGKvzCLm2-vrMI7k0S';
  
  const [videos, setVideos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filteredVideos, setFilteredVideos] = useState([]);

  // Fetch playlist videos via our API route
  const fetchPlaylistVideos = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Call our own API route instead of YouTube directly
      const response = await fetch(`/api/playlist?playlistId=${PLAYLIST_ID}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.message || 'Failed to fetch playlist');
      }

      setVideos(data.videos);
      setFilteredVideos(data.videos);
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch playlist';
      setError(errorMessage);
      console.error('Error fetching playlist:', err);
    } finally {
      setLoading(false);
    }
  };

  // Parse YouTube duration format (PT1H23M45S)
  const parseDuration = (duration) => {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return '0:00';
    
    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Load playlist on component mount
  useEffect(() => {
    fetchPlaylistVideos();
  }, []);

  // Filter videos based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredVideos(videos);
    } else {
      const filtered = videos.filter(video =>
        video.snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.snippet.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredVideos(filtered);
    }
  }, [searchTerm, videos]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Podcast Search
          </h1>
          <p className="text-gray-600">
            Search through podcast episodes
          </p>
        </div>

        {/* Search Bar */}
        {!loading && !error && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search episodes by title or description..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {searchTerm && videos.length > 0 && (
              <p className="mt-2 text-sm text-gray-600">
                Found {filteredVideos.length} of {videos.length} episodes
              </p>
            )}
          </div>
        )}

        {/* Results */}
        {filteredVideos.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Episodes ({filteredVideos.length})
            </h2>
            
            {filteredVideos.map((video, index) => (
              <div key={video.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0">
                    <img
                      src={video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url}
                      alt={video.snippet.title}
                      className="w-32 h-24 object-cover rounded-md"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {video.snippet.title}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        {parseDuration(video.duration)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        {formatDate(video.snippet.publishedAt)}
                      </div>
                    </div>
                    
                    {video.snippet.description && (
                      <p className="text-gray-700 text-sm line-clamp-3 mb-3">
                        {video.snippet.description.substring(0, 200)}...
                      </p>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <a
                        href={`https://www.youtube.com/watch?v=${video.snippet.resourceId.videoId}&list=${PLAYLIST_ID}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                      >
                        <Play size={16} />
                        Watch Episode
                      </a>
                      
                      <span className="text-sm text-gray-500">
                        Episode {videos.length - videos.findIndex(v => v.id === video.id)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && videos.length === 0 && !error && (
          <div className="text-center py-12">
            <Search className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No episodes found
            </h3>
            <p className="text-gray-600">
              Unable to load the podcast episodes
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading episodes...</p>
          </div>
        )}
      </div>
    </div>
  );
}
