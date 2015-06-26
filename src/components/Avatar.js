import React from 'react';

export let Avatar = React.createClass({
    animate() {
        this.refs.avatarImage.style.width = this.refs.avatarImage.style.width === '200px' ? '100px' : '200px';
    },

    render() {
        return (
            <div>
                <h2>{this.props.username}</h2>
                <img ref="avatarImage" onClick={this.animate} className="avatar-image" src={this.props.image}/>
            </div>
        );
    }
});
