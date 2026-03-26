'use client';

import React from 'react';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';
import { InstantSearch, SearchBox, Hits, Highlight, Configure } from 'react-instantsearch';
import { ExternalLink } from 'lucide-react';

// Configure the Typesense Adapter
const typesenseAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: 'Pedri170', // Match your docker-compose API key
    nodes: [
      {
        host: 'refreshto.me', 
        port: 443,
        protocol: 'https',
      },
    ],
  },
  additionalSearchParameters: {
    query_by: 'text,title',
    num_typos: 1,
  },
});
const searchClient = typesenseAdapter.searchClient;

// Formatting seconds to MM:SS
const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

// Custom component to render each search result card
const Hit = ({ hit }: any) => {
  const youtubeUrl = `https://youtu.be/${hit.video_id}?t=${hit.start_time}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${hit.video_id}/mqdefault.jpg`;

  return (
    <a 
      href={youtubeUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex flex-col bg-[#222] border border-gray-800 rounded-xl overflow-hidden hover:bg-[#2a2a2a] transition group"
    >
      <div className="relative h-40 overflow-hidden bg-black">
        <img 
          src={thumbnailUrl} 
          alt={hit.title} 
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 text-xs font-mono rounded">
          {formatTime(hit.start_time)}
        </div>
      </div>
      
      <div className="p-4 flex-1">
        <h3 className="text-sm font-semibold mb-2 flex justify-between items-start gap-2 text-white">
          <span className="line-clamp-2">{hit.title}</span>
          <ExternalLink className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
        </h3>
        <p className="text-gray-400 text-sm">
          {/* React InstantSearch handles the <mark> highlighting automatically */}
          <Highlight attribute="text" hit={hit} classNames={{ highlighted: 'bg-yellow-200 text-black px-1 rounded' }} />
        </p>
      </div>
    </a>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#111] text-white p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold mb-4">Refresh Tome</h1>
          <p className="text-gray-400 text-sm">Search through Youtube transcripts</p>
        </div>

        <InstantSearch indexName="transcripts" searchClient={searchClient}>
          {/* Default config for the search (e.g., 12 results per page) */}
          <Configure hitsPerPage={12} />
          
          <div className="mb-8 max-w-2xl mx-auto">
            <SearchBox 
              placeholder="Search the transcripts..."
              classNames={{
                root: 'relative',
                input: 'w-full p-4 pl-12 bg-[#222] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white transition',
                submitIcon: 'hidden',
                resetIcon: 'hidden'
              }}
            />
          </div>

          <Hits 
            hitComponent={Hit} 
            classNames={{
              list: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
              item: 'list-none'
            }}
          />
        </InstantSearch>
      </div>
    </div>
  );
}