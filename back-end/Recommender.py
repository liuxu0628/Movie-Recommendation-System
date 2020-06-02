import pandas as pd
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "movie.settings")
django.setup()
from movieinfo import models as db


class recommender:
    """
    This is the real recommendation class. When this class instantiated, it read the .csv file of
    similar produced in createCsv.py into the memory. Then it can return recommanded movies list
    based on the input user history of like and dislike.
    """
    dislike_lim = 10

    def __init__(self):
        self.df = pd.read_csv("./genre/reco_genre.csv", index_col=0)
        # for df in self.list_dfs:
        #     print(df)

    def recommend(self, userHistory):

        notRecommend = []
        for movie in userHistory["dislike"]:
            dict =  self.df.loc[movie]
            result = [dict[i] for i in range(0, self.dislike_lim)]
            notRecommend = notRecommend + result
        notRecommend = [movie for movie in notRecommend if notRecommend.count(movie) == 1]
        notRecommend = notRecommend + userHistory["dislike"] + userHistory["like"]
        recommend = {}
        like_lim = 0
        recommend_list=[]

        if len(userHistory["like"]) == 1:
            movieid1 = userHistory["like"][0]
            try:
                movie = db.Movie.objects.get(idMovie=movieid1)
                collection = movie.collectionid
                if collection != None:
                    userHistory["like"] = list(db.Movie.objects.filter(collectionid=collection).\
                        values_list("idMovie", flat = True))

            except Exception as e:
                print(e)


        while len(recommend) < 100:
            recommend = {}
            like_lim += 5
            for movie in userHistory["like"]:
                dict = self.df.loc[movie]
                result = [dict[i] for i in range(0, like_lim)]
                for movieid in result:
                    if movieid in recommend.keys():
                        recommend[movieid] += 1
                    else:
                        recommend[movieid] = 1
            recommend = {k: v for k, v in sorted(recommend.items(), key=lambda item: item[1], reverse=True)}
            recommend_list = list(recommend.keys())
            recommend_list = [movie for movie in recommend_list if movie not in notRecommend]
            # recommend_list = list(set(recommend_list).difference(set(userHistory["like"])))
            # recommend_list = list(set(recommend_list).difference(set(userHistory["dislike"])))
        return recommend_list[:100]




reco = recommender()
his = {}
his["like"] = [155]
his["dislike"] = []
result = reco.recommend(his)
print((result))
