
# MRS - Data Collection

## Quick Start

```bash

1. create a new directory "Data/"，put the original "links.csv" and "ratings.csv" files in it.

# delete the "tmdbId" columns and add padding on "imdbId"
2. run Reformatting.py to generate newLinks.csv

# collect movie information based on the newLinks.csv
3.1 run DetailInof.py for movie detail informations.(movieDetails.csv)
3.2 run MovieImageInfo.py for movie posters and backdrops.(movieImages.csv)

# create the final link file (linkResults.csv)
4. run LinkProcessing.py to generate the final link result file, 
   which fills in the missing data of "tmdbId"

# request for cast information
5. run CastInfo.py (casts.csv, personDetails.csv)

# reformat the rating files, remove the movielens id.
6. run Rating.py(finalRatings.csv)

7. manually delete the temporary files (newLinks.csv, ratings.csv, links.csv, linkResults.csv)
```
