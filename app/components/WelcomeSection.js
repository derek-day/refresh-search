// app/components/WelcomeSection.js
'use client';

import { Search, Clock, Play, Sparkles } from 'lucide-react';

export default function WelcomeSection() {
  return (
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
  );
}