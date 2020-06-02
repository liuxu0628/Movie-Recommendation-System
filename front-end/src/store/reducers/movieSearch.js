import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
  isFetching: false,
  movieSearch: [],
  error: null
};


const getMovieSearchStart = (state, action) => {
  return updateObject(state, {
    error: null,
    isFetching: true
  });
};

const getMovieSearchSuccess = (state, action) => {
  return updateObject(state, {
    movies: action.movies,
    isFetching: false,
    error: null
  });
};

const getMovieSearchFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    isFetching: false
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
      
    case actionTypes.GET_MOVIE_SEARCH_START:
      return getMovieSearchStart(state, action);
    case actionTypes.GET_MOVIE_SEARCH_SUCCESS:
      return getMovieSearchSuccess(state, action);
    case actionTypes.GET_MOVIE_SEARCH_FAIL:
      return getMovieSearchFail(state, action);

    default:
      return state;
  }
};

export default reducer;
