import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { createStore, compose, applyMiddleware, combineReducers } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";

import authReducer from "./store/reducers/auth";
import movieReducer from "./store/reducers/movie";
import movieDetailReducer from "./store/reducers/movieDetail";
import userMovieReducer from "./store/reducers/userMovie"; 
import recommendMovieReducer from "./store/reducers/recommendMovie"; 
import recommendMovieReducer2 from "./store/reducers/recommendMovie2"; 
import movieSearchReducer from "./store/reducers/movieSearch"; 

const composeEnhances = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  auth: authReducer,
  movieBrowser: movieReducer,
  movieDetail: movieDetailReducer,
  userMovie: userMovieReducer,
  recommendMovie: recommendMovieReducer,
  recommendMovie2: recommendMovieReducer2,
  movieSearch: movieSearchReducer
});

const store = createStore(rootReducer, composeEnhances(applyMiddleware(thunk)));

const app = (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));
registerServiceWorker();
