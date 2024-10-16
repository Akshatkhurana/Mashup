const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory where the mashup will be stored
app.use('/public', express.static(path.join(__dirname, 'public')));

app.post('/mashup', (req, res) => {
  const { singer, numSongs, duration } = req.body;

  if (!singer || !numSongs || !duration || numSongs <= 0 || duration <= 0) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  // Spawn the Python process
  const pythonProcess = spawn('python3', ['mashup.py', singer, numSongs, duration]);

  pythonProcess.stdout.on('data', (data) => {
    console.log(`Python Output: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python Error: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {
      const mashupPath = path.join(__dirname, 'public', 'mashup.mp3'); // Save file in 'public' directory

      if (fs.existsSync(mashupPath)) {
        const fileUrl = `http://localhost:${PORT}/public/mashup.mp3`; // Serve the file via URL
        res.json({ url: fileUrl }); // Send the file URL to the frontend
      } else {
        res.status(500).json({ error: 'Mashup file not found' });
      }
    } else {
      res.status(500).json({ error: 'Failed to create mashup' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
