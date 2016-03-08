import React from 'react';

export let NowPlayingView = React.createClass({
    render() {
        return (
            <div className='now-playing-view container'>
                <div
                    className='now-playing-wrapper'
                >
                    <div
                        ref='albumBg'
                        className='player-bg'
                        style={{
                            backgroundImage: `url('${this.props.activeTrack.artwork}')`
                        }}
                    />
                    <div className='overlay'></div>
                    <div className='now-playing-content'>
                        <div className='liked-by'>
                            <div
                                style={{
                                    height: 30,
                                    width: 30,
                                    backgroundImage: `url('${this.props.activeTrack.likedBy.artwork}')`,
                                    backgroundSize: 'cover',
                                    borderRadius: 30
                                }}
                                className='liked-by-img'
                            />
                            <p className='artist'>
                                <span className='username'>{this.props.activeTrack.likedBy.username}</span>
                                <span> liked this track</span>
                            </p>
                        </div>
                        <div className='track-content'>
                            <div
                                style={{
                                    height: 150,
                                    width: 150,
                                    backgroundImage: `url('${this.props.activeTrack.artwork}')`,
                                    backgroundSize: 'cover'
                                }}
                                className='track-image'
                            />
                            <div className='track-metadata'>
                                <h3 className='track-artist'>{this.props.activeTrack.username}</h3>
                                <h1 className='track-title'>{this.props.activeTrack.title}</h1>
                                <div className='track-ctas'>
                                    <div className='like-btn btn'>Like</div>
                                    <div className='play-btn btn'>Play</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});
