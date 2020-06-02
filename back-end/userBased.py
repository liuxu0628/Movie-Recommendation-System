import os
import random
from numpy import random as rd
from itertools import combinations, permutations
import django
from django.db import transaction

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "movie.settings")
django.setup()
import pandas as pd
from movieinfo import models as movies


class UserBased:
    """
    This is the implementation of user-based CF, data is read from MySQL database through Django
    """
    def split(self, numSplit, testSplit, seed):
        users = movies.User.objects.all().values_list("iduser",flat=True)
        test = []
        train = []
        effective = movies.Ratings.objects.exclude(rating__range=(3.5, 7.5))
        for user in users:
            numRating = effective.filter(user_iduser=user).count()
            if numRating >= 10:
                train.append(user)
            else:
                test.append(user)
        testSet = effective.filter(user_iduser__in=test)
        trainList = list(testSet.values_list("id", flat=True))

        for user in train:
            ratings = effective.filter(user_iduser=user)
            num = int(0.8 * ratings.count())
            ratingsList = list(ratings.order_by("?")[:num].values_list("id", flat=True))
            trainList = trainList + ratingsList
        trainSet = effective.filter(id__in=trainList)
        users = list(effective.distinct().values_list("user_iduser", flat=True))
        return trainSet, train, users

    def evaluate(self, result, user):
        hit = 0
        for movie in result:
            if movie in movies.Ratings.objects.filter(rating__gte=8, user_iduser=user):
                hit += 1
        total =movies.Ratings.objects.exclude(rating__range=(3.5, 7.5)).filter(user_iduser=user).count()
        try:
            precision = hit/len(result)
        except:
            precision = 0
        recall = hit/total
        if hit > 0:
            print("precision= "+precision)
        return precision,  recall

    def userFilter(self, trainSet, train, effectiveuser, k):
        movieList = movies.Movie.objects.all()

        df = pd.DataFrame(columns=effectiveuser)
        for user in effectiveuser:
            df.loc[user] = 0
        count = 1
        total = movieList.count()
        for movie in movieList:
            print("\r" + 'processing %d out of %d items...' % (count, total), end='')
            count += 1
            likers = trainSet.filter(movie_idmovie=movie.idmovie, rating__gte=8).values_list("user_iduser", flat=True)
            haters = trainSet.filter(movie_idmovie=movie.idmovie, rating__lte=3).values_list("user_iduser", flat=True)
            combs = list(combinations(likers, 2)) + list(combinations(haters, 2))
            for pair in combs:
                self.editMatrix(pair, df)

        for user in train:
            result = self.recommend(df, user, k)
            self.evaluate(result,user)


    def recommend(self, df, user, k):
        userColumn = df[[user]].sort_values(user, ascending=False)
        # print(userColumn)
        ranking = {}
        ratedhis = movies.Ratings.objects.filter(user_iduser=user)
        rated = ratedhis.values_list("movie_idmovie", flat=True)
        nu = ratedhis.exclude(rating__range=(3.5, 7.5)).count()
        for row in userColumn.itertuples():
            if row[1] == 0:
                break
            nv = movies.Ratings.objects.filter(user_iduser=row[0]).exclude(rating__range=(3.5, 7.5)).count()

            ranking[row[0]] = row[1] / ((abs(nv) * abs(nu)) ** 0.5)
        if ranking != {}:
            result = sorted(ranking.items(), key=lambda item: item[1], reverse=True)
            recommend = {}
            for i in range(k):
                userid = result[i][0]
                movielikes = movies.Ratings.objects.filter(user_iduser=userid, rating__gte=8).values_list(
                    "movie_idmovie", flat=True)
                for movie in movielikes:
                    if movie not in rated:
                        if movie in recommend:
                            recommend[movie] += 1
                        else:
                            recommend[movie] = 1
            recommendMovie = sorted(recommend.items(), key=lambda item: item[1], reverse=True)

            return recommendMovie

        return ranking

    def editMatrix(self, pair, df):
        df[pair[0]][pair[1]] += 1
        df[pair[1]][pair[0]] += 1


if __name__ == '__main__':
    ub = UserBased()
    trainSet, train, effectiveuser = ub.split(5, 1, 1)
    ub.userFilter(trainSet, train, effectiveuser, 2)
