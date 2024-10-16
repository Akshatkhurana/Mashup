import sys
from googleapiclient.discovery import build
from moviepy.editor import AudioFileClip, concatenate_audioclips
import os
import yt_dlp

def check_arguments():
    if len(sys.argv) != 4:
        print("Usage: <SingerName> <NumberOfVideos> <AudioDuration> <OutputFileName>")
        sys.exit(1)

    try:
        num_videos = int(sys.argv[2])
        duration = int(sys.argv[3])

        if num_videos < 5:
            print("Number of videos should be greater or equal to 5.")
            sys.exit(1)

        if duration < 15:
            print("Audio duration should be greater than or equal to 15 seconds.")
            sys.exit(1)

    except ValueError:
        print("Number of videos and audio duration should be integers.")
        sys.exit(1)

# Search for videos on YouTube based on artist name
def get_video_urls(artist_name, num_videos, api_key):
    youtube = build('youtube', 'v3', developerKey=api_key)

    request = youtube.search().list(
        q=artist_name,
        part='snippet',
        type='video',
        maxResults=num_videos
    )
    
    response = request.execute()

    video_urls = []
    for item in response['items']:
        video_id = item['id']['videoId']
        video_urls.append(f"https://www.youtube.com/watch?v={video_id}")

    return video_urls

# Download audio from YouTube using yt-dlp
def download_videos(video_urls):
    audio_files = []
    ydl_opts = {
    'format': 'bestaudio/best',
    'outtmpl': './downloaded_videos/%(id)s.%(ext)s',
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'mp3',
        'preferredquality': '192',
    }],
    'ffmpeg_location': 'C:\\ffmpeg-2024-10-13-git-e347b4ff31-full_build\\bin'
}


    os.makedirs('./downloaded_videos', exist_ok=True)  # Create directory for downloaded videos

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        for url in video_urls:
            try:
                ydl.download([url])
                video_id = url.split('=')[-1]
                audio_file = f'./downloaded_videos/{video_id}.mp3'
                audio_files.append(audio_file)
            except Exception as e:
                print(f"Error downloading {url}: {e}")

    return audio_files

# Trim the first Y seconds from each audio file
def trim_audio_files(audio_files, duration):
    trimmed_files = []

    for audio_file in audio_files:
        output_file = audio_file.replace('.mp3', f'trimmed{duration}.mp3')

        if os.path.exists(audio_file):
            with AudioFileClip(audio_file) as audio:
                trimmed_audio = audio.subclip(0, duration)
                trimmed_audio.write_audiofile(output_file)
                trimmed_files.append(output_file)
                print(f"Trimmed {audio_file} to {duration} seconds.")
        else:
            print(f"File {audio_file} does not exist!")

    return trimmed_files

# Merge all trimmed audios into a single output MP3
def merge_audios(trimmed_files, output_filename):
    audio_clips = [AudioFileClip(audio) for audio in trimmed_files]
    final_clip = concatenate_audioclips(audio_clips)
    final_clip.write_audiofile(output_filename)
    print(f"Final mashup created: {output_filename}")

# Main program execution
if __name__ == "__main__":
    # Parse hardcoded values
    artist_name = sys.argv[1]
    num_videos = int(sys.argv[2])
    duration = int(sys.argv[3])
    output_filename = "Output.mp3"

    # Your YouTube API key here
    api_key = 'AIzaSyCskYE56KoyvDVj7vtAYSnrLmXpMoA2k7Q'

    # Step 1: Get video URLs from YouTube
    video_urls = get_video_urls(artist_name, num_videos, api_key)

    # Step 2: Download videos as MP3
    audio_files = download_videos(video_urls)

    # Step 3: Trim each audio file to the specified duration
    trimmed_files = trim_audio_files(audio_files, duration)

    # Step 4: Merge all trimmed MP3s into a single output file
    merge_audios(trimmed_files, output_filename)
