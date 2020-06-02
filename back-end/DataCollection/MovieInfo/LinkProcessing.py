import pandas as pd
import requests as rq

class LinkProcessing:

    def float_int(self, x):
        return int(x)

    def read_link_file(self, old_path, new_path, write_path):
        link = pd.read_csv(old_path)
        new_link = pd.read_csv(new_path)
        result = link.merge(new_link, how='left', on='imdbId')
        result = result.drop(['Unnamed: 0_y', 'Unnamed: 0_x'], axis=1)
        result['tmdbId'] = result['tmdbId'].map(self.float_int)
        result.to_csv(write_path)

if __name__ == '__main__':
    id_path = 'Data/finalLinks.csv'
    newLink_path = 'Data/newLinks.csv'
    write_path = 'Data/linkResults.csv'
    lp = LinkProcessing()
    lp.read_link_file(id_path, newLink_path, write_path)
