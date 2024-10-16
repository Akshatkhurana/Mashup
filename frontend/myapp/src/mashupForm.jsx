import { useState } from 'react';
import axios from 'axios';

function MashupApp() {
  const [singer, setSinger] = useState('');
  const [numSongs, setNumSongs] = useState(5);
  const [duration, setDuration] = useState(15);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [isCreating, setIsCreating] = useState(false); // State to track creation status

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true); // Set creating status to true

    try {
      const response = await axios.post('http://localhost:5000/mashup', {
        singer,
        numSongs,
        duration,
      });

      // Set the download URL once the backend responds
      if (response.data.url) {
        setDownloadUrl(response.data.url);
      }
    } catch (error) {
      console.error('Error generating mashup:', error);
    } finally {
      setIsCreating(false); // Reset creating status when done
    }
  };

  const styles = {
    container: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '400px',
      margin: 'auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '20px',
      color: '#333',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
    },
    label: {
      marginBottom: '8px',
      color: '#555',
    },
    input: {
      padding: '10px',
      marginBottom: '20px',
      border: '1px solid #ddd',
      borderRadius: '5px',
      fontSize: '16px',
      color: '#333',
      width: '100%',
      transition: 'border-color 0.3s ease',
    },
    button: {
      backgroundColor: '#007bff',
      color: 'white',
      padding: '12px',
      fontSize: '16px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    result: {
      textAlign: 'center',
      marginTop: '20px',
      color: '#28a745',
    },
    downloadLink: {
      display: 'block',
      textAlign: 'center',
      marginTop: '10px',
      color: 'white',
      backgroundColor: '#28a745',
      padding: '10px',
      borderRadius: '5px',
      textDecoration: 'none',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Mashup Creator</h1>
      <form style={styles.form} onSubmit={handleSubmit}>
        <div>
          <label style={styles.label}>Singer: </label>
          <input
            type="text"
            value={singer}
            onChange={(e) => setSinger(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div>
          <label style={styles.label}>Number of Songs: </label>
          <input
            type="number"
            value={numSongs}
            onChange={(e) => setNumSongs(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div>
          <label style={styles.label}>Duration (seconds): </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>
          {isCreating ? 'Creating mashup...' : 'Create Mashup'}
        </button>
      </form>

      {downloadUrl && (
        <div style={styles.result}>
          <h3>Your mashup is ready!</h3>
          <a href={downloadUrl} download="mashup.mp3" style={styles.downloadLink}>
            Click here to download the mashup
          </a>
        </div>
      )}
    </div>
  );
}

export default MashupApp;
