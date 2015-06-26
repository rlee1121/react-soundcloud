import React from 'react';

export let Controls = React.createClass({
    getPlayPause() {
        if (this.props.isPlaying) {
            return (
                <div className="control-container">
                    <div className="player-control pause" onClick={this.props.onPause}></div>
                </div>
            );
        }

        return (
            <div className="control-container">
                <div className="player-control play" onClick={this.props.onPlay}></div>
            </div>
        );
    },

    getControlsClass() {
        let classString = 'controls';
        if (!this.props.ready) {
            classString += ' disabled';
        }

        return classString;
    },

    render() {
        return (
            <div className={this.getControlsClass()}>
                <div className="control-container">
                    <div className="player-control prev" onClick={this.props.onPrev}></div>
                </div>

                {this.getPlayPause()}

                <div className="control-container">
                    <div className="player-control next" onClick={this.props.onNext}></div>
                </div>
            </div>
        );
    }
});
