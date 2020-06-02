import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
  isFetching: false,
  movies: [],
  genres: null,
  error: null
};

const getGenreStart = (state, action) => {
  return updateObject(state, {
    error: null,
    isFetching: true
  });
};

const getGenreSuccess = (state, action) => {
  return updateObject(state, {
    genres: action.genres,
    isFetching: false,
    error: null
  });
};

const getGenreFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    isFetching: false
  });
};

const getMovieStart = (state, action) => {
  return updateObject(state, {
    error: null,
    isFetching: true
  });
};

const getMovieSuccess = (state, action) => {
  return updateObject(state, {
    movies: action.movies,
    isFetching: false,
    error: null
  });
};

const getMovieFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    isFetching: false
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
      
    case actionTypes.GET_MOVIE_START:
      return getMovieStart(state, action);
    case actionTypes.GET_MOVIE_SUCCESS:
      return getMovieSuccess(state, action);
    case actionTypes.GET_MOVIE_FAIL:
      return getMovieFail(state, action);

    case actionTypes.GET_GENRE_START:
      return getGenreStart(state, action);
    case actionTypes.GET_GENRE_SUCCESS:
      return getGenreSuccess(state, action);
    case actionTypes.GET_GENRE_FAIL:
      return getGenreFail(state, action);

    default:
      return state;
  }
};

export default reducer;
