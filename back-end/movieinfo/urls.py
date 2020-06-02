from django.contrib import admin
from django.urls import path, include
from .api import *

urlpatterns = [
  path('movies/', MovieListAPI.as_view()),
  path('top_rated/', TopRatedMovieAPI.as_view()),
  path('recent/', RecentMovieAPI.as_view()),
  path('popular/', PopularMovieAPI.as_view()),
  path('most_watched/', MostWatchedMovieAPI.as_view()),
  path('recommendation/', MovieRecommendationAPI.as_view()),
  path('recommendation2/', MovieRecommendationAPI2.as_view()),

  path('info/<int:pk>/', MovieDetailAPI.as_view()),
  path('info/rating/', RatingAPI.as_view()),
  path('info/userhistory/', CreateUserHistoryAPI.as_view()),
  path('info/usermovies/', RetrieveUserHistoryAPI.as_view()),

  path('search/', SearchMovieAPI.as_view()),

]
