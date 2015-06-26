'use strict';

var React = require('react');
var Display = require('./Display.jsx');
var Scrubber = require('./Scrubber.jsx');
var Controls = require('./Controls.jsx');

var Player = React.createClass({
    getDefaultProps: function() {
        return {
            songs: []
        };
    },

    getInitialState: function() {
        return {
            activeSong: null, // songObject
            streams: {}, // { songId : sound}
            isPlaying: false
        };
    },

    componentDidUpdate: function(x, y) {
        if (this.state.activeSong) {
            this.refs.albumBg.getDOMNode().style.backgroundImage = 'url(' + this.state.activeSong.artwork_url + ')';
        }
    },

    componentWillReceiveProps: function(x, y) {
        if (x.songs && (x.songs !== this.props.songs) && this.state.activeSong) {
            this.pause(null, () => {
                this.setState({
                    activeSong: x.songs[0],
                    streams: {}
                }, () => {
                    this.play();
                });
            });
        } else {
            this.setState({
                activeSong: x.songs[0],
                streams: {}
            }, () => {
                this.play();
            });
        }
    },

    internalPlay: function(song) {
        if (this.state.streams[song.id]) {
            // Stream already exists, play it
            this.setState({
                'isPlaying': true,
                'activeSong': song
            }, function() {
                this.state.streams[song.id].play();
            }.bind(this));
        } else {
            // Stream song, add sound to streams map and set activeSong with songId
            SC.stream("/tracks/" + song.id, function(sound) {
                // Play the sound
                sound.play();

                // Add sound to streams map with song.id as key
                var currStreams = this.state.streams;
                currStreams[song.id] = sound;

                // Update stream and activeSong states
                this.setState({
                    'isPlaying': true,
                    'stream' : currStreams,
                    'activeSong': song
                });
            }.bind(this));
        }
    },

    getActiveSongIndex: function() {
        var activeSongIndex = -1;
        if (this.state.activeSong) {
            for (var i = 0; i < this.props.songs.length; i++) {
                if (this.props.songs[i].id === this.state.activeSong.id) {
                    activeSongIndex = i;
                }
            }
        }

        return activeSongIndex;
    },

    onSongChange: function(index) {
        var activeSongIndex = this.getActiveSongIndex();

        if (this.state.isPlaying) {
            // if player is playing, pause current song and play target song
            this.state.streams[this.props.songs[activeSongIndex].id].pause();
            this.internalPlay(this.props.songs[index]);

        } else {
            // if not playing, set active song but dont play
            this.setState({'activeSong' : this.props.songs[index]});
        }
    },

    pause: function(evt, cb) {
        this.setState({'isPlaying': false}, function() {
            var activeSongId = this.state.activeSong.id;
            if (this.state.streams[activeSongId]) {
                this.state.streams[activeSongId].pause();
            }
            if (cb) {
                cb();
            }
        }.bind(this));
    },

    play: function() {
        if (!this.state.isPlaying && this.state.activeSong) {
            this.internalPlay(this.state.activeSong);
        }

        if (!this.state.activeSong) {
            this.internalPlay(this.props.songs[0]);
        }
    },

    prev: function() {
        var activeSongIndex = this.getActiveSongIndex();

        // Determine new target song
        if (activeSongIndex > 0) {
            this.onSongChange(activeSongIndex - 1);
        } else {
            this.onSongChange(this.props.songs.length - 1);
        }
    },


    next: function() {
        var activeSongIndex = this.getActiveSongIndex();

        // Determine target song
        if (activeSongIndex < this.props.songs.length - 1) {
            this.onSongChange(activeSongIndex + 1);
        } else {
            this.onSongChange(0);
        }
    },

    render: function() {
        return (
            <div className="">
                <div ref="albumBg" className="player-bg"></div>
                <div className="overlay"></div>

                <div className="player-main" ref="playerContainer">

                    <Display isPlaying={this.state.isPlaying} song={this.state.activeSong} />

                    {/*<Scrubber   />*/}

                    <Controls ready={this.props.songs.length > 0} isPlaying={this.state.isPlaying} onPlay={this.play} onPrev={this.prev} onPause={this.pause} onNext={this.next} />

                </div>
            </div>
        );
    }
});

module.exports = Player;