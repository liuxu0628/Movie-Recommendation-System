import axios from "axios";
import config from "./config";

export const tmdb_axiosMovies = axios.create({
  baseURL: config.TMDB_API_URL,
  params: {
    api_key: config.MOVIE_DB_API_KEY,
    language: "en-US"
  }
});

export const local_axiosMovies = axios.create({
  baseURL: config.LOCAL_API_URL,
  params: {
    language: "en-US"
  }
});

tmdb_axiosMovies.interceptors.request.use(conf => {
  conf.params.api_key = config.MOVIE_DB_API_KEY;
  conf.params.language = conf.params.laguage;
  return conf
})
