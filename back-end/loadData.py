import os
import django
from django.db import transaction
import dateutil.parser

from datetime import datetime


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "movie.settings")
django.setup()
import pandas as pd
from movieinfo import models as movies


class LoadingData:
    """
    This class read data from .csv files and import them into the MySQL database through Django
    """

    def writeMovie(self, read_path):
        raw = pd.read_csv(read_path,
                 lineterminator='\n')
        count = 1
        total = raw.shape[0]
        for index, row in raw.iterrows():
            print("\r" +"##### Movie "+ 'processing %d out of %d items...' % (count, total), end='')
            count += 1
            with transaction.atomic():

                try:
                    movies.Movie.objects.get(idMovie=int(row["id"]))
                    continue
                except:
                    new_movie = movies.Movie.objects.create(idMovie=row["id"])

                    popularity = row["popularity"]
                    if not pd.isnull(popularity):
                        new_movie.popularity = popularity

                    vote_count = row["vote_count"]
                    if not pd.isnull(vote_count):
                        new_movie.vote_count = vote_count


                    poster_path = row["poster_path"]
                    if not pd.isnull(poster_path):
                        new_movie.poster_path = poster_path

                    backdrop_path = row["backdrop_path"]
                    if not pd.isnull(backdrop_path):
                        new_movie.backdrop_path = backdrop_path

                    new_movie.title = row["title"]

                    vote = row["vote_average"]
                    if not pd.isnull(vote):
                        new_movie.vote_average = vote

                    adult = row["adult"]
                    if not adult:
                        new_movie.adult = 0
                    else:
                        new_movie.adult = 1

                    country = row["production_countries"]
                    if not pd.isnull(country):
                        new_movie.country = country

                    releasedate = row["release_date"]
                    if not pd.isnull(releasedate):
                        new_movie.release_date = releasedate

                    overview = row["overview"]
                    if not pd.isnull(overview):
                        new_movie.overview = overview

                    new_movie.budget = row["budget"]

                    new_movie.revenue = row["revenue"]

                    collectionname = row["belongs_to_collection"]
                    if not pd.isnull(collectionname):
                        new_movie.collectionid = self.writeCollections(collectionname)

                    genres = row["genres"]
                    if not pd.isnull(genres):
                        genres = genres.split(",")
                        for genre in genres:
                            new_movie.genre.add(self.writegenre(genre))

                    companies = row["production_companies"]
                    if not pd.isnull(companies):
                        companies = companies.split(",")
                        for company in companies:
                            new_movie.company.add(self.writeCompany(company))
                    #
                    #
                    # if row["status"] == "Released":
                    #     new_movie.status = True
                    new_movie.save()

    # def writeStuff(self, read_path):
    #     raw = pd.read_csv(read_path)
    #     count = 1
    #     total = raw.shape[0]
    #     for index, row in raw.iterrows():
    #
    #         print("\r" +"##### Stuff " + 'processing %d out of %d items...' % (count, total), end='')
    #         count += 1
    #         department = row["known_for_department"]
    #         try:
    #             movies.People.objects.get(idperson=row["id"])
    #             continue
    #         except:
    #             with transaction.atomic():
    #                 new_person = movies.People.objects.create(idperson=row["id"])
    #
    #                 new_person.name = row["name"]
    #                 gender = row["gender"]
    #                 if gender == 0:
    #                     new_person.gender = "notspecified"
    #                 elif gender == 1:
    #                     new_person.gender = "female"
    #                 else:
    #                     new_person.gender = "male"
    #                 birthday = row["birthday"]
    #                 if not pd.isnull(birthday):
    #                     new_person.birthday = birthday
    #
    #                 deathday = row["deathday"]
    #                 if not pd.isnull(deathday):
    #                     if isinstance(deathday,str):
    #                         deathday = dateutil.parser.parse(deathday)
    #                     new_person.deathday = deathday.strftime('%Y-%m-%d')
    #
    #                 placeofbirth = row["place_of_birth"]
    #                 if not pd.isnull(placeofbirth):
    #                     new_person.birthplace = placeofbirth
    #
    #                 biography = row["biography"]
    #                 if not pd.isnull(biography):
    #                     new_person.biography = biography
    #
    #                 profile_path = row["profile_path"]
    #                 if not pd.isnull(profile_path):
    #                     new_person.profileimage = profile_path
    #
    #                 new_person.save()
    #
    # def writeimage(self, read_path):
    #     raw = pd.read_csv(read_path)
    #     count = 1
    #     total = raw.shape[0]
    #     for index, row in raw.iterrows():
    #         print("\r" +"##### Image " + 'processing %d out of %d items...' % (count, total), end='')
    #         count += 1
    #         try:
    #             movie = movies.Movie.objects.get(idmovie=row["id"])
    #         except:
    #             continue
    #         try:
    #             movies.Images.objects.get(backdrop=row["backdrop"], movie_idmovie=movie)
    #         except:
    #             with transaction.atomic():
    #                 backdrops = row["backdrops"]
    #                 if not pd.isnull(backdrops):
    #                     backdrops = backdrops.split(',')
    #                     for backdrop in backdrops:
    #                         new_image = movies.Images.objects.create(backdrop=backdrop, movie_idmovie=movie)
    #                         new_image.save()
    #
    # def writeCast(self, read_path):
    #     raw = pd.read_csv(read_path)
    #     count = 1
    #     total = raw.shape[0]
    #     for index, row in raw.iterrows():
    #         print("\r" +"##### Cast " + 'processing %d out of %d items...' % (count, total), end='')
    #         count += 1
    #         try:
    #             movie = movies.Movie.objects.get(idmovie=row["id"])
    #         except:
    #             continue
    #         with transaction.atomic():
    #             directors = row["director"]
    #             if not pd.isnull(directors):
    #                 directors = directors.split(",")
    #                 for director in directors:
    #                     try:
    #                         directorobj = movies.People.objects.get(idperson=director)
    #                         movie.directors.add(directorobj)
    #                     except:
    #                         print("Director Not existing")
    #
    #             stars = row["cast"]
    #             if not pd.isnull(stars):
    #                 stars = stars.split(",")
    #                 for star in stars:
    #                     try:
    #                         starobj = movies.People.objects.get(idperson=star)
    #                     except:
    #                         continue
    #                     movie.casts.add(starobj)


    # def writeTag(self, read_path):
    #     raw = pd.read_csv(read_path)
    #     count = 1
    #     total = raw.shape[0]
    #     for index, row in raw.iterrows():
    #         try:
    #             movie = movies.Movie.objects.get(idmovie=row["tmdbId"])
    #         except:
    #             continue
    #         try:
    #             tag = movies.Tags.objects.create(tag= row["tag"])
    #         except:
    #             tag = movies.Tags.objects.get(tag = row["tag"])
    #         movie.tags.add(tag)



    def writeRatings(self, read_path):
        raw = pd.read_csv(read_path,chunksize=200000)
        # filter = pd.read_csv("result.csv")['tmdbId']

        nochunk = 1

        for chunk in raw:
            count = 1
            total = chunk.shape[0]
            querylist = []
            for index, row in chunk.iterrows():
                print("\r"  +"##### Rating Chunk %d "% (nochunk)+'processing %d out of %d items...' % (count, total), end='')
                count += 1

                try:
                    with transaction.atomic():
                        movieid = row["tmdbId"]
                        if pd.notnull(movieid):
                            movie = movies.Movie.objects.get(idMovie=int(movieid))
                            try:
                                user = movies.User.objects.get(iduser=row["userId"])
                            except:
                                user = movies.User.objects.create(iduser=row["userId"])
                            querylist.append(movies.Ratings(movie_idmovie=movie, user_iduser=user
                                                                        ,rating = int(row["rating"] * 2)))
                except Exception as e:
                    print(e)

                    continue
            movies.Ratings.objects.bulk_create(querylist, ignore_conflicts=True)
            nochunk += 1

    def writegenre(self, genrename):
        try:
            genre = movies.Genre.objects.get(genrename=genrename)
            return genre
        except:
            with transaction.atomic():
                new_genre = movies.Genre.objects.create()
                new_genre.genrename = genrename
                new_genre.save()
            return new_genre



    # def writeImage(self, backdrop, movie):
    #     try:
    #         movies.Images.objects.get(movie_idmovie=movie, backdrop=backdrop)
    #     except:
    #         with transaction.atomic():
    #             new_images = movies.Images.objects.create(movie_idmovie=movie, backdrop=backdrop)
    #             new_images.save()

    def writeCompany(self, companyname):
        try:
            company = movies.Companies.objects.get(name=companyname)
            return company
        except:
            with transaction.atomic():
                new_company = movies.Companies.objects.create()
                new_company.name = companyname
                new_company.save()
            return new_company

    def writeCollections(self, collection):
        try:
            collection = movies.Collections.objects.get(name=collection)
            return collection
        except:
            with transaction.atomic():
                new_collection = movies.Collections.objects.create()
                new_collection.name = collection
                new_collection.save()
            return new_collection


if __name__ == '__main__':
    ld = LoadingData()

    # read_path = './DataCollection/MovieInfo/Data/personDetails.csv'
    # ld.writeStuff(read_path)

    # read_path = './DataCollection/MovieInfo/Data/movieDetails.csv'
    # ld.writeMovie(read_path)

    read_path = './DataCollection/MovieInfo/Data/movieDetails.csv'
    ld.writeMovie(read_path)
    
    # read_path = './DataCollection/MovieInfo/Data/casts.csv'
    # ld.writeCast(read_path)
    #
    # read_path = './DataCollection/MovieInfo/Data/movieImages.csv'
    # ld.writeimage(read_path)

    # read_path = './DataCollection/MovieInfo/Data/finalRatings.csv'
    # ld.writeRatings(read_path)
