import pandas as pd
import requests as rq
import json

class ImageRequest:

    def movie_image(self, read_path, write_path):
        result = pd.DataFrame()
        movie_id = pd.read_csv(read_path)
        total = movie_id.shape[0]
        i = 0
        for id in movie_id['imdbId']:
            url_front = 'https://api.themoviedb.org/3/movie/'
            pay_load = {"api_key": "746243c68b299817578cb792ad88c647"}
            url = url_front + str(id)+'/images'
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
            result = self.image_df(json_file, result)
            print("\r" + 'processing %d out of %d items...' % (i + 1, total), end='')
            i += 1
        result = result.reset_index(drop=True)
        result.to_csv(write_path)

    def image_normalize(self, json_file):
        temp = json_file.get("backdrops")
        if temp is not None:
            backdrops = ""
            count = 0
            for i in temp:
                if count > 5:
                    continue
                else:
                    backdrops += (i.get("file_path") + ",")
                    count += 1
            backdrops = backdrops[:-1]
            json_file["backdrops"] = backdrops

        temp = json_file.get("posters")
        if temp is not None:
            posters = ""
            if temp:
                i = temp[0]
                posters += i.get("file_path")
            json_file["posters"] = posters

        return json_file

    def image_df(self, json, result):
        json = self.image_normalize(json)
        df = pd.DataFrame(json, index=[0])

        if result.empty:
            return df
        else:
            result = result.append(df)
            return result

    def image_reformat(self, image_path, link_path, write_path):
        image = pd.read_csv(image_path)
        link = pd.read_csv(link_path)
        result = pd.merge(image, link, how='left', left_on='id', right_on='tmdbId')
        result = result.drop(['Unnamed: 0', 'tmdbId', 'movieId', 'imdbId'], axis=1)
        result.rename(columns={'id': 'tmdbId'})
        result.to_csv(write_path)

if __name__ == '__main__':
    ir = ImageRequest()
    read_path = 'Data/newLinks.csv'
    write_path = 'Data/movieImages.csv'
    ir.movie_image(read_path, write_path)
