'use client';

import React from 'react';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';
import { InstantSearch, SearchBox, Hits, Highlight, Configure } from 'react-instantsearch';
import { Search } from 'lucide-react';
import EvilEye from '../components/EvilEye';

// 1. D&D Typography: Cinzel for headers, Crimson Pro for body text
import { Cinzel_Decorative, Crimson_Pro } from 'next/font/google'; 
const cinzel = Cinzel_Decorative({ subsets: ['latin'], weight: ['400', '700', '900'] });
const crimson = Crimson_Pro({ subsets: ['latin'], weight: ['400', '600', '700'] });

const typesenseAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: 'Pedri170',
    nodes: [
      {
        host: 'search.refreshto.me',
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

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

// 2. The Tome Page (Card) Component
const Hit = ({ hit }: any) => {
  const youtubeUrl = `https://youtu.be/${hit.video_id}?t=${hit.start_time}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${hit.video_id}/mqdefault.jpg`;

  return (
    <a 
      href={youtubeUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      // The Double Border Wrapper: Outer Border
      className="block bg-[#05020a] p-1 border border-[#2a1b42] hover:border-[#8b5ddf] transition-colors duration-300 group relative shadow-[0_0_15px_rgba(0,0,0,0.8)]"
    >
      {/* The Inner Border */}
      <div className="border border-[#1a1025] group-hover:border-[#4a2b7a] flex flex-col h-full bg-[#0a0514] transition-colors duration-300">
        
        {/* Scrying Pool Thumbnail */}
        <div className="relative h-40 overflow-hidden bg-[#05020a] border-b border-[#1a1025]">
          {/* Purple overlay to tint the image */}
          <div className="absolute inset-0 bg-[#8b5ddf] mix-blend-overlay opacity-40 group-hover:opacity-20 transition-opacity z-10"></div>
          <img 
            src={thumbnailUrl} 
            alt={hit.title} 
            // Grayscale base that regains color on hover
            className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
          />
          <div className={`absolute bottom-2 right-2 bg-[#05020a] border border-[#8b5ddf]/50 text-[#dcb8ff] px-2 py-0.5 text-xs font-bold shadow-lg z-20 ${cinzel.className}`}>
            {formatTime(hit.start_time)}
          </div>
        </div>
        
        <div className="p-5 flex-1 flex flex-col relative">
          <h3 className={`text-lg font-bold mb-3 text-[#e2d8f4] group-hover:text-white transition-colors ${cinzel.className} tracking-wide`}>
            <span className="line-clamp-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">{hit.title}</span>
          </h3>
          
          {/* <p className="text-[#a89cbd] text-base leading-relaxed mt-auto tracking-normal"> */}
          <p className="text-[#a89cbd] group-hover:text-[#e2d8f4] text-base leading-relaxed mt-auto tracking-normal">
            <Highlight attribute="text" hit={hit} />
          </p>

          {/* <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#8b5ddf] opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#8b5ddf] opacity-0 group-hover:opacity-100 transition-opacity"></div> */}
        </div>
      </div>
    </a>
  );
};

export default function Home() {
  return (
    // Body font applied globally
    <div className={`min-h-screen bg-[#06040a] text-[#e2d8f4] p-6 md:p-12 overflow-x-hidden relative ${crimson.className}`}>
      
      {/* 3. The moving CRT scanline overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.15] mix-blend-overlay"
           style={{
             backgroundImage: 'linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 1) 50%)',
             backgroundSize: '100% 4px',
             animation: 'scanlines 10s linear infinite'
           }}>
      </div>

      {/* Global CSS for animations, highlight, and scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scanlines {
          from { background-position: 0 0; }
          to { background-position: 0 -100px; }
        }

        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #06040a; border-left: 1px solid #1a1025; }
        ::-webkit-scrollbar-thumb { background: #2a1b42; }
        ::-webkit-scrollbar-thumb:hover { background: #4a2b7a; }

        mark.ais-Highlight-highlighted {
          background-color: transparent;
          color: #dcb8ff;
          text-shadow: 0 0 8px rgba(139, 93, 223, 0.6);
          border-bottom: 1px dashed #8b5ddf;
          font-weight: 700;
        }
      `}} />

      <div className="max-w-6xl mx-auto relative z-10">
        
        <div className="text-center mb-10 flex flex-col items-center">
          
          {/* Title with Cinzel font and intense drop shadow */}
          <h1 className={`text-5xl md:text-7xl font-bold relative mt-2 z-20 tracking-wider text-[#e2d8f4] drop-shadow-[0_0_15px_rgba(139,93,223,0.5)] ${cinzel.className}`}>
            Refresh Tome
          </h1>
          
          <div 
            className="relative w-[350px] h-[350px] -my-22 pointer-events-none z-0"
            style={{
              mixBlendMode: 'screen',
              maskImage: 'radial-gradient(circle, black 30%, transparent 65%)',
              WebkitMaskImage: 'radial-gradient(circle, black 30%, transparent 65%)'
            }}
          >
             <EvilEye eyeColor="#8b5ddf" />
          </div>
        </div>

        <InstantSearch indexName="transcripts" searchClient={searchClient}>
          <Configure hitsPerPage={16} />
          
          <div className="mb-16 max-w-2xl mx-auto relative group z-20">
            {/* The Search Bar: Styled like an engraved plaque */}
            <div className="p-1 border border-[#2a1b42] bg-[#05020a] shadow-[0_0_30px_rgba(0,0,0,1)]">
              <div className="relative border border-[#1a1025] bg-[#0a0514]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#927faf] w-5 h-5 z-10" />
                
                <SearchBox 
                  placeholder="Search the volumes..."
                  classNames={{
                    root: 'relative',
                    form: 'relative',
                    input: `w-full p-4 pl-12 bg-transparent text-[#e2d8f4] placeholder-[#927faf] focus:outline-none focus:bg-[#0c071a] transition-colors text-xl ${crimson.className}`,
                    submitIcon: 'hidden',
                    resetIcon: 'hidden',
                    loadingIcon: 'hidden'
                  }}
                />
              </div>
            </div>
          </div>

          <Hits 
            hitComponent={Hit} 
            classNames={{
              // Sharpened the grid gap to look more structured
              list: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 place-items-stretch justify-items-center',
              item: 'list-none flex'
            }}
          />
        </InstantSearch>
      </div>
    </div>
  );
}