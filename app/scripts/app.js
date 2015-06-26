/** @jsx React.DOM */
var React = require('react');
var ReactRouter = require('react-router');
var Route = ReactRouter.Route;
var RouteHandler = ReactRouter.RouteHandler;
var DefaultRoute = ReactRouter.DefaultRoute;
var SCPlayer = require('./SCPlayer.jsx');

var App = React.createClass({
    render() {
        return (
            <div>
                <RouteHandler/>
            </div>);
    }
});

var Welcome = React.createClass({
    render() {
        return <span></span>;
    }
});

var routes = (
    <Route name="app" path="/" handler={App}>
        <DefaultRoute handler={Welcome} />
        <Route name="scUsername" path="/:username" handler={SCPlayer}></Route>
        <Route name="scUserType" path="/:username/:type" handler={SCPlayer}></Route>
    </Route>
);

ReactRouter.run(routes, (Handler, state) => {
    React.render(<Handler/>, document.body);
});
