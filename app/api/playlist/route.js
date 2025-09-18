// app/api/playlist/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const playlistId = searchParams.get('playlistId');
  const pageToken = searchParams.get('pageToken');
  const maxResults = searchParams.get('maxResults') || '20';
  const API_KEY = process.env.YOUTUBE_API_KEY;

  if (!API_KEY) {
    return NextResponse.json(
      { message: 'YouTube API key not configured' },
      { status: 500 }
    );
  }

  if (!playlistId) {
    return NextResponse.json(
      { message: 'Playlist ID is required' },
      { status: 400 }
    );
  }

  try {
    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&channelId=UCaiEiGfJXJ7opRTgRKQZvUQ&maxResults=50&order=date&key=${API_KEY}`;

    const response = await fetch(playlistUrl);
    const data = await response.json();

    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (!response.ok || data.error) {
      return NextResponse.json(
        { 
          message: 'YouTube API error',
          error: data.error?.message || `${response.status} ${response.statusText}`
        },
        { status: 500 }
      );
    }

    // Get video IDs for duration info
    const videoIds = data.items?.map(video => video.snippet.resourceId.videoId).join(',') || '';
    
    let videosWithDetails = data.items || [];
    
    if (videoIds) {
      const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoIds}&part=contentDetails`
      // const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=AIzaSyDHOad2L9p4go6ajaTEn9W22hpApGQ4R4c&id=${videoIds}&part=contentDetails`
      // const detailsUrl = `https://www.googleapis.com/youtube/data/v3/videos?key=${API_KEY}&id=${videoIds}&part=contentDetails`;
      const detailsResponse = await fetch(detailsUrl);
      const detailsData = await detailsResponse.json();
      
      if (detailsResponse.ok && !detailsData.error) {
        videosWithDetails = data.items.map(video => {
          const details = detailsData.items?.find(
            detail => detail.id === video.snippet.resourceId.videoId
          );
          return {
            ...video,
            duration: details?.contentDetails?.duration || 'PT0S'
          };
        });
      }
    }

    return NextResponse.json({ 
      videos: videosWithDetails,
      nextPageToken: data.nextPageToken,
      totalResults: data.pageInfo?.totalResults || 0
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        message: 'Failed to fetch playlist data',
        error: error.message
      },
      { status: 500 }
    );
  }
}











// // app/api/playlist/route.js
// import { NextResponse } from 'next/server';

// export async function GET(request) {
//   const { searchParams } = new URL(request.url);
//   const playlistId = searchParams.get('playlistId');
//   const API_KEY = process.env.YOUTUBE_API_KEY;

//   console.log('API Key exists:', !!API_KEY);
//   console.log('Playlist ID:', playlistId);

//   if (!API_KEY) {
//     return NextResponse.json(
//       { message: 'YouTube API key not configured' },
//       { status: 500 }
//     );
//   }

//   if (!playlistId) {
//     return NextResponse.json(
//       { message: 'Playlist ID is required' },
//       { status: 400 }
//     );
//   }

//   try {
//     let allVideos = [];
//     let nextPageToken = '';

//     // Fetch all playlist items with pagination
//     do {
//       // const playlistUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&playlistId=PLHe7gljAh4fP8ZcOGKvzCLm2-vrMI7k0S&channelId=UCaiEiGfJXJ7opRTgRKQZvUQ&maxResults=10&order=date&key=AIzaSyCSXRgKCXuVVESi2Q9bvF8Xk0qNl6RjFMQ'
//       // const playlistUrl = `https://www.googleapis.com/youtube/data/v3/playlistItems?key=${API_KEY}&channelId=UCaiEiGfJXJ7opRTgRKQZvUQ&playlistId=${playlistId}&part=snippet&maxResults=50${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
//       const playlistUrl = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLHe7gljAh4fP8ZcOGKvzCLm2-vrMI7k0S&channelId=UCaiEiGfJXJ7opRTgRKQZvUQ&maxResults=10&order=date&key=AIzaSyDHOad2L9p4go6ajaTEn9W22hpApGQ4R4c'
      
//       console.log('fetching', playlistUrl)
//       // console.log('Fetching URL:', playlistUrl.replace(API_KEY, 'API_KEY_HIDDEN'));
      
//       const response = await fetch(playlistUrl);
//       const data = await response.json();
      
//       console.log('Response status:', response.status);
//       console.log('Response data:', JSON.stringify(data, null, 2));
      
//       if (!response.ok) {
//         console.error('YouTube API Error Details:', data);
//         return NextResponse.json(
//           { 
//             message: 'YouTube API error',
//             error: data.error?.message || `${response.status} ${response.statusText}`,
//             details: data.error
//           },
//           { status: 500 }
//         );
//       }
      
//       if (data.error) {
//         return NextResponse.json(
//           { 
//             message: 'YouTube API error',
//             error: data.error.message,
//             details: data.error
//           },
//           { status: 500 }
//         );
//       }

//       allVideos = [...allVideos, ...(data.items || [])];
//       nextPageToken = data.nextPageToken || '';
//     } while (nextPageToken);

//     // Get video IDs for additional details
//     if (allVideos.length === 0) {
//       return NextResponse.json(
//         { 
//           message: 'No videos found in playlist',
//           videos: []
//         }
//       );
//     }

//     const videoIds = allVideos
//       .map(video => video.snippet.resourceId.videoId)
//       .join(',');

//     // Fetch video details for duration and statistics
//     const detailsUrl = `https://www.googleapis.com/youtube/data/v3/videos?key=${API_KEY}&id=${videoIds}&part=contentDetails,statistics`;
    
//     console.log('Fetching video details...');
//     const detailsResponse = await fetch(detailsUrl);
//     const detailsData = await detailsResponse.json();
    
//     if (!detailsResponse.ok) {
//       console.error('Video details error:', detailsData);
//       // Continue without detailed info if this fails
//     }

//     // Merge playlist items with video details
//     const videosWithDetails = allVideos.map(video => {
//       const details = detailsData.items?.find(
//         detail => detail.id === video.snippet.resourceId.videoId
//       );
//       return {
//         ...video,
//         duration: details?.contentDetails?.duration || 'PT0S',
//         viewCount: details?.statistics?.viewCount || '0'
//       };
//     });

//     console.log(`Successfully fetched ${videosWithDetails.length} videos`);
//     return NextResponse.json({ videos: videosWithDetails });
    
//   } catch (error) {
//     console.error('Unexpected error:', error);
//     return NextResponse.json(
//       { 
//         message: 'Failed to fetch playlist data',
//         error: error.message
//       },
//       { status: 500 }
//     );
//   }
// }

