import pandas as pd
import numpy as np
import requests as rq

class Reformatting:

    def padding(self, x):
        temp = str(x)
        lens = len(temp)
        if lens < 7:
            for i in range(0, 7-lens):
                temp = "0" + temp
                # print(i)
        temp = "tt" + temp
        return temp

    def movie_casts(self, read_path, write_path):
        movie_id = pd.read_csv(read_path)
        movie_id['imdbId'] = movie_id['imdbId'].map(self.padding)
        movie_id = movie_id.drop(['tmdbId'], axis=1)
        movie_id.to_csv(write_path)


if __name__ == '__main__':

    md = Reformatting()
    read_path = 'Data/links.csv'
    write_path = 'Data/newLinks.csv'
    md.movie_casts(read_path, write_path)
