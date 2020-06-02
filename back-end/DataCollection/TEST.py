import pandas as pd
import pyspark
from pyspark.shell import sqlContext
from pyspark.sql import SparkSession

file_path = "MovieInfo/Data/finalRatings.csv"
write_path = "MovieInfo/Data/user-item.csv"
# df = pd.read_csv(file_path)
# print(df.shape)


spark = SparkSession \
    .builder \
    .appName("Python Spark create RDD example") \
    .config("spark.some.config.option", "some-value") \
    .getOrCreate()

spark.conf.set('spark.sql.pivotMaxValues', u'60000')

df = spark.read.format('com.databricks.spark.csv').options(header='true', inferschema='true').load(file_path, header=True)

df = df.drop("_c0")

df = df.groupBy("userId").pivot("tmdbId").sum("rating")

# df.save("MovieInfo/Data/user-item.csv", "com.databricks.spark.csv")

df.write.csv(path=write_path, header=True, sep=",", mode='overwrite')

# ratingMatrix = df.pivot_table(index=['userId'], values='rating', columns=['tmdbId'])
#
# print(ratingMatrix)