import pandas as pd


class filter:
    def filter(self, read_path):
        raw = pd.read_csv(read_path)
        print("Load finish")
        result = raw.groupby("tmdbId")["rating"].count().reset_index(name="count")
        result = result.sort_values(["count"],ascending=False).head(20000)
        result.to_csv("result.csv")


if __name__ == '__main__':
    f = filter()
    f.filter("./DataCollection/MovieInfo/Data/finalRatings.csv")
