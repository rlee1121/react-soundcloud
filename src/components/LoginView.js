import React from 'react';
import * as SoundCloud from '../services/SoundCloudWrapper';

export let LoginView = React.createClass({
    getDefaultProps() {
        return {
            onLogin() {}
        };
    },

    login() {
        // initiate auth popup
        SoundCloud.connect()
            .then((user) => {
                this.props.onLogin(user);
            });
    },

    render() {
        return (
            <div className='login-view'>
                <h1>LoginView</h1>
                <a onClick={this.login}>Login</a>
            </div>
        );
    }
});
