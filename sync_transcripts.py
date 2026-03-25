import os
import json
from googleapiclient.discovery import build
from youtube_transcript_api import YouTubeTranscriptApi
import typesense

# --- CONFIGURATION ---
YOUTUBE_API_KEY = 'AIzaSyCSXRgKCXuVVESi2Q9bvF8Xk0qNl6RjFMQ'
PLAYLIST_ID = 'PLHe7gljAh4fP8ZcOGKvzCLm2-vrMI7k0S'

# Typesense Config
client = typesense.Client({
  'nodes': [{
      'host': '150.136.250.171', # The IP address of your Oracle VM
      'port': '8108',                  # Back to 8108
      'protocol': 'http'               # Back to http
  }],
  'api_key': 'Pedri170',                    # Use the API key from your docker-compose.yml
  'connection_timeout_seconds': 2
})

COLLECTION_NAME = 'transcripts'
STATE_FILE = 'processed_videos.json'

def setup_typesense():
    """Creates the Typesense schema if it doesn't exist."""
    schema = {
        'name': COLLECTION_NAME,
        'fields': [
            {'name': 'video_id', 'type': 'string', 'facet': True},
            {'name': 'title', 'type': 'string'},
            {'name': 'text', 'type': 'string'},
            {'name': 'start_time', 'type': 'int32'}
        ]
    }
    try:
        client.collections[COLLECTION_NAME].retrieve()
    except typesense.exceptions.ObjectNotFound:
        client.collections.create(schema)
        print(f"Created collection: {COLLECTION_NAME}")

def get_playlist_videos(api_key, playlist_id):
    """Fetches all video IDs and Titles from the playlist."""
    youtube = build('youtube', 'v3', developerKey=api_key)
    videos = []
    next_page_token = None

    while True:
        request = youtube.playlistItems().list(
            part='snippet',
            playlistId=playlist_id,
            maxResults=50,
            pageToken=next_page_token
        )
        response = request.execute()

        for item in response['items']:
            videos.append({
                'video_id': item['snippet']['resourceId']['videoId'],
                'title': item['snippet']['title']
            })

        next_page_token = response.get('nextPageToken')
        if not next_page_token:
            break
    return videos

def main():
    setup_typesense()

    # Load previously processed videos
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, 'r') as f:
            processed_videos = set(json.load(f))
    else:
        processed_videos = set()

    print("Fetching playlist...")
    all_videos = get_playlist_videos(YOUTUBE_API_KEY, PLAYLIST_ID)
    
    new_videos = [v for v in all_videos if v['video_id'] not in processed_videos]
    print(f"Found {len(new_videos)} new videos to process.")

    for video in new_videos:
        vid_id = video['video_id']
        title = video['title']
        print(f"Processing: {title}")
        
        try:
            # 1. Initialize the new API object
            ytt_api = YouTubeTranscriptApi()
            
            # 2. Fetch the transcript and convert it back to the raw dictionary format
            transcript = ytt_api.fetch(vid_id).to_raw_data()
            
            documents = []

            # Format lines for Typesense
            for i, line in enumerate(transcript):
                documents.append({
                    'id': f"{vid_id}_{i}", # Typesense requires a unique string ID
                    'video_id': vid_id,
                    'title': title,
                    'text': line['text'],
                    'start_time': int(line['start'])
                })
            
            # Batch import to Typesense for speed
            client.collections[COLLECTION_NAME].documents.import_(documents, {'action': 'upsert'})
            
            # Mark as processed
            processed_videos.add(vid_id)
            with open(STATE_FILE, 'w') as f:
                json.dump(list(processed_videos), f)
                
        except Exception as e:
            print(f"Could not get transcript for {vid_id}: {e}")

if __name__ == "__main__":
    main()