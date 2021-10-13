from pymongo import MongoClient
from pprint import pprint
import storage_utils
from operator import getitem

client = MongoClient(storage_utils.get_db_url())
dbname = client.get_database()
print(dbname)
# Create a new collection
collection_name = dbname["images"]
print(collection_name)

item_details = collection_name.find()
# imgs = []
# for item in item_details:
#     # This does not give a very readable output
#     print(item)
#     imgs.append({
#         "url":item["url"],
#         "tags":item["tags"]
#     })
# print(imgs)

def save_image_details(name,tags):
    storage_utils.save_file(name)
    print("saved url is ")
    print("https://elasticbeanstalk-us-east-1-937227286445.s3.amazonaws.com/static/"+name)
    url = "https://elasticbeanstalk-us-east-1-937227286445.s3.amazonaws.com/static/"+name
    data={"url":url, "tags":tags}
    collection_name.insert_one(data)
    print("inserted")
    return {"img":url, "tags":tags}

def get_saved_imgs():
    item_details = collection_name.find()
    imgs = {}
    for item in item_details:
        imgs[item["url"]]=item["tags"]
    return imgs

def get_saved_images_based_on_req_objs(objs_found):
    saved_imgs = get_saved_imgs()
    #print(saved_imgs)
    print("----------------------------------------------")
    print(objs_found)
    similar_imgs = {}
    for k,v in saved_imgs.items():
        saved_img_obj = []
        for obj in objs_found:
            if obj in v:
                saved_img_obj.append(obj)

        score = len(saved_img_obj)
        if score > 0:
            similar_imgs[k] = {
                "score":score,
                "objs":saved_img_obj
                }
    
    print(similar_imgs)
    similar_imgs = { k: v for k, v in sorted(similar_imgs.items(), key=lambda item: getitem(item[1], 'score'), reverse=True) }
    print("-------------------------------------------------AFter sortin g-------------------------------------")
    print(similar_imgs)
    print("converting dic to list")
    reorder_protected_json = []
    for k,v in similar_imgs.items():
        print(k)
        print(v)
        reorder_protected_json.append({k:v})
    print(reorder_protected_json)
    return reorder_protected_json


def check_s3_status():
    return {'status':storage_utils.check_status()};

