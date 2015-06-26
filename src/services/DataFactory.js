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

    return {
        id,
        title,
        artwork,
        genre,
        tags,
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
