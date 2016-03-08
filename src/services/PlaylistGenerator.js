import _ from 'lodash';
import * as SoundCloud from './SoundCloudWrapper';
import * as JukeboxController from './JukeboxController';
import { parse } from './DataFactory';

const TRACKS_PER_USER = 1;
const DEFAULT_SAMPLE_SIZE = 5;

function _getUserFollowing(path, userId, followings, resolve) {
    SoundCloud.get(path)
        .then((following) => {
            let updatedFollowings = followings.concat(following.collection);
            if (following.next_href) {
                let params = following.next_href.split(`/users/${userId}`);
                _getUserFollowing(`/users/${userId}${params[1]}`, userId, updatedFollowings, resolve);
            } else {
                resolve(followings);
            }
        });
}

function _getAllFollowings(userId) {
    return new Promise((resolve, reject) => {
        _getUserFollowing(`/users/${userId}/followings`, userId, [], resolve);
    });
}

function _getUserFavorites(artist, numTracks) {
    return SoundCloud.get(`/users/${artist.id}/favorites?limit=200`)
        .then((faves) => {
            let sample = _.sampleSize(faves, 1);
            sample = _.map(sample, (track) => {
                track.likedBy = {
                    id: artist.id,
                    username: artist.username,
                    artwork: artist.avatar_url
                };
                return track;
            });
            return Promise.resolve(sample);
        });
}

function _generatePlaylist(artists) {
    let favesPromises = artists.map((artist) => {
        return _getUserFavorites(artist, TRACKS_PER_USER);
    });
    return Promise.all(favesPromises)
        .then((result) => {
            return Promise.resolve(_.flatten(result));
        });
}

export function generate(user) {
    return _getAllFollowings(user.id)
        .then((followings) => {
            let sampleSize = followings.length < DEFAULT_SAMPLE_SIZE ?
                followings.length : DEFAULT_SAMPLE_SIZE;
            let sample = _.sampleSize(followings, sampleSize);
            return _generatePlaylist(sample);
        })
        .then((songList) => {
            let parsed = parse([{ tracks: songList }]);
            JukeboxController.setPlaylists(parsed);
            return Promise.resolve(parsed);
        });

}

