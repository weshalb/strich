// Function to update the HTML with the latest song details
function updateSongContainer(song) {
  const songContainer = document.getElementById('song-container');
  songContainer.innerHTML = `
    <h2>${song.name}</h2>
    <p>By ${song.artists[0].name}</p>
    <p>Album: ${song.album.name}</p>
    <img src="${song.album.images[0].url}" alt="Album Cover" style="max-width: 200px;">
  `;
}

// Function to fetch the latest song of a Spotify artist
async function getLatestSong(artistId) {
  const response = await fetch(`/latest-song?artistId=${artistId}`);
  const song = await response.json();

  if (song) {
    updateSongContainer(song);
  } else {
    console.error('Error fetching latest song');
  }
}

// Call the function with the artist ID when the page loads
window.addEventListener('load', function() {
  // Replace 'ARTIST_ID' with the actual ID of the desired Spotify artist
  getLatestSong('ARTIST_ID');
});
