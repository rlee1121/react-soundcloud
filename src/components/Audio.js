import React from 'react';

export let Audio = React.createClass({
    getDefaultProps() {
        return {
            src: '',
            scrubTime: 0,
            onEnded() {},
            onTimeUpdate() {},
            onLoadedData() {}
        };
    },

    componentWillReceiveProps(nextProps) {
    },

    componentDidUpdate(prevProps) {
        if (this.props.isPlaying) {
            this.refs.audio.play();
        } else {
            this.refs.audio.pause();
        }

        if (this.props.scrubTime !== prevProps.scrubTime) {
            this.refs.audio.currentTime = this.props.scrubTime;
        }
    },

    render() {
        if (!this.props.track) {
            return null;
        }

        return (
            <audio
                ref='audio'
                src={this.props.track.getStreamUrl()}
                onEnded={this.props.onTrackEnd}
                onTimeUpdate={this.props.onTimeUpdate}
                onLoadedData={this.props.onLoaded}
            />
        );
    }
});
