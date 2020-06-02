import pandas as pd
import requests as rq
import json
import time
import math


class CastDetail:

    def movie_casts(self, read_path, write_path):
        result = pd.DataFrame()
        movie_id = pd.read_csv(read_path)
        total = movie_id.shape[0]
        i = 0
        for id in movie_id['imdbId']:

            url_front = 'https://api.themoviedb.org/3/movie/'
            pay_load = {"api_key": "746243c68b299817578cb792ad88c647"}
            url = url_front + str(id) + '/credits'
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
            result = self.create_df(json_file, result)
            print("\r"+'processing %d out of %d items...' % (i + 1, total), end='')
            i += 1
        result = result.reset_index(drop=True)
        result.to_csv(write_path)

    def person_request(self, read_path, write_path):
        result = pd.DataFrame()
        casts = []
        person_id = pd.read_csv(read_path)
        for cast in person_id["cast"]:
            # print(cast)
            if not pd.isnull(cast):
                # print(cast)
                temp = cast.split(",")
                casts.extend(temp)
        for director in person_id["director"]:
            if not pd.isnull(director):
                # print(type(director), director)
                # print(int(director), str(int(director)))
                temp = director.split(',')
                casts.extend(temp)
        # for writer in person_id["writer"]:
        #     # print(type(writer), writer)
        #     if not pd.isnull(writer):
        #         temp = str(int(writer))
        #         casts.append(temp)

        casts = list(set(casts))
        #         # print(len(casts))
        #         # print(casts)
        i = 0
        total = len(casts)
        for id in casts:
            time.sleep(0.01)
            url_front = 'https://api.themoviedb.org/3/person/'
            pay_load = {"api_key": "746243c68b299817578cb792ad88c647"}
            url = url_front + id
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
            result = self.castsInfo_df(json_file, result)
            print("\r" + 'processing %d out of %d items...' % (i + 1, total), end='')
            i += 1
        result = result.reset_index(drop=True)
        result.to_csv(write_path)

    def castsInfo_df(self, json_file, result):
        json = self.castInfo_normalize(json_file)
        df = pd.DataFrame(json, index=[0])

        if result.empty:
            return df
        else:
            result = result.append(df)
            return result

    def castInfo_normalize(self, json_file):

        del json_file["also_known_as"]
        del json_file["popularity"]
        del json_file["adult"]
        del json_file["imdb_id"]
        del json_file["homepage"]

        return json_file

    def create_df(self, json_file, result):
        json = self.casts_normalize(json_file)
        df = pd.DataFrame(json, index=[0])

        if result.empty:
            return df
        else:
            result = result.append(df)
            return result

    def casts_normalize(self, json_file):
        temp = json_file.get("cast")
        if temp is not None:
            castIds = ""
            for i in temp:
                castIds += (str(i.get("id")) + ",")
            castIds = castIds[:-1]
            json_file["cast"] = castIds

        temp = json_file.get("crew")
        if temp is not None:
            director = ""
            for i in temp:
                if i.get("job") == "Director":
                    director += (str(i.get("id")) + ',')
            director = director[:-1]

            json_file["director"] = director

        del json_file["crew"]

        return json_file


if __name__ == '__main__':
    md = CastDetail()
    # link_path = 'Data/finalLinks.csv'
    cast_path = 'Data/casts.csv'
    # print("start getting casts info:")
    # md.movie_casts(link_path, cast_path)
    print("start collecting person detail info:")
    people_path = 'Data/personDetails.csv'
    md.person_request(cast_path, people_path)


