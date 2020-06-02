import pandas as pd
import requests as rq
import json

class MovieDetail:

    def padding(self, x):
        if pd.isnull(x):
            return ''
        temp = str(int(x))
        lens = len(temp)
        if lens < 7:
            for i in range(0, 7-lens):
                temp = "0" + temp
                # print(i)
        temp = "tt" + temp
        return temp

    def info_request(self, read_path, detail_path, id_path):
        Id_df = pd.DataFrame()
        result = pd.DataFrame()
        movie_id = pd.read_csv(read_path)
        total = movie_id.shape[0]
        i = 0
        for id in movie_id['imdbId']:
            url_front = 'https://api.themoviedb.org/3/movie/'
            pay_load = {"api_key": "746243c68b299817578cb792ad88c647"}
            url = url_front + str(id)
            r = rq.get(url, params=pay_load)
            try:
                json_file = r.json()
            except json.decoder.JSONDecodeError:
                print(r)
                continue
            temp = json_file.get("status_code")
            if temp is not None:
                print("\r" + 'processing %d out of %d items...' % (i + 1, total), end='')
                i += 1
                continue
            json_1 = json_file.copy()
            result = self.create_df(json_file, result)
            Id_df = self.link_df(json_1, Id_df, id)
            print("\r"+'processing %d out of %d items...' % (i + 1, total), end='')
            i += 1
        Id_df = Id_df.reset_index(drop=True)
        Id_df.to_csv(id_path)
        result = result.reset_index(drop=True)
        result.to_csv(detail_path)

    def create_df(self, json_file, result):
        json = self.movieInfo_normalize(json_file)
        df = pd.DataFrame(json, index=[0])

        if result.empty:
            return df
        else:
            result = result.append(df)
            return result

    def movieInfo_normalize(self, json_file):

        temp = json_file.get("belongs_to_collection")
        if temp is not None:
            collection = temp.get("name")
            json_file["belongs_to_collection"] = collection

        temp = json_file.get("genres")
        if temp is not None:
            genres = ""
            for i in temp:
                genres += (i.get("name") + ",")
            genres = genres[:-1]
            json_file["genres"] = genres

        temp = json_file.get("production_companies")
        if temp is not None:
            companies = ""
            for i in temp:
                companies += (i.get("name") + ",")
            companies = companies[:-1]
            json_file["production_companies"] = companies

        temp = json_file.get("production_countries")
        if temp is not None:
            countries = ""
            for i in temp:
                countries += (i.get("iso_3166_1") + ",")
            countries = countries[:-1]
            json_file["production_countries"] = countries

        del json_file["spoken_languages"]
        del json_file["tagline"]
        del json_file["video"]
        # del json_file["vote_average"]
        # del json_file["vote_count"]
        # del json_file["popularity"]
        del json_file["original_title"]
        del json_file["original_language"]
        # del json_file['imdb_id']
        # print(json_file)

        return json_file

    def link_df(self, json_file, id_df, id):
        json = self.id_normalize(json_file, id)
        df = pd.DataFrame(json, index=[0])

        if id_df.empty:
            return df
        else:
            id_df = id_df.append(df)
            return id_df

    def id_normalize(self, json_file, id):
        del json_file['adult']
        del json_file['backdrop_path']
        del json_file['belongs_to_collection']
        del json_file['budget']
        del json_file['genres']
        del json_file['homepage']
        del json_file['imdb_id']
        del json_file['original_language']
        del json_file['original_title']
        del json_file["overview"]
        del json_file["popularity"]
        del json_file["poster_path"]
        del json_file["production_companies"]
        del json_file["production_countries"]
        del json_file["release_date"]
        del json_file["revenue"]
        del json_file["runtime"]
        del json_file['spoken_languages']
        del json_file['status']
        del json_file['tagline']
        del json_file['title']
        del json_file['video']
        del json_file['vote_average']
        del json_file['vote_count']
        json_file['tmdbId'] = json_file.get('id')
        json_file['imdbId'] = id
        del json_file['id']
        return json_file

if __name__ == '__main__':
    md = MovieDetail()
    read_path = 'Data/newLinks.csv'
    detail_path = 'Data/movieDetails.csv'
    id_path = 'Data/finalLinks.csv'
    md.info_request(read_path, detail_path, id_path)