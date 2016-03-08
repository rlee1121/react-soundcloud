import { userFactory } from './UserFactory';

const SC_CLIENT_ID = '7ef1755e2d0ee7e745febfb0dfb3bc29';
const REDIRECT_URI = window.location.origin + '/' + 'callback.html';
// const SC_SECRET_ID = '9cd02d18ad7cce82eff24a71458aca55';


// let scTypeApiMap = {
//     sets: 'playlists',
//     likes: 'favorites'
// };
export function init() {
    let config = {
        client_id: SC_CLIENT_ID,
        redirect_uri: REDIRECT_URI
    };

    let token = localStorage.SC_TOKEN;

    if (token) {
        config.oauth_token = token;
    }

    SC.initialize(config);

    if (token) {
        return connect();
    }

    return Promise.resolve(null);
}

// Gets data from soundcloud api
export function get(path) {
    return SC.get(path);
}

// Resolves with soundcloud player object for song
export function stream(id) {
    return new Promise((resolve, reject) => {
        SC.stream(`/tracks/${id}`, (player, error) => {
            if (error) {
                reject(error);
            } else {
                resolve(player);
            }
        });
    });
}

export function getStreamUrl(id) {
    return `https://api.soundcloud.com/tracks/${id}/stream?client_id=${SC_CLIENT_ID}`;
}

export function connect() {
    return SC.connect().then((data) => {
        localStorage.setItem('SC_TOKEN', data.oauth_token);

        return SC.get('/me');
    }).then((me) => {
        return Promise.resolve(userFactory(me));
    });
}
