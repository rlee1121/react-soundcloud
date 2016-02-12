import * as SoundCloud from './SoundCloudWrapper';

/*
 * Responsible for taking Soundcloud JSON data and generating
 * playlist and track objects
 */

function trackFactory(track) {
    const id = track.id;
    const title = track.title;
    const artwork = track.artwork_url;
    const genre = track.genre;
    const tags = track.tag_list;
    const username = track.user.username;
    const duration = track.duration;

    function getStreamUrl() {
        return SoundCloud.getStreamUrl(id);
    }

    return {
        id,
        getStreamUrl,
        title,
        artwork,
        genre,
        tags,
        duration,
        username
    };
}

function playlistFactory(playlist) {
    return {
        id: playlist.id,
        title: playlist.title,
        genre: playlist.genre,
        url: playlist.permalink_url,
        tracks: playlist.tracks.map(trackFactory)
    };
}

export function parse(playlists) {
    return playlists.map(playlistFactory);
}
