import React from 'react';

export let Scrubber = React.createClass({
    getReadableSecs(secs) {
        return secs > 9 ? secs : `0${secs}`;
    },

    getProgress() {
        let pct = (this.props.time / this.props.duration) * 100 || 0;
        return `${pct}%`;
    },

    displayTime() {
        let mins = Math.floor(this.props.time / 60, 10);
        let secs = Math.floor(this.props.time, 10) - mins * 60;
        return `${mins}:${this.getReadableSecs(secs)}`;
    },

    displayDuration() {
        let mins = Math.floor(this.props.duration / 60, 10);
        let secs = Math.floor(this.props.duration, 10) - mins * 60;
        return `${mins}:${this.getReadableSecs(secs)}`;
    },

    scrub(evt) {
        let scrubPct = (evt.clientX - evt.target.offsetLeft) / evt.target.clientWidth;
        this.props.onScrub(this.props.duration * scrubPct);
    },

    render() {
        return (
            <div className="scrubber-container">
                <div className="curr-time">{ this.displayTime() }</div>
                <div
                    className="progress-bg"
                    onClick={this.scrub}
                >
                    <div
                        className="progress-curr"
                        style={{
                            width: this.getProgress(),
                            pointerEvents: 'none'
                        }}
                    >
                    </div>
                </div>
                <div className="duration">{ this.displayDuration() }</div>
            </div>
        );
    }
});
