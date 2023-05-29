const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

// Spotify API credentials
const clientId = '89eeec235bdd4ef5a828a5d3a32fe894';
const clientSecret = '655b6edb4fd64cb1885b3a1cf5ab737e';

// Function to request an access token
async function requestAccessToken() {
  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: {
      grant_type: 'client_credentials'
    }
  };

  try {
    const response = await axios(authOptions);
    return response.data.access_token;
  } catch (error) {
    console.error('Error requesting access token:', error.response.data.error);
    return null;
  }
}

// Function to fetch the latest song of a Spotify artist
async function getLatestSong(artistId) {
  const accessToken = await requestAccessToken();

  if (accessToken) {
    const options = {
      url: `https://api.spotify.com/v1/artists/${artistId}/top-tracks`,
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      params: {
        market: 'US'
      }
    };

    try {
      const response = await axios(options);
      const latestSong = response.data.tracks[0]; // Assuming the first track is the latest
      return latestSong;
    } catch (error) {
      console.error('Error fetching latest song:', error.response.data.error);
      return null;
    }
  }
}

// API endpoint to get the latest song of a Spotify artist
app.get('/latest-song', async (req, res) => {
  const artistId = req.query.artistId;
  const latestSong = await getLatestSong(artistId);
  res.json(latestSong);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
