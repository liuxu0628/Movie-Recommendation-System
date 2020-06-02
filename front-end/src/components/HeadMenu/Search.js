import _ from 'lodash';
// import faker from 'faker';
import React, { Component } from 'react';
import { Search, Grid, Header, Segment } from 'semantic-ui-react';
import pic from '../../assets/images/m2.png';
import { connect } from 'react-redux';
import * as movieActions from '../../store/actions/movie';
import config from '../../config';

const source = _.times(6, () => ({
  title: 'hello world',
  description: 'people',
  image: pic,
  price: '$1,000,000'
}));

const initialState = { isLoading: false, results: [], value: '' };

const styles = {
  searchBar: {
    alignItems: 'center',
    display: 'flex'
  }
};
class SearchExampleStandard extends Component {
  state = initialState;

  handleResultSelect = (e, { result }) => {
    let selectMovie = Object.assign({ userAction: true }, result);

    this.setState({ value: result.title }, () => {
      this.props.userMovieAction(selectMovie, this.props.token);
    });
  };

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value }, () => {
      this.props.getMovieSearch(value);
    });
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.movieSearch !== nextProps.movieSearch) {
      let results = [];
      nextProps.movieSearch.forEach(item => {
        let newItem = {
          ...item,
          key: item.idMovie,
          description: item.release_date ? item.release_date : '',
          price: item.vote_average ? `${item.vote_average}` : '',
          image: item.backdrop_path
            ? `${config.small}${item.backdrop_path}`
            : `${config.small}${item.poster_path}`
        };
        delete newItem.adult;

        results.push(newItem);
      });

      this.setState({
        isLoading: false,
        results
      });
    }
  }

  render() {
    const { isLoading, value, results } = this.state;

    return (
      <Grid.Column width={12} style={styles.searchBar}>
        <style>
          {`
            .ui.search .prompt {
                border-radius: 500rem;
                width:50vw
            }

            .ui.search>.results {
              overflow-y: scroll;
              max-height: 500px
            }
        `}
        </style>
        <Search
          fluid
          loading={isLoading}
          onResultSelect={this.handleResultSelect}
          onSearchChange={_.debounce(this.handleSearchChange, 1000, {
            leading: true
          })}
          results={results}
          value={value}
        />
      </Grid.Column>
    );
  }
}

const mapStateToProps = state => {
  return {
    movies: state.movieBrowser.movies,
    userMovies: state.userMovie.userMovies,
    movieSearch: state.movieSearch.movies,
    token: state.auth.token
  };
};

const mapDispatchToProps = dispatch => ({
  userMovieAction: (movie, token) =>
    dispatch(movieActions.userMovieAction(movie, token)),
  getMovieSearch: keywords => dispatch(movieActions.getMovieSearch(keywords))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchExampleStandard);
