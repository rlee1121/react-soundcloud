import React from 'react';
import { generate } from '../services/PlaylistGenerator';
import * as JukeboxController from '../services/JukeboxController';
import { PlaylistRow } from './PlaylistRow';

export let PlaylistView = React.createClass({
    getDefaultProps() {
        return {
            user: {},
            activeTrack: {},
            isPlaying: false,
            playlist: []
        };
    },

    getInitialState() {
        return {
            loading: true
        };
    },

    componentWillMount() {
        this.setState({
            loading: true
        });

        generate(this.props.user)
            .then((playlist) => {
                this.setState({ loading: false });
            });
    },

    playSong(index, songId) {
        return () => {
            if (songId !== this.props.activeTrack.id) {
                JukeboxController.jumpTo(index);
            }
            JukeboxController.play();
        };
    },

    pauseSong() {
        JukeboxController.pause();
    },

    renderPlaylist() {
        if (!this.props.playlist.tracks) {
            return null;
        }

        let songs = this.props.playlist.tracks.map((song, index) => {
            return (
                <PlaylistRow
                    key={song.id}
                    song={song}
                    onPlay={this.playSong(index, song.id)}
                    onPause={this.pauseSong}
                    isActive={song === this.props.activeTrack}
                    isPlaying={this.props.isPlaying}
                />
            );
        });

        return (
            <ul className='playlist-list'>
                <li className='header'>
                    <p className='shrink'>Artwork</p>
                    <p>Track</p>
                    <p>Liked By</p>
                </li>
                {songs}
            </ul>);
    },

    render() {
        return (
            <div className='playlist-view container'>
                { this.renderPlaylist() }
            </div>
        );
    }

});
