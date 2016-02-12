let playlists = []; // User's playlists
let activePlaylistIndex = 0; // Index of active playlist
let activeTrackIndex = 0; // Index of active track
let playing = false;

export function setPlaylists(activePlaylists) {
    playlists = activePlaylists;
}

export function getPlaylists() {
    return playlists;
}

export function getActiveTrack() {
    return playlists[activePlaylistIndex].tracks[activeTrackIndex];
}

export function getActiveTrackIndex() {
    return activeTrackIndex;
}

export function setActiveTrackIndex(index) {
    activeTrackIndex = index;
    return activeTrackIndex;
}

export function getActivePlaylist() {
    return playlists[activePlaylistIndex];
}

export function isPlaying() {
    return playing;
}

export function setIsPlaying(bool) {
    playing = bool;
    return playing;
}
