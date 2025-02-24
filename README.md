# Mashup Generator

## Overview
Mashup Generator is a web application that allows users to create mashups of songs from a specific singer. Users can specify the singer's name, the number of songs, and the duration of the mashup. The backend fetches songs using the **Google API**, extracts the first 10 seconds of each song, and merges them into a single mashup file.

## Features
- **User Input**: Enter singer's name, number of songs, and mashup duration.
- **Automated Song Fetching**: Uses Google API to fetch songs.
- **Mashup Creation**: Extracts the first 10 seconds of each song and merges them.
- **Frontend**: Built using React with Vite.
- **Backend**: Developed using Node.js and Python.

## Tech Stack
- **Frontend**: React, Vite, CSS
- **Backend**: Node.js, Express.js, Python
- **APIs Used**: Google API for fetching songs
- **Libraries**: FFmpeg (for audio processing)

## Installation
### Prerequisites
Ensure you have the following installed:
- Node.js
- Python
- FFmpeg

### Clone the Repository
```sh
git clone https://github.com/Akshatkhurana/Mashup
cd mashup-generator
```

### Backend Setup
```sh
cd backend
npm install
node server.js
```

### Frontend Setup
```sh
cd frontend
npm install
npm run dev
```

[Img not visible]()

## Usage
1. Open the web app in your browser.
2. Enter the singer’s name, number of songs, and duration.
3. Click **Generate Mashup**.
4. Wait for processing; the mashup will be available for download.

