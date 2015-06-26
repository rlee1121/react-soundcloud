'use strict';

var React = require('react');

var Avatar = React.createClass({
    animate: function() {
        this.refs.avatarImage.getDOMNode().style.width = this.refs.avatarImage.getDOMNode().style.width === '200px' ? '100px' : '200px';
    },

    render: function() {
        return (
            <div>
                <h2>{this.props.username}</h2>
                <img ref="avatarImage" onClick={this.animate} className="avatar-image" src={this.props.image}/>
            </div>
        );
    }
});

module.exports = Avatar;