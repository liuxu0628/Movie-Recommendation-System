import {
  local_axiosMovies as axios,
  tmdb_axiosMovies as tmdb
} from '../../axios';
import * as actionTypes from './actionTypes';

// get genre
export const getGenreStart = () => {
  return {
    type: actionTypes.GET_GENRE_START
  };
};

export const getGenreSuccess = genres => {
  return {
    type: actionTypes.GET_GENRE_SUCCESS,
    genres
  };
};

export const getGenreFail = error => {
  return {
    type: actionTypes.GET_GENRE_FAIL,
    error: error
  };
};

// get movie list
export const getMovieStart = () => {
  return {
    type: actionTypes.GET_MOVIE_START
  };
};

export const getMovieSuccess = (res, filters) => {
  const ms = res.map((r, i) => {
    return { [filters[i]]: r.data.results };
  });

  return {
    type: actionTypes.GET_MOVIE_SUCCESS,
    movies: ms,
    filters
  };
};

export const getMovieFail = error => {
  return {
    type: actionTypes.GET_MOVIE_FAIL,
    error: error
  };
};

// get movie detailed info
export const getMovieDetailStart = () => {
  return {
    type: actionTypes.GET_MOVIE_DETAIL_START
  };
};

export const getMovieDetailSuccess = res => {
  // let arr = ['movie', 'credits', 'recommendations']

  return {
    type: actionTypes.GET_MOVIE_DETAIL_SUCCESS,
    movie: res[0].data,
    credits: res[1].data,
    images: res[2].data,
    recommendations: res[3].data
  };
};

export const getMovieDetailFail = error => {
  return {
    type: actionTypes.GET_MOVIE_DETAIL_FAIL,
    error: error
  };
};

export const getMovies = requestData => {
  const filters = requestData.filters;

  const requests = filters.map(filter => {
    return axios.get(`/movie/${filter}/`, {
      params: { page: requestData.page }
    });
  });

  axios.get('https://www.cloudflare.com/cdn-cgi/trace').then(res => {
    console.log('ippppppppppppppppp', res.data);
  });

  return dispatch => {
    dispatch(getMovieStart());
    Promise.all(requests)
      .then(res => {
        dispatch(getMovieSuccess(res, filters));
      })
      .catch(err => {
        console.log('*****', err);
        dispatch(getMovieFail(err));
      });
  };
};

export const getMovieDetail = id => {
  const requests = [
    getMovie(id),
    getActors(id),
    getMovieImages(id),
    getRecommendations(id)
  ];

  console.log(requests);
  return dispatch => {
    dispatch(getMovieDetailStart());
    Promise.all(requests)
      .then(res => {
        console.log(res);
        dispatch(getMovieDetailSuccess(res));
      })
      .catch(err => {
        console.log('*****', err);
        dispatch(getMovieDetailFail(err));
      });
  };
};

export const getMovie = id => {
  return tmdb.get(`/movie/${id}`, {
    params: {}
  });
};

export const getActors = id => {
  return tmdb.get(`/movie/${id}/credits`, {
    params: { language: '' }
  });
};

export const getMovieImages = id => {
  return tmdb.get(`/movie/${id}/images`, {
    params: { language: 'null' }
  });
};

export const searchMovies = requestData => {
  return axios.get(`/search/movie`, {
    params: { query: requestData.query, page: requestData.page }
  });
};

export const getGenres = () => {
  return dispatch => {
    dispatch(getGenreStart());
    tmdb
      .get(`genre/movie/list`, { params: {} })
      .then(res => {
        console.log(res);
        console.log(res.data.genres);
        dispatch(getGenreSuccess(res.data.genres));
      })
      .catch(err => {
        console.log('*****', err);
        dispatch(getGenreFail(err));
      });
  };
};

export const getRecommendations = id => {
  return tmdb.get(`/movie/${id}/recommendations`, {
    params: {
      language: 'null',
      page: 1
    }
  });
};

export const userMovieStart = () => {
  return {
    type: actionTypes.USER_MOVIE_START
  };
};

export const userMovieRemove = (movie, token) => {
  return dispatch => {
    axios
      .delete('movie/info/userhistory/', {
        data: {
          token,
          userAction: movie.userAction,
          movie_idmovie: movie.idMovie
        }
      })
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          dispatch({
            type: actionTypes.USER_MOVIE_REMOVE,
            movie
          });
          dispatch(getMyRecommendation());
          dispatch(getMyRecommendation2());
        }
      })
      .catch(err => {
        console.log('*****', err);
      });
  };
};

export const userMovieSuccess = movie => {
  return {
    type: actionTypes.USER_MOVIE_SUCCESS,
    movie
  };
};

export const userMovieFail = error => {
  return {
    type: actionTypes.USER_MOVIE_FAIL,
    error
  };
};

// dispatch user movie action
export const userMovieAction = (movie, token) => {
  const href = window.location.href.split('/');
  const currentUrl = href[href.length - 1];

  return (dispatch, getState) => {
    dispatch(userMovieStart());

    if (!token) {
      return dispatch(userMovieFail('token not exist'));
    }

    axios
      .post('movie/info/userhistory/', {
        token,
        userAction: movie.userAction,
        movie_idmovie: movie.idMovie
      })
      .then(res => {
        if (res.status === 201 || res.status === 200) {
          dispatch(userMovieSuccess(movie));
          dispatch(getMyRecommendation());
          dispatch(getMyRecommendation2());
        } else {
          dispatch(userMovieFail(res));
        }
      })
      .catch(err => {
        dispatch(userMovieFail(err));
      });
  };
};

const getRecommendationStart = () => {
  return {
    type: actionTypes.GET_RECOMMENDATION_START
  };
};

const getRecommendationSuccess = movies => {
  return {
    type: actionTypes.GET_RECOMMENDATION_SUCCESS,
    movies
  };
};

const getRecommendationFail = error => {
  return {
    type: actionTypes.GET_RECOMMENDATION_FAIL,
    error
  };
};

export const getMyRecommendation = (pageNumber = 1) => {
  const href = window.location.href.split('/');
  const currentUrl = href[href.length - 1];

  return (dispatch, getState) => {
    dispatch(getRecommendationStart());

    const token = getState().auth.token;

    if (!token) {
      return dispatch(getRecommendationFail('token not exist'));
    }

    const like = getState()
      .userMovie.userMovies.filter(m => m.userAction)
      .map(i => parseInt(i.idMovie));
    const dislike = getState()
      .userMovie.userMovies.filter(m => !m.userAction)
      .map(i => parseInt(i.idMovie));

    console.log('^^^^^^^^^^', like, dislike);

    axios
      .post(`movie/recommendation/?page=${pageNumber}`, {
        token,
        like,
        dislike
      })
      .then(res => {
        if (res.status === 200) {
          dispatch(getRecommendationSuccess(res.data));

          if (currentUrl !== 'movies') {
            window.location.href = '/movies';
            // browserHistory.push('/movies')
          }
        } else {
          dispatch(getRecommendationFail(res));
        }
      })
      .catch(err => {
        dispatch(getRecommendationFail(err));
      });
  };
};

// ##########################################################
const getRecommendationStart2 = () => {
  return {
    type: actionTypes.GET_RECOMMENDATION_START2
  };
};

const getRecommendationSuccess2 = movies => {
  return {
    type: actionTypes.GET_RECOMMENDATION_SUCCESS2,
    movies
  };
};

const getRecommendationFail2 = error => {
  return {
    type: actionTypes.GET_RECOMMENDATION_FAIL2,
    error
  };
};

export const getMyRecommendation2 = (pageNumber = 1) => {
  const href = window.location.href.split('/');
  const currentUrl = href[href.length - 1];

  return (dispatch, getState) => {
    dispatch(getRecommendationStart2());

    const token = getState().auth.token;

    if (!token) {
      return dispatch(getRecommendationFail2('token not exist'));
    }

    const like = getState()
      .userMovie.userMovies.filter(m => m.userAction)
      .map(i => parseInt(i.idMovie));
    const dislike = getState()
      .userMovie.userMovies.filter(m => !m.userAction)
      .map(i => parseInt(i.idMovie));

    console.log('^^^^^^^^^^', like, dislike);

    axios
      .post(`movie/recommendation2/?page=${pageNumber}`, {
        token,
        like,
        dislike
      })
      .then(res => {
        if (res.status === 200) {
          dispatch(getRecommendationSuccess2(res.data));

          if (currentUrl !== 'movies') {
            window.location.href = '/movies';
            // browserHistory.push('/movies')
          }
        } else {
          dispatch(getRecommendationFail2(res));
        }
      })
      .catch(err => {
        dispatch(getRecommendationFail2(err));
      });
  };
};

// ##################################################//

export const getMovieSearch = keywords => {
  return (dispatch, getState) => {
    const token = getState().auth.token;
    dispatch(getMovieSearchStart());
    
    axios
      .post(`movie/search/`, {
        token,
        keywords
      })
      .then(res => {
        dispatch(getMovieSearchSuccess(res.data));
      })
      .catch(err => {
        console.log('*****', err);
        dispatch(getMovieSearchFail(err));
      });
  };
};



// get movie search list
export const getMovieSearchStart = () => {
  return {
    type: actionTypes.GET_MOVIE_SEARCH_START
  };
};

export const getMovieSearchSuccess = (res) => {
  return {
    type: actionTypes.GET_MOVIE_SEARCH_SUCCESS,
    movies: res.results,
  };
};

export const getMovieSearchFail = error => {
  return {
    type: actionTypes.GET_MOVIE_SEARCH_FAIL,
    error: error
  };
};