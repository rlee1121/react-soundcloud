import React from 'react';

export let Display = React.createClass({
    getBackgroundImage(track) {
        if (track) {
            return `url('${track.artwork}')`;
        }

        return '';
    },

    renderPlayingStatus() {
        return this.props.isPlaying ? 'Now Playing' : 'Paused';
    },

    renderCurrentSong() {
        if (!this.props.track) {
            return (
                <p className="empty-song">No track playing</p>
            );
        }
        return (
            <div className="song-metadata">
                <p className="title">{this.props.track.title}</p>
                <p className="username">{this.props.track.username}</p>
            </div>
        );
    },

    render() {
        return (
            <div className="display">
                <div
                    className="artwork"
                    ref="artwork"
                    style={{
                        backgroundImage: this.getBackgroundImage(this.props.track)
                    }}
                />
                <div className="display-info">
                    <p className="is-playing">
                        <span className={this.props.isPlaying ? 'record playing' : 'record'}></span>
                        {this.renderPlayingStatus()}
                    </p>
                    {this.renderCurrentSong()}
                </div>
            </div>
        );
    }
});
