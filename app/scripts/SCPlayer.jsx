'use strict';

/** @jsx React.DOM */
var React = require('react');
var ReactRouter = require('react-router');
var Player = require('./Player.jsx');
var config = require('../../config.json');

var scTypeApiMap = {
    sets: 'playlists',
    likes: 'favorites'
}

var SCPlayer = React.createClass({
	mixins: [ReactRouter.State, ReactRouter.Navigation],

    getInitialState: function() {
        return {
            songs: [],
            activePlaylist: 0, //Index of active playlist
            playlists: []
        };
    },

    loadedPlaylists: [],

    preloadImages: function(songs) {
        for (var i = 0; i < songs.length; i++) {
            var img = document.createElement('img');
            img.style.display = 'none';
            img.src = songs[i].artwork_url;
            this.refs.appMain.getDOMNode().appendChild(img);
        }
    },

    componentWillReceiveProps: function() {
        this.updatePlayer();
    },

    componentWillMount: function() {
        SC.initialize({client_id: config.SC_CLIENT_ID});
        this.updatePlayer();
    },

    updatePlayer() {
        var userName = this.getParams().username;
        var type = scTypeApiMap[this.getParams().type] || 'likes';

        SC.initialize({client_id: config.SC_CLIENT_ID});
        SC.get("/users/" + userName + "/" + type, function(playlists) {
            this.setState({
                'playlists': playlists,
                'songs': playlists[this.state.activePlaylist].tracks
            });
            this.preloadImages(playlists[this.state.activePlaylist].tracks);
        }.bind(this));
    },

    getPlaylist: function() {
        var tracks = this.state.playlists[this.state.activePlaylist - 1].tracks;
        this.setState({
            'activePlaylist' : this.state.activePlaylist - 1,
            'songs' : tracks
        }, function() {
            this.preloadImages(tracks);
        }.bind(this));
    },

    loadPlaylist: function(playlistIndex) {
        var tracks = this.state.playlists[playlistIndex].tracks;
        this.setState({
            activePlaylist: playlistIndex,
            songs: tracks
        }, function() {
            if (!this.loadedPlaylists[playlistIndex]) {
                this.preloadImages(tracks);
                this.loadedPlaylists[playlistIndex] = true;
            }
        }.bind(this));
    },

    nextPlaylist: function() {
        if (this.state.playlists[this.state.activePlaylist + 1]) {
            this.loadPlaylist(this.state.activePlaylist + 1);
        } else {
            this.loadPlaylist(0);
        }
    },

    prevPlaylist: function() {
        if (this.state.playlists[this.state.activePlaylist - 1]) {
            this.loadPlaylist(this.state.activePlaylist + 1);
        } else {
            this.loadPlaylist(this.state.playlists.length - 1);
        }
    },

    connect: function() {},

    getPrevPlaylist: function() {
        if (this.state.playlists.length > 0) {
            var name;
            var prevPlaylist = this.state.playlists[this.state.activePlaylist - 1];
            if (prevPlaylist) {
                name = prevPlaylist.title;
            } else {
                name = this.state.playlists[this.state.playlists.length - 1].title || '';
            }
            return name;
        }
    },
    getNextPlaylist: function() {
        if (this.state.playlists.length > 0) {
            var name;
            var nextPlaylist = this.state.playlists[this.state.activePlaylist + 1];
            if (nextPlaylist) {
                name = nextPlaylist.title;
            } else {
                name = this.state.playlists[0].title || '';
            }
            return name;
        }
    },


    render: function() {
        return (
            <div ref="appMain">
                <Player songs={this.state.songs}/>
                {/*<div className="playlist-nav">
                    <div onClick={this.prevPlaylist}>{this.getPrevPlaylist()}</div>
                    <div onClick={this.nextPlaylist}>{this.getNextPlaylist()}</div>
                </div>*/}
            </div>
		);
	}
});

module.exports = SCPlayer;