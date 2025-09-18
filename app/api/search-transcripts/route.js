// app/api/search-transcripts/route.js
import { NextResponse } from 'next/server';

// Mock function to search through transcripts
async function searchTranscripts(playlistId, searchTerm) {
  const mockPlaylistVideos = [
    {
      id: 'video1',
      videoId: 'dQw4w9WgXcQ',
      title: 'AI and Machine Learning Fundamentals - Deep Dive Discussion',
      publishedAt: '2024-01-15T10:00:00Z',
      thumbnails: {
        medium: { url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg' }
      }
    },
    {
      id: 'video2',
      videoId: 'jNQXAC9IVRw',
      title: 'The Future of Healthcare Technology and AI Integration',
      publishedAt: '2024-01-20T14:30:00Z',
      thumbnails: {
        medium: { url: 'https://i.ytimg.com/vi/jNQXAC9IVRw/mqdefault.jpg' }
      }
    },
    {
      id: 'video3',
      videoId: 'M7lc1UVf-VE',
      title: 'Ethics in AI Development - A Comprehensive Overview',
      publishedAt: '2024-01-25T16:15:00Z',
      thumbnails: {
        medium: { url: 'https://i.ytimg.com/vi/M7lc1UVf-VE/mqdefault.jpg' }
      }
    }
  ];

  // Mock transcript segments for each video
  const mockTranscripts = {
    'dQw4w9WgXcQ': [
      { text: "Welcome to today's podcast episode where we discuss artificial intelligence", start: 5.0, duration: 4.2 },
      { text: "Machine learning algorithms are transforming how we process data", start: 45.2, duration: 4.1 },
      { text: "The implications of AI in various industries are tremendous", start: 125.3, duration: 3.8 },
      { text: "Deep learning models can identify patterns humans might miss", start: 185.7, duration: 4.3 },
      { text: "Artificial neural networks mimic the human brain's structure", start: 245.1, duration: 4.0 }
    ],
    'jNQXAC9IVRw': [
      { text: "Healthcare technology is evolving at an unprecedented pace", start: 12.5, duration: 3.9 },
      { text: "AI-powered diagnostic tools can detect diseases earlier than ever", start: 67.8, duration: 4.5 },
      { text: "Machine learning helps doctors make more accurate diagnoses", start: 134.2, duration: 4.1 },
      { text: "The integration of AI in healthcare raises important ethical questions", start: 198.6, duration: 4.7 },
      { text: "Patient data privacy must be protected in AI healthcare systems", start: 267.3, duration: 4.2 }
    ],
    'M7lc1UVf-VE': [
      { text: "Ethics in artificial intelligence development is a critical consideration", start: 8.3, duration: 4.4 },
      { text: "We must ensure AI systems are fair and unbiased in their decisions", start: 78.9, duration: 4.6 },
      { text: "The responsibility of AI developers extends beyond just coding", start: 145.7, duration: 4.2 },
      { text: "Transparency in machine learning models is essential for trust", start: 203.1, duration: 4.3 },
      { text: "Ethical AI frameworks help guide responsible development practices", start: 289.4, duration: 4.5 }
    ]
  };

  const results = [];
  
  for (const video of mockPlaylistVideos) {
    const transcript = mockTranscripts[video.videoId] || [];
    
    // Search through transcript segments
    const matchingSegments = transcript.filter(segment =>
      segment.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (matchingSegments.length > 0) {
      results.push({
        ...video,
        matchingSegments: matchingSegments.map(segment => ({
          ...segment,
          highlighted: segment.text.replace(
            new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
            '<mark>$1</mark>'
          )
        }))
      });
    }
  }
  
  return results;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const playlistId = searchParams.get('playlistId');
    const searchTerm = searchParams.get('q');
    
    if (!playlistId || !searchTerm) {
      return NextResponse.json(
        { 
          message: 'Playlist ID and search term are required',
          success: false 
        },
        { status: 400 }
      );
    }

    const results = await searchTranscripts(playlistId, searchTerm);
    
    return NextResponse.json({
      results,
      searchTerm,
      totalResults: results.length,
      success: true
    });
    
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to search transcripts',
        error: error.message,
        success: false
      },
      { status: 500 }
    );
  }
}








// // app/api/search-transcripts/route.js
// import { NextResponse } from 'next/server';

// // Mock function to search through transcripts
// async function searchTranscripts(playlistId, searchTerm) {
//   // In a real implementation, this would:
//   // 1. Get all video IDs from the playlist
//   // 2. Fetch transcripts for each video
//   // 3. Search through the transcript text
//   // 4. Return matching segments with timestamps
  
//   const mockPlaylistVideos = [
//     {
//       id: 'video1',
//       videoId: 'dQw4w9WgXcQ',
//       title: 'AI and Machine Learning Fundamentals',
//       publishedAt: '2024-01-15T10:00:00Z',
//       thumbnails: {
//         medium: { url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg' }
//       }
//     },
//     {
//       id: 'video2',
//       videoId: 'defaultVideo',
//       title: 'The Future of Healthcare Technology',
//       publishedAt: '2024-01-20T14:30:00Z',
//       thumbnails: {
//         medium: { url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg' }
//       }
//     },
//     {
//       id: 'video3',
//       videoId: 'defaultVideo',
//       title: 'Ethics in AI Development',
//       publishedAt: '2024-01-25T16:15:00Z',
//       thumbnails: {
//         medium: { url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg' }
//       }
//     }
//   ];

//   const results = [];
  
//   for (const video of mockPlaylistVideos) {
//     // Fetch transcript for each video
//     const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/transcript?videoId=${video.videoId}`);
//     const transcriptData = await response.json();
    
//     if (transcriptData.success && transcriptData.transcript) {
//       // Search through transcript segments
//       const matchingSegments = transcriptData.transcript.filter(segment =>
//         segment.text.toLowerCase().includes(searchTerm.toLowerCase())
//       );
      
//       if (matchingSegments.length > 0) {
//         results.push({
//           ...video,
//           matchingSegments: matchingSegments.map(segment => ({
//             ...segment,
//             highlighted: segment.text.replace(
//               new RegExp(`(${searchTerm})`, 'gi'),
//               '<mark>$1</mark>'
//             )
//           }))
//         });
//       }
//     }
//   }
  
//   return results;
// }

// export async function GET(request) {
//   const { searchParams } = new URL(request.url);
//   const playlistId = searchParams.get('playlistId');
//   const searchTerm = searchParams.get('q');
  
//   if (!playlistId || !searchTerm) {
//     return NextResponse.json(
//       { message: 'Playlist ID and search term are required' },
//       { status: 400 }
//     );
//   }

//   try {
//     const results = await searchTranscripts(playlistId, searchTerm);
    
//     return NextResponse.json({
//       results,
//       searchTerm,
//       totalResults: results.length,
//       success: true
//     });
    
//   } catch (error) {
//     console.error('Search error:', error);
//     return NextResponse.json(
//       { 
//         message: 'Failed to search transcripts',
//         error: error.message,
//         success: false
//       },
//       { status: 500 }
//     );
//   }
// }
