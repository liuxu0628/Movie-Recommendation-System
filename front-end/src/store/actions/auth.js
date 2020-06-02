// import axios from 'axios';
import { local_axiosMovies as axios } from '../../axios';
import * as actionTypes from './actionTypes';
import {getMyRecommendation, getMyRecommendation2} from './movie';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START
  };
};

export const authSuccess = (token, username) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token,
    username
  };
};

export const authFail = error => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  };
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  return {
    type: actionTypes.AUTH_LOGOUT
  };
};

export const checkAuthTimeout = expirationTime => {
  return dispatch => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const authLogin = (username, password) => {
  return dispatch => {
    dispatch(authStart());
    axios
      .post('users/login', {
        username_or_email: username,
        password: password
      })
      .then(res => {
        console.log(res);
        const token = res.data.token;
        const username = res.data.username;
        const expirationDate = new Date(new Date().getTime() + 36000 * 1000);
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        localStorage.setItem('expirationDate', expirationDate);
        dispatch(authSuccess(token, username));
        dispatch(getUserMovies(token));
        dispatch(checkAuthTimeout(36000));
      })
      .catch(err => {
        dispatch(authFail(err));
      });
  };
};

export const authSignup = (username, email, password, password2) => {
  return dispatch => {
    dispatch(authStart());
    axios
      .post('users/register', {
        username: username,
        email: email,
        password: password,
        password2: password2
      })
      .then(res => {
        const token = res.data.token;
        const username = res.data.username;
        const expirationDate = new Date(new Date().getTime() + 36000 * 1000);
        localStorage.setItem('token', token);
        localStorage.setItem('username', username);
        localStorage.setItem('expirationDate', expirationDate);
        dispatch(authSuccess(token, username));
        dispatch(checkAuthTimeout(36000));
      })
      .catch(err => {
        dispatch(authFail(err));
      });
  };
};

const getUserMoviesStart = () => {
  return {
    type: actionTypes.GET_USER_MOVIE_START
  };
};

const getUserMoviesSuccess = movie => {
  return {
    type: actionTypes.GET_USER_MOVIE_SUCCESS,
    movie
  };
};

const getUserMoviesFail = error => {
  return {
    type: actionTypes.GET_USER_MOVIE_FAIL,
    error: error
  };
};

export const getUserMovies = token => {
  const href = window.location.href.split('/');
  const currentUrl = href[href.length - 1];

  return dispatch => {
    dispatch(getUserMoviesStart());

    axios
      .post('movie/info/usermovies/', {
        token
      })
      .then(res => {
        dispatch(getUserMoviesSuccess(res.data));

        if(!res.data.length < 1 && currentUrl === 'movies'){
          dispatch(getMyRecommendation())
          dispatch(getMyRecommendation2())
        }
      })
      .catch(err => {
        dispatch(getUserMoviesFail(err));
      });
  };
};

export const authCheckState = () => {
  return dispatch => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (token === undefined) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        dispatch(authSuccess(token, username));
        dispatch(getUserMovies(token));
        dispatch(
          checkAuthTimeout(
            (expirationDate.getTime() - new Date().getTime()) / 1000
          )
        );
      }
    }
  };
};
