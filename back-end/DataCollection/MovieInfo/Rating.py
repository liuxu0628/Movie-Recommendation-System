import pandas as pd

class Rating:

    def float_int(self, x):
        if not pd.isnull(x):
            return int(x)
        else:
            return x

    def padding(self, x):
        temp = str(x)
        lens = len(temp)
        if lens < 7:
            for i in range(0, 7-lens):
                temp = "0" + temp
                # print(i)
        temp = "tt" + temp
        return temp

    def read_rating(self, rating_path, link_path, write_path):
        rating = pd.read_csv(rating_path)
        result = pd.DataFrame()
        id = pd.read_csv(link_path)
        id = id.drop(['imdbId'], axis=1)
        len = rating.shape[0]
        temp = 0
        while temp < len - 1:
            min = temp
            if temp + 10000 < len - 1:
                max = temp + 10000
            else:
                max = len - 1
            rating_slice = rating.iloc[min: max]
            temp_result = rating_slice.merge(id, how='left', on='movieId')
            temp_result = temp_result.drop(['movieId', "Unnamed: 0"], axis=1)
            result = result.append(temp_result)
            print("\r" + 'processing %d out of %d items...' % (temp + 1, len), end='')
            temp = max
        result.to_csv(write_path)


if __name__ == '__main__':
    md = Rating()
    rating_path = 'Data/ratings.csv'
    link_path = 'Data/linkResults.csv'
    new_rating_path = 'Data/finalRatings.csv'
    md.read_rating(rating_path, link_path, new_rating_path)
