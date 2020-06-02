from rest_framework import serializers

from movieinfo.models import *

class CreateUserHistorySerializer(serializers.ModelSerializer):

    user_iduser = serializers.SerializerMethodField(required = False)
    class Meta:
        model = UserHistory
        fields = '__all__'

    def get_user_iduser(self, obj):
        userID = self.context['user_id']
        return userID

    def get_unique_together_validators(self):
        """Overriding method to disable unique together checks"""
        return []

    def create(self, validated_data):
        user = User.objects.get(iduser=self.context['user_id'])
        userHistory, created = UserHistory.objects.update_or_create(
            user_iduser=user,
            movie_idmovie=validated_data.get('movie_idmovie', None),
            defaults={
                'userAction': validated_data.get('userAction', None),
            })

        return userHistory



class MovieInfoSerializer(serializers.ModelSerializer):


    class Meta:
        model = Movie
        # fields = ['total_page', 'results']
        fields = '__all__'


class RetrieveUserHistorySerializer(serializers.ModelSerializer):

    # user_movies = serializers.SerializerMethodField()
    title = serializers.SerializerMethodField()
    poster_path = serializers.SerializerMethodField()
    backdrop_path = serializers.SerializerMethodField()
    vote_average = serializers.SerializerMethodField()
    idMovie = serializers.CharField(source='movie_idmovie.idMovie')
     
    class Meta:
        model = UserHistory
        fields = ('idMovie', 'userAction', 'title', 'poster_path', 'backdrop_path', 'vote_average')

    # def get_user_movies(self, obj):
    #     movie_obj = obj.movie_idmovie
    #     movies = Movie.objects.filter(idMovie=movie_obj.idMovie)
    #     serializer = MovieInfoSerializer(instance=obj.movie_idmovie, read_only=True)
    #     return serializer.data

    def get_title(self, obj):
        movie_obj = obj.movie_idmovie
        data = Movie.objects.filter(idMovie=movie_obj.idMovie).values_list('title', flat=True)[0]
        return data
    
    def get_poster_path(self, obj):
        movie_obj = obj.movie_idmovie
        data = Movie.objects.filter(idMovie=movie_obj.idMovie).values_list('poster_path', flat=True)[0]
        return data
    
    def get_backdrop_path(self, obj):
        movie_obj = obj.movie_idmovie
        data = Movie.objects.filter(idMovie=movie_obj.idMovie).values_list('backdrop_path', flat=True)[0]
        return data

    def get_vote_average(self, obj):
        movie_obj = obj.movie_idmovie
        data = Movie.objects.filter(idMovie=movie_obj.idMovie).values_list('vote_average', flat=True)[0]
        return data


class MovieBriefSerializer(serializers.ModelSerializer):
    genre = serializers.SlugRelatedField(
        many=True, slug_field='genrename', read_only=True)
    rating_movie = serializers.SerializerMethodField()

    def get_rating_movie(self, obj):
        ratings = Ratings.objects.filter(
            user_iduser=self.context['iduser'], movie_idmovie=obj.idMovie)
        serializer = RatingSerializer(
            instance=ratings, many=True, read_only=True)
        # serializer.is_valid()
        return serializer.data

    class Meta:
        model = Movie
        fields = ('idMovie', 'title', 'poster_path',
                  'genre', 'adult', 'rating_movie')


class RatingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ratings
        fields = '__all__'


class CollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Collections
        fields = '__all__'


class MovieDetailSerializer(serializers.ModelSerializer):
    images = serializers.SlugRelatedField(
        many=True, slug_field='backdrop', read_only=True)
    company = serializers.SlugRelatedField(
        many=True, slug_field='name', read_only=True)
    genre = serializers.SlugRelatedField(
        many=True, slug_field='genrename', read_only=True)
    # casts = PeopleSerializer(many=True)
    # directors = PeopleSerializer(many=True)
    rating_movie = serializers.SerializerMethodField()
    collectionid = CollectionSerializer()

    def get_rating_movie(self, movie):
        ratings = Ratings.objects.filter(
            user_iduser=self.context['iduser'], movie_idmovie=movie)
        serializer = RatingSerializer(
            instance=ratings, many=True, read_only=True)
        return serializer.data

    class Meta:
        model = Movie
        fields = '__all__'


# class PeopleSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = People
#         fields = ('idperson', 'name', 'profileimage')
