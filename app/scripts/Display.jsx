'use strict';

var React = require('react');

var Display = React.createClass({
    renderCurrentSong: function() {
        if (!this.props.song) {
            return (
                <p className="empty-song">No song playing</p>
            );
        } else {
            return (
                <div className="song-metadata">
                    <p className="title">{this.props.song.title}</p>
                    <p className="username">{this.props.song.user.username}</p>
                </div>
            );
        }
    },

    componentDidUpdate: function() {
        if (this.props.song) {
            this.refs.artwork.getDOMNode().style.backgroundImage = "url('" + this.props.song.artwork_url + "')";
        }
    },

    getIsPlaying: function() {
        var status = this.props.isPlaying ? 'Now Playing' : 'Paused';

        return (status);
    },

    render: function() {
        return (
            <div className="display">
                <div className="artwork" ref="artwork"></div>
                <div className="display-info">
                    <p className="is-playing">
                        <span className={this.props.isPlaying ? 'record playing' : 'record'}></span>
                        {this.getIsPlaying()}
                    </p>
                    {this.renderCurrentSong()}
                </div>
            </div>
        );
    }
});

module.exports = Display;