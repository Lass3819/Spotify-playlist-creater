
import './App.css';
import {SearchBar} from "../SearchBar/SearchBar.js";
import {Playlist} from "../Playlist/Playlist.js";
import {SearchResults} from "../SearchResults/SearchResults.js";
import React from 'react';
import {Spotify} from "../../util/Spotify";

class App extends React.Component{
  constructor(props){
    super(props);
    
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.search = this.search.bind(this);

    this.state = {searchResults: [],
  playlistName: "New Playlist",  playlistTracks: []};

  }
  search(searchTerm){
    Spotify.search(searchTerm).then(searchResults=>{
      this.setState({searchResults: searchResults});
    }) 
  }

  savePlaylist(){
    const trackURIs = this.state.playlistTracks.map(track=>track.uri);
    Spotify.savePlaylist(this.state.playlistName,trackURIs).then(()=>{
      this.setState({
        playlistName: "New Playlist",
        playlistTracks: []})})

  }

  updatePlaylistName(name){
    this.setState({playlistName: name})
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    for (let song of tracks){
      if (song.id ===track.id){
        return;
      }
    }
    tracks.push(track);
    this.setState({ playlistTracks: tracks });
  }

  removeTrack(track){
    const tracks = this.state.playlistTracks;
    const index = tracks.indexOf(track);
    if (index>-1){
      tracks.splice(index,1);
    }
    this.setState({playlistTracks: tracks});
  }


  render(){
    return (<div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
      <SearchBar onSearch={this.search}/>
        <div class="App-playlist">
        <SearchResults 
          searchResults={this.state.searchResults}
          onAdd={this.addTrack}
        />
        <Playlist
          playlistName={this.state.playlistName}
          playlistTracks={this.state.playlistTracks}
          onRemove={this.removeTrack}
          onNameChange={this.updatePlaylistName}
          onSave={this.savePlaylist}
        />
        
        
  
        </div>
      </div>
    </div>);
  }
    
}

export default App;
