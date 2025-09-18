// app/api/search-transcripts/route.js
import { NextResponse } from 'next/server';

// Mock function to search through transcripts
async function searchTranscripts(playlistId, searchTerm) {
  // In a real implementation, this would:
  // 1. Get all video IDs from the playlist
  // 2. Fetch transcripts for each video
  // 3. Search through the transcript text
  // 4. Return matching segments with timestamps
  
  const mockPlaylistVideos = [
    {
      id: 'video1',
      videoId: 'dQw4w9WgXcQ',
      title: 'AI and Machine Learning Fundamentals',
      publishedAt: '2024-01-15T10:00:00Z',
      thumbnails: {
        medium: { url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg' }
      }
    },
    {
      id: 'video2',
      videoId: 'defaultVideo',
      title: 'The Future of Healthcare Technology',
      publishedAt: '2024-01-20T14:30:00Z',
      thumbnails: {
        medium: { url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg' }
      }
    },
    {
      id: 'video3',
      videoId: 'defaultVideo',
      title: 'Ethics in AI Development',
      publishedAt: '2024-01-25T16:15:00Z',
      thumbnails: {
        medium: { url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg' }
      }
    }
  ];

  const results = [];
  
  for (const video of mockPlaylistVideos) {
    // Fetch transcript for each video
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/transcript?videoId=${video.videoId}`);
    const transcriptData = await response.json();
    
    if (transcriptData.success && transcriptData.transcript) {
      // Search through transcript segments
      const matchingSegments = transcriptData.transcript.filter(segment =>
        segment.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (matchingSegments.length > 0) {
        results.push({
          ...video,
          matchingSegments: matchingSegments.map(segment => ({
            ...segment,
            highlighted: segment.text.replace(
              new RegExp(`(${searchTerm})`, 'gi'),
              '<mark>$1</mark>'
            )
          }))
        });
      }
    }
  }
  
  return results;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const playlistId = searchParams.get('playlistId');
  const searchTerm = searchParams.get('q');
  
  if (!playlistId || !searchTerm) {
    return NextResponse.json(
      { message: 'Playlist ID and search term are required' },
      { status: 400 }
    );
  }

  try {
    const results = await searchTranscripts(playlistId, searchTerm);
    
    return NextResponse.json({
      results,
      searchTerm,
      totalResults: results.length,
      success: true
    });
    
  } catch (error) {
    console.error('Search error:', error);
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
