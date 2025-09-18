// app/components/TranscriptSearchResult.js
'use client';

import { Clock, Play, ExternalLink } from 'lucide-react';

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function TranscriptSearchResult({ result, playlistId }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div className="flex-shrink-0">
          <img
            src={result.thumbnails.medium.url}
            alt={result.title}
            className="w-32 h-24 object-cover rounded-md"
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {result.title}
          </h3>
          
          <div className="text-sm text-gray-600 mb-3">
            {new Date(result.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </div>
          
          {/* Matching Segments */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800">
              Found {result.matchingSegments.length} mention{result.matchingSegments.length !== 1 ? 's' : ''}:
            </h4>
            
            {result.matchingSegments.map((segment, index) => (
              <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock size={14} className="text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {formatTime(segment.start)}
                      </span>
                    </div>
                    <p 
                      className="text-gray-800 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: segment.highlighted }}
                    />
                  </div>
                  
                  {/* Jump to timestamp button */}
                  <a
                    href={`https://www.youtube.com/watch?v=${result.videoId}&list=${playlistId}&t=${Math.floor(segment.start)}s`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 inline-flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors"
                    title="Jump to this moment in the video"
                  >
                    <Play size={12} />
                    Jump
                  </a>
                </div>
              </div>
            ))}
          </div>
          
          {/* Full video link */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <a
              href={`https://www.youtube.com/watch?v=${result.videoId}&list=${playlistId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              <ExternalLink size={14} />
              Watch full episode
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}









// // app/components/TranscriptSearchResult.js
// 'use client';

// import { Clock, Play, ExternalLink } from 'lucide-react';

// function formatTime(seconds) {
//   const mins = Math.floor(seconds / 60);
//   const secs = Math.floor(seconds % 60);
//   return `${mins}:${secs.toString().padStart(2, '0')}`;
// }

// export default function TranscriptSearchResult({ result, playlistId, searchTerm }) {
//   return (
//     <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
//       <div className="flex gap-4">
//         {/* Thumbnail */}
//         <div className="flex-shrink-0">
//           <img
//             src={result.thumbnails.medium.url}
//             alt={result.title}
//             className="w-32 h-24 object-cover rounded-md"
//           />
//         </div>
        
//         {/* Content */}
//         <div className="flex-1 min-w-0">
//           <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
//             {result.title}
//           </h3>
          
//           <div className="text-sm text-gray-600 mb-3">
//             {new Date(result.publishedAt).toLocaleDateString('en-US', {
//               year: 'numeric',
//               month: 'short',
//               day: 'numeric'
//             })}
//           </div>
          
//           {/* Matching Segments */}
//           <div className="space-y-3">
//             <h4 className="font-medium text-gray-800">
//               Found {result.matchingSegments.length} mention{result.matchingSegments.length !== 1 ? 's' : ''}:
//             </h4>
            
//             {result.matchingSegments.map((segment, index) => (
//               <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r">
//                 <div className="flex items-start justify-between gap-3">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2 mb-1">
//                       <Clock size={14} className="text-gray-500" />
//                       <span className="text-sm text-gray-600">
//                         {formatTime(segment.start)}
//                       </span>
//                     </div>
//                     <p 
//                       className="text-gray-800 text-sm leading-relaxed"
//                       dangerouslySetInnerHTML={{ __html: segment.highlighted }}
//                     />
//                   </div>
                  
//                   {/* Jump to timestamp button */}
//                   <a
//                     href={`https://www.youtube.com/watch?v=${result.videoId}&list=${playlistId}&t=${Math.floor(segment.start)}s`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="flex-shrink-0 inline-flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors"
//                     title="Jump to this moment in the video"
//                   >
//                     <Play size={12} />
//                     Jump
//                   </a>
//                 </div>
//               </div>
//             ))}
//           </div>
          
//           {/* Full video link */}
//           <div className="mt-4 pt-3 border-t border-gray-200">
//             <a
//               href={`https://www.youtube.com/watch?v=${result.videoId}&list=${playlistId}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
//             >
//               <ExternalLink size={14} />
//               Watch full episode
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
