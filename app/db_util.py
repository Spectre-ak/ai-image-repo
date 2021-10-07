from pymongo import MongoClient
from pprint import pprint
import boto3
import storage_utils

client = MongoClient(storage_utils.get_db_url())
dbname = client.get_database()
print(dbname)
# Create a new collection
collection_name = dbname["images"]
print(collection_name)

item_details = collection_name.find()
for item in item_details:
    # This does not give a very readable output
    print(item)


def save_image_details(name,tags):
    storage_utils.save_file(name)
    print("saved url is ")
    print("https://elasticbeanstalk-us-east-1-937227286445.s3.amazonaws.com/static/"+name)
    data={"url":"https://elasticbeanstalk-us-east-1-937227286445.s3.amazonaws.com/static/"+name, "tags":tags}
    collection_name.insert_one(data)

