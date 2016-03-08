import React from 'react';
import ReactDOM from 'react-dom';
import { LoginView } from './components/LoginView';
import { MainView } from './components/MainView';
import * as SoundCloud from './services/SoundCloudWrapper';

let App = React.createClass({
    getInitialState() {
        return {
            loggedInUser: null,
            initialized: false
        };
    },

    componentWillMount() {
        SoundCloud.init().then((user) => {
            if (user) {
                this.onLogin(user);
            }

            this.setState({ initialized: true });
        });
    },

    onLogin(user) {
        this.setState({ loggedInUser: user });
    },

    renderMain() {
        if (!this.state.initialized) {
            return <h1>LOADING!</h1>;
        } else if (!this.state.loggedInUser) {
            return (
                <LoginView onLogin={this.onLogin} />
            );
        }

        return (
            <MainView user={this.state.loggedInUser} />
        );
    },

    render() {
        return (
            <div>
                { this.renderMain() }
            </div>
        );
    }
});

ReactDOM.render(<App />, document.getElementById('main'));
