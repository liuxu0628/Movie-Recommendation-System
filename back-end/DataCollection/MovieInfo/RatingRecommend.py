import pandas as pd

class RatingRecommender:

    def pivot(self, rating_path, pivot_path):
        rating = pd.read_csv(rating_path, header=0, index_col=0)
        print("read rating done")
        pivot = rating.pivot_table(values='rating', index=['tmdbId'], columns=['userId'])
        print("pivot generated")
        pivot.to_csv(pivot_path)
        print("write done")

if __name__ == '__main__':
    rating_path = "Data/finalRatings.csv"
    pivot_path = "Data/pivot_rating.csv"
    rr = RatingRecommender()
    rr.pivot(rating_path, pivot_path)
