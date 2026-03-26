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

// import React from 'react';
// import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';
// import { InstantSearch, SearchBox, Hits, Highlight, Configure } from 'react-instantsearch';
// import { ExternalLink } from 'lucide-react';
// import EvilEye from '../components/EvilEye';

// const typesenseAdapter = new TypesenseInstantSearchAdapter({
//   server: {
//     apiKey: 'Pedri170',
//     nodes: [
//       {
//         host: 'search.refreshto.me', 
//         port: 443,
//         protocol: 'https',
//       },
//     ],
//   },
//   additionalSearchParameters: {
//     query_by: 'text,title',
//     num_typos: 1,
//   },
// });
// const searchClient = typesenseAdapter.searchClient;

// const formatTime = (seconds: number) => {
//   const m = Math.floor(seconds / 60).toString().padStart(2, '0');
//   const s = (seconds % 60).toString().padStart(2, '0');
//   return `${m}:${s}`;
// };

// const Hit = ({ hit }: any) => {
//   const youtubeUrl = `https://youtu.be/${hit.video_id}?t=${hit.start_time}`;
//   const thumbnailUrl = `https://img.youtube.com/vi/${hit.video_id}/mqdefault.jpg`;

//   return (
//     <a 
//       href={youtubeUrl} 
//       target="_blank" 
//       rel="noopener noreferrer"
//       className="flex flex-col bg-[#222] border border-gray-800 rounded-xl overflow-hidden hover:bg-[#2a2a2a] transition group"
//     >
//       <div className="relative h-40 overflow-hidden bg-black">
//         <img 
//           src={thumbnailUrl} 
//           alt={hit.title} 
//           className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
//         />
//         <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 text-xs font-mono rounded">
//           {formatTime(hit.start_time)}
//         </div>
//       </div>
      
//       <div className="p-4 flex-1">
//         <h3 className="text-sm font-semibold mb-2 flex justify-between items-start gap-2 text-white">
//           <span className="line-clamp-2">{hit.title}</span>
//           <ExternalLink className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
//         </h3>
//         <p className="text-gray-400 text-sm">
//           <Highlight attribute="text" hit={hit} classNames={{ highlighted: 'bg-yellow-200 text-black px-1 rounded' }} />
//         </p>
//       </div>
//     </a>
//   );
// };

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-[#111] text-white p-6 md:p-12 font-sans">
//       <div className="max-w-6xl mx-auto">
        
//         <div className="text-center mb-10 flex flex-col items-center">
          
//           <h1 className="text-5xl md:text-7xl font-bold relative z-20">Refresh Tome</h1>
          
//           <div 
//             className="relative w-80 h-80 -my-16 pointer-events-none z-0"
//           >
//              <EvilEye eyeColor="#8b5ddf" />
//           </div>
//         </div>

//         <InstantSearch indexName="transcripts" searchClient={searchClient}>
//           <Configure hitsPerPage={12} />
          
//           <div className="mb-8 max-w-2xl mx-auto">
//             <SearchBox 
//               placeholder="Search the transcripts..."
//               classNames={{
//                 root: 'relative',
//                 input: 'w-full p-4 pl-12 bg-[#222] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-white transition',
//                 submitIcon: 'hidden',
//                 resetIcon: 'hidden'
//               }}
//             />
//           </div>

//           <Hits 
//             hitComponent={Hit} 
//             classNames={{
//               list: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4',
//               item: 'list-none'
//             }}
//           />
//         </InstantSearch>
//       </div>
//     </div>
//   );
// }