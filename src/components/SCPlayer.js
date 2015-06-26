import React from 'react';
import { Display } from './Display';
import { Controls } from './Controls';
import * as JukeboxController from '../services/JukeboxController';

export let SCPlayer = React.createClass({
    getDefaultProps() {
        return {
            activeTrack: null,
            isPlaying: false
        };
    },

    getInitialState() {
        return {
            loading: false
        };
    },

    shouldComponentUpdate(nextProps) {
        return (
            nextProps.activeTrack !== this.props.activeTrack ||
            nextProps.isPlaying !== this.props.isPlaying
        );
    },

    pause() {
        JukeboxController.pause();
    },

    play() {
        JukeboxController.play();
    },

    prev() {
        JukeboxController.prev();
    },

    next() {
        JukeboxController.next();
    },

    getBackgroundImage(song) {
        if (song) {
            return `url('${song.artwork}')`;
        }

        return '';
    },

    render() {
        return (
            <div className=''>
                <div
                    ref='albumBg'
                    className='player-bg'
                    style={{
                        backgroundImage: this.getBackgroundImage(this.props.activeTrack)
                    }}
                />
                <div className='overlay'></div>

                <div className='player-main' ref='playerContainer'>

                    <Display
                        track={this.props.activeTrack}
                        isPlaying={this.props.isPlaying}
                    />
                    <Controls
                        ready={this.props.activeTrack}
                        isPlaying={this.props.isPlaying}
                        onPlay={this.play}
                        onPrev={this.prev}
                        onPause={this.pause}
                        onNext={this.next}
                    />

                </div>
            </div>
        );
    }
});
