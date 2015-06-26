/*
 * 
 */

import * as SoundCloud from './SoundCloudWrapper';
import * as JukeboxStateStore from '../stores/JukeboxStateStore';
import * as AudioPlayerStore from '../stores/AudioPlayerStore';
import { parse } from './DataFactory';
import events from 'events';

export let Dispatcher = new events.EventEmitter();
export let Events = {
    'INITIALIZED': 'INITIALIZED',
    'RESET': 'RESET',
    'PREPLAY': 'PREPLAY',
    'PLAY': 'PLAY',
    'PAUSE': 'PAUSE',
    'NEXT': 'NEXT',
    'PREV': 'PREV'
};

function stream(track) {
    let audioPlayer = AudioPlayerStore.getPlayer(track.id);
    if (audioPlayer) {
        return Promise.resolve(audioPlayer);
    }

    return SoundCloud.stream(track.id)
        .then((player) => {
            return Promise.resolve(AudioPlayerStore.setPlayer(track.id, player));
        });
}

function _pause() {
    if (!JukeboxStateStore.isPlaying()) {
        return;
    }

    JukeboxStateStore.setIsPlaying(false);

    let activeTrack = JukeboxStateStore.getActiveTrack();
    let activePlayer = AudioPlayerStore.getPlayer(activeTrack.id);
    activePlayer.pause();
}

function _play() {
    let activeTrack = JukeboxStateStore.getActiveTrack();
    if (!activeTrack || JukeboxStateStore.isPlaying()) {
        return Promise.resolve();
    }

    JukeboxStateStore.setIsPlaying(true);

    return stream(activeTrack)
        .then((player) => {
            if (player.playState && !player.paused) {
                player.pause();
            }

            player.play();
        });
}

function _getValidPlaylistIndex(index) {
    let playlistTracks = JukeboxStateStore.getActivePlaylist() ?
        JukeboxStateStore.getActivePlaylist().tracks : [];
    let listLength = playlistTracks.length || 0;

    if (index < 0) {
        return listLength - 1;
    } else if (index > listLength - 1) {
        return 0;
    }

    return index;
}

function _loadTrack(index) {
    let targetIndex = _getValidPlaylistIndex(index);
    JukeboxStateStore.setActiveTrackIndex(targetIndex);
}

export function play() {
    return _play()
        .then((player) => {
            Dispatcher.emit(Events.PLAY);
        });
}

export function pause() {
    _pause();
    Dispatcher.emit(Events.PAUSE);
    return Promise.resolve();
}

export function next() {
    let wasPlaying = JukeboxStateStore.isPlaying();
    let currIndex = JukeboxStateStore.getActiveTrackIndex();
    _pause();
    _loadTrack(currIndex + 1);

    if (wasPlaying) {
        return _play().then(() => {
            Dispatcher.emit(Events.NEXT);
        });
    }

    Dispatcher.emit(Events.NEXT);
    return Promise.resolve();
}

export function prev() {
    let wasPlaying = JukeboxStateStore.isPlaying();
    let currIndex = JukeboxStateStore.getActiveTrackIndex();

    _pause();
    _loadTrack(currIndex - 1);

    if (wasPlaying) {
        return _play().then(() => {
            Dispatcher.emit(Events.PREV);
        });
    }

    Dispatcher.emit(Events.PREV);
    return Promise.resolve();
}

// Initializes soundcloud sdk
export function init(username) {
    SoundCloud.init();
    SoundCloud.get(`/users/${username}/playlists`)
        .then((userPlaylists) => {
            let parsed = parse(userPlaylists);
            JukeboxStateStore.setPlaylists(parsed);
            Dispatcher.emit(Events.RESET);
        });
}

export function isPlaying() {
    return JukeboxStateStore.isPlaying();
}

export function getActiveTrack() {
    return JukeboxStateStore.getActiveTrack();
}

export function getActivePlaylist() {
    return JukeboxStateStore.getActivePlaylist();
}
