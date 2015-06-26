const SC_CLIENT_ID = '7ef1755e2d0ee7e745febfb0dfb3bc29';
// let scTypeApiMap = {
//     sets: 'playlists',
//     likes: 'favorites'
// };
export function init() {
    SC.initialize({ client_id: SC_CLIENT_ID });
}

// Gets data from soundcloud api
export function get(path) {
    return new Promise((resolve, reject) => {
        SC.get(path, (data, error) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
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
