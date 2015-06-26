import React from 'react';
import ReactDOM from 'react-dom';
import { SCPlayer } from './components/SCPlayer';
import * as JukeboxController from './services/JukeboxController';
import * as Preloader from './services/Preloader';

let App = React.createClass({
    getInitialState() {
        return {
            activeTrack: null,
            isPlaying: false
        };
    },

    componentWillMount() {
        JukeboxController.Dispatcher.on(JukeboxController.Events.RESET, this.onReset);
        JukeboxController.Dispatcher.on(JukeboxController.Events.PLAY, this.updateActiveTrack);
        JukeboxController.Dispatcher.on(JukeboxController.Events.PAUSE, this.updateActiveTrack);
        JukeboxController.Dispatcher.on(JukeboxController.Events.NEXT, this.updateActiveTrack);
        JukeboxController.Dispatcher.on(JukeboxController.Events.PREV, this.updateActiveTrack);
    },

    componentDidMount() {
        JukeboxController.init('rl33');
    },

    updateActiveTrack() {
        this.setState({
            activeTrack: JukeboxController.getActiveTrack(),
            isPlaying: JukeboxController.isPlaying()
        });
    },

    onReset() {
        let loadImagePromises = JukeboxController.getActivePlaylist().tracks
            .map((track) => track.artwork)
            .map(Preloader.loadImage);

        Promise.all(loadImagePromises)
            .then(() => {
                this.updateActiveTrack();
            });
    },

    render() {
        return (
            <div>
                <SCPlayer
                    activeTrack={this.state.activeTrack}
                    isPlaying={this.state.isPlaying}
                />
            </div>
        );
    }
});

ReactDOM.render(<App />, document.getElementById('main'));
