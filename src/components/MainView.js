import React from 'react';
import * as JukeboxController from '../services/JukeboxController';
import * as Preloader from '../services/Preloader';
import { SCPlayer } from './SCPlayer';
import { Nav } from './Nav';
import { PlaylistView } from './PlaylistView';
import { LoadingView } from './LoadingView';
import { NowPlayingView } from './NowPlayingView';

export let MainView = React.createClass({
    getDefaultProps() {
        return {
            user() {}
        };
    },

    getInitialState() {
        return {
            activeTrack: null,
            activePlaylist: {},
            isPlaying: false
        };
    },

    componentWillMount() {
        JukeboxController.Dispatcher.on(JukeboxController.Events.RESET, this.onReset);
        JukeboxController.Dispatcher.on(JukeboxController.Events.PLAY, this.updateActiveTrack);
        JukeboxController.Dispatcher.on(JukeboxController.Events.PAUSE, this.updateActiveTrack);
        JukeboxController.Dispatcher.on(JukeboxController.Events.NEXT, this.updateActiveTrack);
        JukeboxController.Dispatcher.on(JukeboxController.Events.PREV, this.updateActiveTrack);
    },

    onReset() {
        this.updateActiveTrack();

        let loadImagePromises = JukeboxController.getActivePlaylist().tracks
            .map((track) => track.artwork)
            .map((url) => {
                if (url) {
                    return Preloader.loadImage(url);
                }

                return Promise.resolve();
            });

        Promise.all(loadImagePromises);
    },

    updateActiveTrack() {
        this.setState({
            activePlaylist: JukeboxController.getActivePlaylist(),
            activeTrack: JukeboxController.getActiveTrack(),
            isPlaying: JukeboxController.isPlaying()
        });
    },

    renderBreadcrumbs() {},
    renderPlaylist() {
        if (!this.state.loading) {
            return (
                <PlaylistView
                    user={this.props.user}
                    activeTrack={this.state.activeTrack}
                    isPlaying={this.state.isPlaying}
                    playlist={this.state.activePlaylist}
                />
            );
        }

        return <LoadingView />;
    },

    renderActiveTrack() {
        if (!this.state.activeTrack) {
            return null;
        }

        return (
            <NowPlayingView
                user={this.props.user}
                activeTrack={this.state.activeTrack}
                isPlaying={this.state.isPlaying}
            />
        );
    },

    render() {
        return (
            <div className='main-view'>
                <Nav user={this.props.user} />
                { this.renderBreadcrumbs() }

                { this.renderActiveTrack() }

                { this.renderPlaylist() }

                <SCPlayer
                    activeTrack={this.state.activeTrack}
                    isPlaying={this.state.isPlaying}
                />
            </div>
        );
    }
});
