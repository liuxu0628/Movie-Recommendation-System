from django.http import Http404
from django.db.models import Case, When, Q
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.views import APIView
from rest_framework.generics import GenericAPIView, ListAPIView
from rest_framework.pagination import PageNumberPagination, LimitOffsetPagination, CursorPagination
from rest_framework.response import Response
from .models import *
from .serializers import *
from rest_framework_jwt.utils import jwt_decode_handler
from movie.pagination import CustomPagination
from .algorithm import TagProcessing
from Recommender import recommender
from functools import reduce
import operator


class MovieDetailAPI(APIView):
    serializer_class = MovieDetailSerializer

    def get_object(self, pk):
        try:
            return Movie.objects.get(pk=pk)
        except Movie.DoesNotExist:
            raise Http404

    def get(self, request, pk):

        snippet = self.get_object(pk)
        serializer = MovieDetailSerializer(snippet, context={'iduser': 1})
        # serializer.get_rating_movie(1)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # def post(self, request, format=None):
    #     movie_id = request.data
    #     serializer = RatingSerializer(data=movie_id)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MovieRecommendationAPI(GenericAPIView):
    serializer_class = MovieInfoSerializer
    pagination_class = CustomPagination
    queryset = Movie.objects.all()
    tp = TagProcessing()

    def post(self, request):
        decode_payload = jwt_decode_handler(request.data['token'])
        like = [int(item) for item in request.data['like']]
        dislike = [int(item) for item in request.data['dislike']]
        queryDict = {'like': like, 'dislike': dislike}

        # recomm_mids = self.re.recommend(queryDict)
        recomm_mids = self.tp.query_list(queryDict, 100)

        if not recomm_mids:
            return Response(status=status.HTTP_404_NOT_FOUND)

        preserved = Case(*[When(pk=pk, then=pos)
                           for pos, pk in enumerate(recomm_mids)])
        queryset = self.get_queryset().filter(pk__in=recomm_mids).order_by(preserved)
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.serializer_class(
                page, many=True, context={'user_id': decode_payload['user_id']})
            result = self.get_paginated_response(serializer.data)
            data = result.data  # pagination data
        else:
            serializer = self.serializer_class(
                page, many=True, context={'user_id': decode_payload['user_id']})
            data = serializer.data

        return Response(data, status=status.HTTP_200_OK)


class MovieRecommendationAPI2(GenericAPIView):
    serializer_class = MovieInfoSerializer
    pagination_class = CustomPagination
    queryset = Movie.objects.all()
    re = recommender()

    def post(self, request):
        decode_payload = jwt_decode_handler(request.data['token'])
        like = [int(item) for item in request.data['like']]
        dislike = [int(item) for item in request.data['dislike']]
        queryDict = {'like': like, 'dislike': dislike}

        recomm_mids = self.re.recommend(queryDict)

        if not recomm_mids:
            return Response(status=status.HTTP_404_NOT_FOUND)

        preserved = Case(*[When(pk=pk, then=pos)
                           for pos, pk in enumerate(recomm_mids)])
        queryset = self.get_queryset().filter(pk__in=recomm_mids).order_by(preserved)
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.serializer_class(
                page, many=True, context={'user_id': decode_payload['user_id']})
            result = self.get_paginated_response(serializer.data)
            data = result.data  # pagination data
        else:
            serializer = self.serializer_class(
                page, many=True, context={'user_id': decode_payload['user_id']})
            data = serializer.data

        return Response(data, status=status.HTTP_200_OK)


class MovieListAPI(GenericAPIView):
    serializer_class = MovieBriefSerializer
    pagination_class = CustomPagination
    queryset = Movie.objects.all()

    def get(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.serializer_class(
                page, many=True, context={'iduser': 1})
            result = self.get_paginated_response(serializer.data)
            data = result.data  # pagination data
        else:
            serializer = self.serializer_class(
                page, many=True, context={'iduser': 1})
            data = serializer.data

        return Response(data, status=status.HTTP_200_OK)


class TopRatedMovieAPI(GenericAPIView):
    serializer_class = MovieInfoSerializer
    pagination_class = CustomPagination
    queryset = Movie.objects.all().order_by('-vote_average', '-vote_count')

    def get(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.serializer_class(
                page, many=True,)
            result = self.get_paginated_response(serializer.data)
            data = result.data  # pagination data
        else:
            serializer = self.serializer_class(
                page, many=True)
            data = serializer.data

        return Response(data, status=status.HTTP_200_OK)


class RecentMovieAPI(GenericAPIView):
    serializer_class = MovieInfoSerializer
    pagination_class = CustomPagination
    queryset = Movie.objects.all().order_by('-release_date')

    def get(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.serializer_class(
                page, many=True,)
            result = self.get_paginated_response(serializer.data)
            data = result.data  # pagination data
        else:
            serializer = self.serializer_class(
                page, many=True)
            data = serializer.data

        return Response(data, status=status.HTTP_200_OK)


class PopularMovieAPI(GenericAPIView):
    serializer_class = MovieInfoSerializer
    pagination_class = CustomPagination
    queryset = Movie.objects.all().order_by('-popularity')

    def get(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.serializer_class(
                page, many=True,)
            result = self.get_paginated_response(serializer.data)
            data = result.data  # pagination data
        else:
            serializer = self.serializer_class(
                page, many=True)
            data = serializer.data

        return Response(data, status=status.HTTP_200_OK)


class MostWatchedMovieAPI(GenericAPIView):
    serializer_class = MovieInfoSerializer
    pagination_class = CustomPagination
    queryset = Movie.objects.all().order_by('-vote_count')

    def get(self, request):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.serializer_class(
                page, many=True,)
            result = self.get_paginated_response(serializer.data)
            data = result.data  # pagination data
        else:
            serializer = self.serializer_class(
                page, many=True)
            data = serializer.data

        return Response(data, status=status.HTTP_200_OK)


class CreateUserHistoryAPI(APIView):
    serializer_class = CreateUserHistorySerializer
    userhistory = UserHistory.objects.all()

    def delete(self, request):
        decode_payload = jwt_decode_handler(request.data['token'])
        serializer = self.serializer_class(data=request.data, context={
                                           'user_id': decode_payload['user_id']})
        userhistory = UserHistory.objects.get(
            user_iduser=decode_payload['user_id'], movie_idmovie=request.data['movie_idmovie'])

        if serializer.is_valid(raise_exception=True):
            userhistory.delete()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        decode_payload = jwt_decode_handler(request.data['token'])
        serializer = self.serializer_class(data=request.data, context={
                                           'user_id': decode_payload['user_id']})

        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RetrieveUserHistoryAPI(APIView):
    serializer_class = RetrieveUserHistorySerializer

    def post(self, request):
        decode_payload = jwt_decode_handler(request.data['token'])
        userhistory = UserHistory.objects.filter(
            user_iduser=decode_payload['user_id'])
        serializer = self.serializer_class(
            userhistory, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)


class SearchMovieAPI(GenericAPIView):
    serializer_class = MovieInfoSerializer
    pagination_class = CustomPagination
    queryset = Movie.objects.all()

    def get_queryset(self, keywords):
        """Return movies that contains keywords"""
        # lookups = reduce(operator.or_, (Q(title__icontains=x) for x in keywords if x))
        # return Movie.objects.all().filter(lookups).order_by('-popularity')
        
        return Movie.objects.all().filter(title__icontains=keywords).order_by('-popularity')
        
    def post(self, request):
        keywords=request.data['keywords']

        # print('\n\n---------->', self.get_queryset(keywords), '\n\n')

        queryset=self.filter_queryset(self.get_queryset(keywords))
        page=self.paginate_queryset(queryset)

        if page is not None:
            serializer=self.serializer_class(
                page, many=True,)
            result=self.get_paginated_response(serializer.data)
            data=result.data  # pagination data
        else:
            serializer=self.serializer_class(
                page, many=True)
            data=serializer.data

        return Response(data, status=status.HTTP_200_OK)


class RatingAPI(APIView):
    serializer_class=RatingSerializer

    def put(self, request):
        rating=request.data
        try:
            ratings=Ratings.objects.get(
                movie_idmovie=rating['movie_idmovie'], user_iduser=rating['user_iduser'])
            serializer=self.serializer_class(ratings, data=rating)
            serializer.is_valid(raise_exception=True)
        except:
            serializer=self.serializer_class(data=rating)
            serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )
