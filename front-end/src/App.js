import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { connect } from 'react-redux';
import BaseRouter from './routes';
import * as actions from './store/actions/auth';
import 'semantic-ui-css/semantic.min.css';
import CustomLayout from './containers/Layout';
import * as movieActions from './store/actions/movie';
import * as authActions from './store/actions/auth';

const filters = ['most_watched', 'popular', 'recent', 'top_rated'];

class App extends Component {
  componentDidMount() {
    this.props.onTryAutoSignup();

    const { getMovies, getGenres } = this.props;

    getMovies({ filters });
    // getGenres();
  }

  render() {
    return (
      <Router>
        <CustomLayout {...this.props}>
          <BaseRouter {...this.props} />
        </CustomLayout>
      </Router>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
    genres: state.movieBrowser.genres,
    movies: state.movieBrowser.movies,
    token: state.auth.token
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
    getMovies: (page, filter) => dispatch(movieActions.getMovies(page, filter)),
    getGenres: () => dispatch(movieActions.getGenres()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
