import App from "../Components/App/App";


const clientId = '3e09a9849ca445f8b8da78c9c3915a2b';
const redirectUri = 'http://Spotifyplaylistthing.surge.sh/';
let accessToken;

export const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    // check for access token match
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      // This clears the parameters. Allowing us to grab a new access token when it expires.
      window.setTimeout(() => (accessToken = ''), expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },

    async search(term) {
        accessToken = Spotify.getAccessToken();
        return await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
          .then(response => response.json())
          .then(jsonResponse => {
            if (!jsonResponse.tracks) {
              return [];
            }
            return jsonResponse.tracks.items.map(track => ({
              id: track.id,
              name: track.name,
              artist: track.artists[0].name,
              album: track.album.name,
              uri: track.uri
            }));
          });
      },
    async savePlaylist(name,arrayURIs){
        let accessToken=Spotify.getAccessToken();
        let accessTokenHeader = {
            headers: { Authorization: `Bearer ${accessToken}` }
        };
        let userID = await fetch("https://api.spotify.com/v1/me",accessTokenHeader)
            .then(response =>response.json())
            .then( jsonResponse =>{return jsonResponse.id})
        let playlistID = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,
        {
          headers: {Authorization: `Bearer ${accessToken}`},
          method: 'POST',
          body: JSON.stringify({ name: name })
        }
        ).then(response=>response.json()).then(jsonResponse=>{return jsonResponse.id})
        let addingTracks = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`,{
          headers:{Authorization: `Bearer ${accessToken}`},
          method: "POST",
          body: JSON.stringify({uris: arrayURIs})
        })
    }


}
