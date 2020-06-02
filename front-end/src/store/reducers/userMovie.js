import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
  isFetching: false,
  error: null,
  userAction: null,
  userMovies: []
};

const containObj = (obj, list) => {
  let result = false;
  // let ids = list.map(i => i.idMovie.toString())
  list.map(item => {
    if (obj.idMovie == item.idMovie) {
      result = true;
    }
  });
  return result;
};

const userMovieSuccess = (state, action) => {
  if (!containObj(action.movie, state.userMovies)) {
    return updateObject(state, {
      userMovies: [...state.userMovies, action.movie]
    });
  } else {
    return updateObject(state, {
      userMovies: state.userMovies
    });
  }
};

const userMovieRemove = (state, action) => {
  const newState = state.userMovies.filter(
    item => item.idMovie !== action.movie.idMovie
  );
  
  return updateObject(state, {
    userMovies: newState
  });
};

const userMovieFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
};


const getUserMovieStart = (state, action) => {
  return updateObject(state, {
    isFetching: true,
  });
};

const getUserMovieSuccess = (state, action) => {
  return updateObject(state, {
    isFetching: false,
    userMovies: action.movie
  });
};

const getUserMovieFail = (state, action) => {
  return updateObject(state, {
    isFetching: false,
    error: action.error
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.USER_MOVIE_REMOVE:
      return userMovieRemove(state, action);
    case actionTypes.USER_MOVIE_SUCCESS:
      return userMovieSuccess(state, action);
    case actionTypes.USER_MOVIE_FAIL:
      return userMovieFail(state, action);

    case actionTypes.GET_USER_MOVIE_START:
      return getUserMovieStart(state, action);
    case actionTypes.GET_USER_MOVIE_SUCCESS:
      return getUserMovieSuccess(state, action);
    case actionTypes.GET_USER_MOVIE_FAIL:
      return getUserMovieFail(state, action);

    default:
      return state;
  }
};

export default reducer;
