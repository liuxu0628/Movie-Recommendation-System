import React from 'react';
import { Route } from 'react-router-dom';
import Hoc from './hoc/hoc';
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

import Signup from './containers/Signup';
import Login from './containers/Login';
// import Signup from './components/SignUp';
// import Login from './components/Login';
import HomepageLayout from './containers/Home';
import MovieBrowser from './containers/Movie/MovieBrowser';
import About from './containers/About/index';
import MovieDetail from './containers/Movie/MovieDetail';


const BaseRouter = data => (
  <Hoc>
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
    <Route exact path="/" component={HomepageLayout} />
    <Route exact path="/movies" component={MovieBrowser} />
    <Route exact path="/about" component={About} />
    <Route
      path={'/movie/:movie/:id'}
      render={props => <MovieDetail key={props.match.params.id} {...props} />}
    />
  </Hoc>
);

export default BaseRouter;
