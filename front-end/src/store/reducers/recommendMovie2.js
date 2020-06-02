import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
  isFetching: false,
  next: null,
  previous: null,
  total_page: null,
  current_page: null,
  movies: [],
  error: null
};

const getRecommendationStart2 = (state, action) => {
  return updateObject(state, {
    isFetching: true,
    error: null,
  });
};

const getRecommendationSuccess2 = (state, action) => {
  const movies = action.movies
  return updateObject(state, {
    movies: movies.results,
    isFetching: false,
    next: movies.links ? movies.links.next : null,
    previous: movies.link ? movies.link.previous : null,
    total_page: movies.page_number ? movies.page_number : null,
    current_page: movies.current ? movies.current : null,
    error: null
  });
};

const getRecommendationFail2 = (state, action) => {
  return updateObject(state, {
    error: action.error,
    isFetching: false
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_RECOMMENDATION_START2:
      return getRecommendationStart2(state, action);
    case actionTypes.GET_RECOMMENDATION_SUCCESS2:
      return getRecommendationSuccess2(state, action);
    case actionTypes.GET_RECOMMENDATION_FAIL2:
      return getRecommendationFail2(state, action);

    default:
      return state;
  }
};

export default reducer;
