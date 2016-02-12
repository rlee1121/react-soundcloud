import React from 'react';
import { Display } from './Display';
import { Controls } from './Controls';
import { Audio } from './Audio';
import { Scrubber } from './Scrubber';
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
            time: 0,
            scrubTime: 0
        };
    },

    shouldComponentUpdate(nextProps, nextState) {
        return (
            nextProps.activeTrack !== this.props.activeTrack ||
            nextProps.isPlaying !== this.props.isPlaying ||
            nextState.time !== this.state.time
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

    onTimeUpdate(evt) {
        let player = evt.target;
        this.setState({ time: player.currentTime || 0 });
    },

    onScrub(time) {
        this.setState({ scrubTime: time });
    },

    getBackgroundImage(song) {
        if (song) {
            return `url('${song.artwork}')`;
        }

        return '';
    },

    render() {
        let { activeTrack, isPlaying } = this.props;
        let duration = activeTrack ? activeTrack.duration : 0;

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
                        track={activeTrack}
                        isPlaying={isPlaying}
                    />
                    <Controls
                        ready={activeTrack}
                        isPlaying={isPlaying}
                        onPlay={this.play}
                        onPrev={this.prev}
                        onPause={this.pause}
                        onNext={this.next}
                    />
                    <Audio
                        track={activeTrack}
                        scrubTime={this.state.scrubTime}
                        isPlaying={isPlaying}
                        onTrackEnd={this.next}
                        onTimeUpdate={this.onTimeUpdate}
                    />
                    <Scrubber
                        time={this.state.time}
                        duration={duration / 1000}
                        onScrub={this.onScrub}
                    />

                </div>
            </div>
        );
    }
});
