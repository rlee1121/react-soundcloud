/*
 * 
 */

import * as SoundCloud from './SoundCloudWrapper';
import * as JukeboxStateStore from '../stores/JukeboxStateStore';
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

function _pause() {
    JukeboxStateStore.setIsPlaying(false);
}

function _play() {
    JukeboxStateStore.setIsPlaying(true);
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
    _play();
    Dispatcher.emit(Events.PLAY);
}

export function pause() {
    _pause();
    Dispatcher.emit(Events.PAUSE);
}

export function next() {
    let currIndex = JukeboxStateStore.getActiveTrackIndex();
    _loadTrack(currIndex + 1);
    Dispatcher.emit(Events.NEXT);
}

export function prev() {
    let currIndex = JukeboxStateStore.getActiveTrackIndex();
    _loadTrack(currIndex - 1);
    Dispatcher.emit(Events.PREV);
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
