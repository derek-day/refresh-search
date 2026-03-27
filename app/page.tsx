'use client';

import React from 'react';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';
import { InstantSearch, SearchBox, Hits, Highlight, Configure } from 'react-instantsearch';
import { ExternalLink, Search } from 'lucide-react';
import EvilEye from '../components/EvilEye';

// Import a sleek, modern Google Font perfectly suited for tech/podcast sites
import { Balthazar } from 'next/font/google'; 
const balthazar = Balthazar({ subsets: ['latin'], display: 'swap', weight: '400' });

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

// Styled Video Card Component
const Hit = ({ hit }: any) => {
  const youtubeUrl = `https://youtu.be/${hit.video_id}?t=${hit.start_time}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${hit.video_id}/mqdefault.jpg`;

  return (
    <a 
      href={youtubeUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      // Deep purple background, border, and a glowing shadow on hover
      className="flex flex-col bg-[#130d1d] border border-[#2a1b42] rounded-xl overflow-hidden hover:border-[#8b5ddf] hover:shadow-[0_0_20px_rgba(139,93,223,0.2)] transition-all duration-300 group"
    >
      <div className="relative h-40 overflow-hidden bg-black">
        <img 
          src={thumbnailUrl} 
          alt={hit.title} 
          // Image subtly zooms in on hover
          className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition duration-500 group-hover:scale-105"
        />
        {/* Timestamp tag changed to theme purple */}
        <div className="absolute bottom-2 right-2 bg-[#8b5ddf] text-white px-2 py-1 text-xs font-bold rounded shadow-lg">
          {formatTime(hit.start_time)}
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-sm font-bold mb-3 flex justify-between items-start gap-2 text-[#e2d8f4] group-hover:text-white transition-colors">
          <span className="line-clamp-2">{hit.title}</span>
          {/* External link icon appears only on hover */}
          <ExternalLink className="w-4 h-4 text-[#8b5ddf] shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </h3>
        {/* Snippet text given a soft lavender-gray color */}
        <p className="text-[#a89cbd] text-sm leading-relaxed mt-auto">
          <Highlight attribute="text" hit={hit} />
        </p>
      </div>
    </a>
  );
};

export default function Home() {
  return (
    // Applied the font and a very dark purple-black background to the whole page
    <div className={`min-h-screen bg-[#0a0710] text-[#e2d8f4] p-6 md:p-12 overflow-x-hidden ${balthazar.className}`}>
      
      {/* Custom CSS for Scrollbar and Highlighting */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Custom Purple Scrollbar */
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: #0a0710; }
        ::-webkit-scrollbar-thumb { background: #2a1b42; border-radius: 5px; }
        ::-webkit-scrollbar-thumb:hover { background: #8b5ddf; }

        /* Typesense/Algolia Highlight Styling */
        mark.ais-Highlight-highlighted {
          background-color: rgba(139, 93, 223, 0.25);
          color: #dcb8ff;
          border-bottom: 2px solid #8b5ddf;
          padding: 0 3px;
          border-radius: 3px;
          font-weight: 600;
        }
      `}} />

      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-10 flex flex-col items-center">
          {/* Title styled with a soft gradient */}
          <h1 className="text-5xl md:text-7xl font-extrabold relative z-20 tracking-tight bg-clip-text bg-gradient-to-b from-white to-[#a89cbd]">
            Refresh Tome
          </h1>
          
          {/* The Blended Eye Wrapper */}
          <div 
            className="relative w-80 h-80 -my-16 pointer-events-none z-0"
            style={{
              maskImage: 'radial-gradient(circle, black 40%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(circle, black 40%, transparent 70%)'
            }}
          >
             <EvilEye eyeColor="#8b5ddf" />
          </div>

          {/* <p className="text-[#8b5ddf] text-sm relative z-20 uppercase tracking-widest font-semibold mt-4">
            Powered by Typesense
          </p> */}
        </div>

        <InstantSearch indexName="transcripts" searchClient={searchClient}>
          <Configure hitsPerPage={16} />
          
          <div className="mb-12 max-w-2xl mx-auto relative group z-20">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b5ddf] w-5 h-5 z-10 opacity-70 group-focus-within:opacity-100 transition-opacity" />
            
            {/* Styled Search Box */}
            <SearchBox 
              placeholder="Search the volumes..."
              classNames={{
                root: 'relative',
                form: 'relative',
                // Added glowing focus rings, dark purple background, and placeholder styling
                input: 'w-full p-4 pl-12 bg-[#130d1d] border border-[#2a1b42] rounded-xl text-white placeholder-[#fff]/50 focus:outline-none focus:border-[#8b5ddf] focus:ring-1 focus:ring-[#8b5ddf] transition-all shadow-[0_0_15px_rgba(139,93,223,0.05)] focus:shadow-[0_0_20px_rgba(139,93,223,0.15)] text-lg',
                submitIcon: 'hidden',
                resetIcon: 'hidden',
                loadingIcon: 'hidden'
              }}
            />
          </div>

          <Hits 
            hitComponent={Hit} 
            classNames={{
              list: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 place-items-center',
              item: 'list-none flex'
            }}
          />
        </InstantSearch>
      </div>
    </div>
  );
}


// 'use client';

// import React, { useState } from 'react';
// import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';
// import {
//   InstantSearch,
//   SearchBox,
//   Hits,
//   Highlight,
//   Configure,
//   Stats,
//   SortBy,
//   Pagination,
//   useInstantSearch,
// } from 'react-instantsearch';
// import { ExternalLink, Scroll, Clock, Flame, BookOpen, Swords } from 'lucide-react';
// import EvilEye from '../components/EvilEye';
// import { Cinzel, IM_Fell_English } from 'next/font/google';

// // ── Typography ──────────────────────────────────────────────
// // Cinzel: carved-stone display, used for headings
// // IM Fell English: authentic old-book italic body text
// const cinzel = Cinzel({ subsets: ['latin'], display: 'swap', weight: ['400', '700', '900'] });
// const imFell = IM_Fell_English({ subsets: ['latin'], display: 'swap', weight: '400', style: ['normal', 'italic'] });

// // ── Typesense ───────────────────────────────────────────────
// const typesenseAdapter = new TypesenseInstantSearchAdapter({
//   server: {
//     apiKey: 'Pedri170',
//     nodes: [{ host: 'search.refreshto.me', port: 443, protocol: 'https' }],
//   },
//   additionalSearchParameters: {
//     query_by: 'text,title',
//     num_typos: 1,
//   },
// });
// const searchClient = typesenseAdapter.searchClient;

// // ── Helpers ─────────────────────────────────────────────────
// const formatTime = (seconds: number) => {
//   const h = Math.floor(seconds / 3600);
//   const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
//   const s = (seconds % 60).toString().padStart(2, '0');
//   return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
// };

// // Decorative rune divider SVG
// const RuneDivider = () => (
//   <svg viewBox="0 0 400 20" className="w-full max-w-xs mx-auto opacity-40" fill="none">
//     <line x1="0" y1="10" x2="155" y2="10" stroke="#c9a84c" strokeWidth="1" />
//     <polygon points="180,2 200,10 180,18 160,10" stroke="#c9a84c" strokeWidth="1" fill="none" />
//     <text x="193" y="14" fontSize="10" fill="#c9a84c" textAnchor="middle" fontFamily="serif">✦</text>
//     <line x1="245" y1="10" x2="400" y2="10" stroke="#c9a84c" strokeWidth="1" />
//   </svg>
// );

// // Corner ornament (top-left, rotated for each corner)
// const CornerOrn = ({ rot = 0 }: { rot?: number }) => (
//   <svg
//     width="36" height="36" viewBox="0 0 36 36"
//     style={{ transform: `rotate(${rot}deg)`, opacity: 0.55 }}
//     className="absolute"
//   >
//     <path d="M2 2 L14 2 L2 14 Z" stroke="#c9a84c" strokeWidth="1.2" fill="none"/>
//     <path d="M2 2 L2 22" stroke="#c9a84c" strokeWidth="0.8" strokeDasharray="2,3"/>
//     <path d="M2 2 L22 2" stroke="#c9a84c" strokeWidth="0.8" strokeDasharray="2,3"/>
//     <circle cx="2" cy="2" r="2" fill="#c9a84c" opacity="0.7"/>
//   </svg>
// );

// // ── Hit Card ─────────────────────────────────────────────────
// const Hit = ({ hit }: any) => {
//   const youtubeUrl = `https://youtu.be/${hit.video_id}?t=${hit.start_time}`;
//   const thumbnailUrl = `https://img.youtube.com/vi/${hit.video_id}/mqdefault.jpg`;

//   return (
//     <a
//       href={youtubeUrl}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="hit-card group relative flex flex-col overflow-hidden"
//       style={{ borderRadius: '2px' }}
//     >
//       {/* Corner ornaments */}
//       <CornerOrn rot={0} />
//       <span style={{ top: 0, right: 0, position: 'absolute' }}><CornerOrn rot={90} /></span>
//       <span style={{ bottom: 0, left: 0, position: 'absolute' }}><CornerOrn rot={270} /></span>
//       <span style={{ bottom: 0, right: 0, position: 'absolute' }}><CornerOrn rot={180} /></span>

//       {/* Thumbnail */}
//       <div className="relative overflow-hidden" style={{ height: '148px' }}>
//         <img
//           src={thumbnailUrl}
//           alt={hit.title}
//           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
//           style={{ filter: 'sepia(0.25) brightness(0.8) contrast(1.05)' }}
//         />
//         {/* Parchment vignette overlay */}
//         <div className="absolute inset-0" style={{
//           background: 'linear-gradient(to bottom, rgba(10,7,3,0.15) 0%, rgba(10,7,3,0.55) 100%)'
//         }} />
//         {/* Timestamp */}
//         <div className="timestamp-badge absolute bottom-2 right-3 flex items-center gap-1 px-2 py-0.5 text-xs">
//           <Clock className="w-3 h-3" />
//           <span className={cinzel.className} style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
//             {formatTime(hit.start_time)}
//           </span>
//         </div>
//       </div>

//       {/* Body */}
//       <div className="card-body flex-1 flex flex-col p-4 pt-3 gap-2">
//         <h3 className={`${cinzel.className} text-sm font-bold leading-snug flex justify-between items-start gap-2`}
//           style={{ color: '#e8d5a3', letterSpacing: '0.03em' }}>
//           <span className="line-clamp-2">{hit.title}</span>
//           <ExternalLink className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-0 group-hover:opacity-70 transition-opacity" style={{ color: '#c9a84c' }} />
//         </h3>

//         <div className="mt-auto pt-2" style={{ borderTop: '1px solid rgba(201,168,76,0.15)' }}>
//           <p className={`${imFell.className} italic leading-relaxed`}
//             style={{ color: '#b09c79', fontSize: '13px' }}>
//             <Highlight attribute="text" hit={hit} />
//           </p>
//         </div>
//       </div>
//     </a>
//   );
// };

// // ── Empty / Loading states ───────────────────────────────────
// function SearchStatus() {
//   const { status, results } = useInstantSearch();
//   if (status === 'loading') {
//     return (
//       <div className={`${imFell.className} italic text-center py-16 opacity-50`}
//         style={{ color: '#b09c79', fontSize: '17px' }}>
//         The Tome consults the stars…
//       </div>
//     );
//   }
//   if (results?.nbHits === 0) {
//     return (
//       <div className="text-center py-16 flex flex-col items-center gap-3">
//         <Swords className="w-10 h-10 opacity-20" style={{ color: '#c9a84c' }} />
//         <p className={`${imFell.className} italic opacity-50`}
//           style={{ color: '#b09c79', fontSize: '17px' }}>
//           No scrolls found. Try another incantation.
//         </p>
//       </div>
//     );
//   }
//   return null;
// }

// // ── Page ─────────────────────────────────────────────────────
// export default function Home() {
//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

//   return (
//     <div className={`min-h-screen p-6 md:p-10 overflow-x-hidden ${imFell.className}`}
//       style={{ background: '#0d0b08', color: '#d6c4a0' }}>

//       {/* ── Global Styles ─────────────────────────────────── */}
//       <style dangerouslySetInnerHTML={{ __html: `
//         /* Parchment-grain background texture */
//         body {
//           background-image:
//             radial-gradient(ellipse 120% 80% at 50% 0%, rgba(80,45,10,0.18) 0%, transparent 60%),
//             url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
//         }

//         /* Scrollbar */
//         ::-webkit-scrollbar { width: 8px; }
//         ::-webkit-scrollbar-track { background: #0d0b08; }
//         ::-webkit-scrollbar-thumb { background: #3a2c1a; border-radius: 2px; }
//         ::-webkit-scrollbar-thumb:hover { background: #c9a84c; }

//         /* Search highlight */
//         mark.ais-Highlight-highlighted {
//           background: rgba(201,168,76,0.22);
//           color: #f0d78a;
//           border-bottom: 1px solid rgba(201,168,76,0.6);
//           padding: 0 2px;
//           font-style: normal;
//           border-radius: 1px;
//           font-weight: 700;
//         }

//         /* Search box */
//         .tome-search input {
//           width: 100%;
//           padding: 14px 20px 14px 48px;
//           background: rgba(20,15,8,0.85);
//           border: 1px solid rgba(201,168,76,0.35);
//           border-radius: 2px;
//           color: #e8d5a3;
//           font-size: 16px;
//           font-family: inherit;
//           font-style: italic;
//           letter-spacing: 0.02em;
//           outline: none;
//           transition: border-color 0.3s, box-shadow 0.3s;
//           box-shadow: inset 0 1px 4px rgba(0,0,0,0.5), 0 0 0 0 transparent;
//         }
//         .tome-search input::placeholder { color: rgba(176,156,121,0.45); }
//         .tome-search input:focus {
//           border-color: rgba(201,168,76,0.7);
//           box-shadow: inset 0 1px 4px rgba(0,0,0,0.5), 0 0 16px rgba(201,168,76,0.1);
//         }
//         .tome-search button[type="submit"],
//         .tome-search button[type="reset"] { display: none; }

//         /* Hit card */
//         .hit-card {
//           background: linear-gradient(160deg, #191209 0%, #120d06 100%);
//           border: 1px solid rgba(201,168,76,0.22);
//           transition: border-color 0.3s, box-shadow 0.3s, transform 0.25s;
//         }
//         .hit-card:hover {
//           border-color: rgba(201,168,76,0.55);
//           box-shadow: 0 4px 24px rgba(0,0,0,0.55), 0 0 12px rgba(201,168,76,0.08);
//           transform: translateY(-2px);
//         }
//         .card-body { background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.18) 100%); }

//         /* Timestamp badge */
//         .timestamp-badge {
//           background: rgba(12,8,3,0.85);
//           border: 1px solid rgba(201,168,76,0.4);
//           color: #c9a84c;
//           letter-spacing: 0.04em;
//         }

//         /* Pagination */
//         .ais-Pagination-list { display: flex; gap: 6px; justify-content: center; list-style: none; padding: 0; }
//         .ais-Pagination-item a,
//         .ais-Pagination-item span {
//           display: block;
//           padding: 6px 13px;
//           border: 1px solid rgba(201,168,76,0.25);
//           color: #b09c79;
//           font-size: 13px;
//           letter-spacing: 0.05em;
//           transition: all 0.2s;
//           cursor: pointer;
//           text-decoration: none;
//           background: rgba(20,15,8,0.7);
//         }
//         .ais-Pagination-item--selected a { border-color: #c9a84c; color: #f0d78a; background: rgba(201,168,76,0.1); }
//         .ais-Pagination-item a:hover { border-color: rgba(201,168,76,0.55); color: #e8d5a3; }
//         .ais-Pagination-item--disabled { opacity: 0.3; pointer-events: none; }

//         /* Stats */
//         .ais-Stats-text { font-style: italic; color: #7a6a4e; font-size: 13px; }

//         /* List view */
//         .list-hit-card {
//           display: flex;
//           gap: 14px;
//           background: linear-gradient(90deg, #191209, #120d06);
//           border: 1px solid rgba(201,168,76,0.18);
//           padding: 12px;
//           transition: border-color 0.3s;
//           border-radius: 2px;
//         }
//         .list-hit-card:hover { border-color: rgba(201,168,76,0.5); }
//       `}} />

//       <div className="max-w-6xl mx-auto">

//         {/* ── Hero ────────────────────────────────────────── */}
//         <header className="text-center mb-10 flex flex-col items-center relative">

//           {/* Ambient glow behind eye */}
//           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 pointer-events-none"
//             style={{ background: 'radial-gradient(ellipse, rgba(100,55,10,0.15) 0%, transparent 70%)' }} />

//           <div className={`${cinzel.className} relative z-10 flex flex-col items-center`}>
//             <p className="uppercase tracking-[0.35em] text-xs mb-3" style={{ color: '#7a6a4e' }}>
//               ✦ &nbsp; A Seeker's Archive &nbsp; ✦
//             </p>
//             <h1 className="font-black leading-none" style={{
//               fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
//               letterSpacing: '0.08em',
//               color: '#e8d5a3',
//               textShadow: '0 2px 30px rgba(201,168,76,0.2), 0 0 60px rgba(201,168,76,0.08)',
//             }}>
//               Refresh Tome
//             </h1>
//           </div>

//           {/* Eye — blended */}
//           <div
//             className="relative w-72 h-72 -my-12 pointer-events-none z-0"
//             style={{
//               maskImage: 'radial-gradient(circle, black 35%, transparent 68%)',
//               WebkitMaskImage: 'radial-gradient(circle, black 35%, transparent 68%)',
//               filter: 'sepia(0.3) hue-rotate(-10deg)',
//             }}
//           >
//             <EvilEye eyeColor="#b8860b" />
//           </div>

//           <div className="relative z-10 flex flex-col items-center gap-3">
//             <RuneDivider />
//             <p className={`${imFell.className} italic text-base`} style={{ color: '#7a6a4e' }}>
//               Seek any word spoken within the campaign's chronicles
//             </p>
//           </div>
//         </header>

//         {/* ── Search ──────────────────────────────────────── */}
//         <InstantSearch indexName="transcripts" searchClient={searchClient}>
//           <Configure hitsPerPage={viewMode === 'grid' ? 16 : 12} />

//           <div className="mb-8 max-w-2xl mx-auto">
//             <div className="relative tome-search">
//               <BookOpen
//                 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-10"
//                 style={{ color: '#c9a84c', opacity: 0.6 }}
//               />
//               <SearchBox placeholder="Speak the words you seek…" />
//             </div>
//           </div>

//           {/* ── Toolbar ──────────────────────────────────── */}
//           <div className="flex flex-wrap items-center justify-between gap-3 mb-6 px-1">

//             {/* Stats */}
//             <Stats className={imFell.className} />

//             <div className="flex items-center gap-3">
//               {/* View mode toggle */}
//               <div className="flex border gap-0" style={{ borderColor: 'rgba(201,168,76,0.25)', borderRadius: '2px' }}>
//                 <button
//                   onClick={() => setViewMode('grid')}
//                   className="px-3 py-1.5 text-xs transition-all"
//                   style={{
//                     background: viewMode === 'grid' ? 'rgba(201,168,76,0.12)' : 'transparent',
//                     color: viewMode === 'grid' ? '#c9a84c' : '#7a6a4e',
//                     borderRight: '1px solid rgba(201,168,76,0.2)',
//                   }}
//                 >
//                   <span className={cinzel.className} style={{ letterSpacing: '0.06em', fontSize: '11px' }}>⊞ Grid</span>
//                 </button>
//                 <button
//                   onClick={() => setViewMode('list')}
//                   className="px-3 py-1.5 text-xs transition-all"
//                   style={{
//                     background: viewMode === 'list' ? 'rgba(201,168,76,0.12)' : 'transparent',
//                     color: viewMode === 'list' ? '#c9a84c' : '#7a6a4e',
//                   }}
//                 >
//                   <span className={cinzel.className} style={{ letterSpacing: '0.06em', fontSize: '11px' }}>☰ Scroll</span>
//                 </button>
//               </div>

//               {/* Sort */}
//               <div className="relative" style={{ color: '#7a6a4e' }}>
//                 <Flame className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: '#c9a84c', opacity: 0.5 }} />
//                 <SortBy
//                   items={[
//                     { label: 'Most Relevant', value: 'transcripts' },
//                     { label: 'Oldest First', value: 'transcripts/sort/start_time:asc' },
//                     { label: 'Newest First', value: 'transcripts/sort/start_time:desc' },
//                   ]}
//                   classNames={{
//                     select: `pl-8 pr-3 py-1.5 text-xs outline-none cursor-pointer ${cinzel.className}`,
//                   }}
//                   style={{
//                     background: 'rgba(20,15,8,0.85)',
//                     border: '1px solid rgba(201,168,76,0.25)',
//                     borderRadius: '2px',
//                     color: '#b09c79',
//                     fontSize: '11px',
//                     letterSpacing: '0.05em',
//                   } as React.CSSProperties}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* ── Results ──────────────────────────────────── */}
//           <SearchStatus />

//           {viewMode === 'grid' ? (
//             <Hits
//               hitComponent={Hit}
//               classNames={{
//                 list: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5',
//                 item: 'list-none flex',
//               }}
//             />
//           ) : (
//             <Hits
//               hitComponent={({ hit }: any) => {
//                 const youtubeUrl = `https://youtu.be/${hit.video_id}?t=${hit.start_time}`;
//                 const thumbnailUrl = `https://img.youtube.com/vi/${hit.video_id}/mqdefault.jpg`;
//                 return (
//                   <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="list-hit-card group">
//                     <img
//                       src={thumbnailUrl}
//                       alt={hit.title}
//                       style={{ width: '120px', height: '68px', objectFit: 'cover', flexShrink: 0, filter: 'sepia(0.2) brightness(0.8)', borderRadius: '1px' }}
//                     />
//                     <div className="flex flex-col justify-between flex-1 min-w-0">
//                       <div className="flex justify-between items-start gap-2">
//                         <h3 className={`${cinzel.className} text-sm font-bold truncate`} style={{ color: '#e8d5a3', letterSpacing: '0.03em' }}>
//                           {hit.title}
//                         </h3>
//                         <span className="timestamp-badge shrink-0 flex items-center gap-1 px-2 py-0.5 text-xs ml-2">
//                           <Clock className="w-3 h-3" />
//                           <span className={cinzel.className} style={{ fontSize: '10px' }}>{formatTime(hit.start_time)}</span>
//                         </span>
//                       </div>
//                       <p className={`${imFell.className} italic text-sm mt-1 line-clamp-2`} style={{ color: '#b09c79' }}>
//                         <Highlight attribute="text" hit={hit} />
//                       </p>
//                     </div>
//                     <ExternalLink className="w-4 h-4 self-center opacity-0 group-hover:opacity-50 transition-opacity shrink-0" style={{ color: '#c9a84c' }} />
//                   </a>
//                 );
//               }}
//               classNames={{
//                 list: 'flex flex-col gap-3',
//                 item: 'list-none',
//               }}
//             />
//           )}

//           {/* ── Pagination ───────────────────────────────── */}
//           <div className="mt-10 flex flex-col items-center gap-4">
//             <RuneDivider />
//             <Pagination padding={2} />
//             <p className={`${imFell.className} italic text-xs opacity-30`} style={{ color: '#b09c79' }}>
//               ✦ &nbsp; Turn the page to unveil more chronicles &nbsp; ✦
//             </p>
//           </div>
//         </InstantSearch>

//         {/* ── Footer ──────────────────────────────────────── */}
//         <footer className="mt-16 pt-6 text-center" style={{ borderTop: '1px solid rgba(201,168,76,0.12)' }}>
//           <p className={`${imFell.className} italic text-xs opacity-25`} style={{ color: '#b09c79' }}>
//             Refresh Tome — All words bound within are property of their speakers.
//           </p>
//         </footer>
//       </div>
//     </div>
//   );
// }