'use strict';

var React = require('react');

var Controls = React.createClass({
    getPlayPause: function() {
        if (this.props.isPlaying) {
            return (
                <div className="control-container">
                    <div className="player-control pause" onClick={this.props.onPause}></div>
                </div>
            );
        } else {
            return (
                <div className="control-container">
                    <div className="player-control play" onClick={this.props.onPlay}></div>
                </div>
            );
        }
    },

    getControlsClass: function() {
        var classString = 'controls';
        if (!this.props.ready) {
            classString += ' disabled';
        }

        return classString;
    },

    render: function() {
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

module.exports = Controls;