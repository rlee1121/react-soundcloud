import React from 'react';

export let Nav = React.createClass({

    render() {
        return (
            <div className='nav'>
                <div className='container'>
                    <div className='logo'>
                        <span className={this.props.isPlaying ? 'record playing' : 'record'}></span>
                    </div>

                    <div className='user-info'>
                        {this.props.user.username}
                    </div>
                </div>
            </div>
        );
    }

});
