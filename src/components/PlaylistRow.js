import React from 'react';
import classNames from 'classnames';

export let PlaylistRow = React.createClass({
    getInitialState() {
        return {
            hovering: false
        };
    },

    onMouseEnter() {
        this.setState({ hovering: true });
    },

    onMouseLeave() {
        this.setState({ hovering: false });
    },

    renderBackground(song) {
        if (!this.props.isActive) {
            return null;
        }

        return (
            <div>
                <div
                    ref='albumBg'
                    className='player-bg'
                    style={{
                        backgroundImage: `url('${song.artwork}')`
                    }}
                />
                <div className='overlay'></div>
            </div>
        );
    },

    renderPlayPause() {
        if (this.state.hovering) {
            if (this.props.isPlaying && this.props.isActive) {
                return (
                    <div className="control-container">
                        <div className="artwork-color-overlay" />
                        <div className="player-control pause" onClick={this.props.onPause}></div>
                    </div>
                );
            }

            return (
                <div className="control-container">
                    <div className="artwork-color-overlay" />
                    <div className="player-control play" onClick={this.props.onPlay}></div>
                </div>
            );

        } else if (this.props.isActive) {
            return (
                <div className="is-playing">
                    <div className="artwork-color-overlay" />
                    <span className={this.props.isPlaying ? 'record playing' : 'record'}></span>
                </div>
            );
        }
    },

    render() {
        let { song, onClick, isActive } = this.props;
        return (
            <li
                key={song.id}
                className={classNames('track-row', {
                    'active': isActive,
                    'highlight': this.state.hovering
                })}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            >

                { this.renderBackground(song) }

                <div className='track-content'>
                    <div
                        className='artwork'
                        style={{
                            backgroundImage: `url('${song.artwork}')`
                        }}
                        onClick={onClick}
                    >
                        <div className='overlay' />
                        { this.renderPlayPause() }
                    </div>
                    <div className='info'>
                        <p className='artist'>{song.username}</p>
                        <p className='title'>{ song.title }</p>
                    </div>
                    <div className='info'>
                        <p>{song.likedBy.username}</p>
                    </div>
                </div>
            </li>
        );
    }
});
