from datetime import datetime
import pandas as pd

from surprise import *


class createCsv:
    """"
    This class using the models produced by scikit-surprise to get 100 most similar movie to each of
    13700 movies, and save the result to the csv.
    """
    def createCsv(self):
        # for i in range(1, 20):
        #     print("genre %d start:" % i)
        #     (pred, algo) = dump.load("./KNNBasic/KNNBasic%d" % i)

            (pred, algo) = dump.load("./KNNBasic/KNNBasic")
            list = algo.trainset.all_items()
            list = [algo.trainset.to_raw_iid(inner) for inner in list]
            dict = {}
            dict["movieId"] = list

            df = pd.DataFrame(dict)
            df.set_index(["movieId"], inplace=True)
            # print(df)
            for j in range(0, 100):
                df[str(j)] = None
            # print(df)
            print("loading done")
            starttime = datetime.now()
            total = df.shape[0]
            progress = 1
            for movieid in df['0'].index:
                print("\r" + 'processing %d out of %d items...' % (progress, total),
                      end='')
                progress += 1
                reco = algo.get_neighbors(algo.trainset.to_inner_iid(movieid), k=100)
                reco = [algo.trainset.to_raw_iid(inner) for inner in reco]
                count = 0
                for movie in reco:
                    df[str(count)][movieid] = movie
                    count += 1
                # print(df)
            endtime = datetime.now()
            # df.to_csv("./genre/reco_genre%d.csv" % i)

            df.to_csv("./genre/reco_genre%d.csv")
            print("%d seconds" % (endtime - starttime).seconds)


if __name__ == '__main__':
    ub = createCsv()
    ub.createCsv()
