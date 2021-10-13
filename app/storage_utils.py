import os
import requests
import boto3
import json
import threading
import time
import sched, time

client_s3 = boto3.client(
    's3',
    aws_access_key_id = '',
    aws_secret_access_key = '',
    aws_session_token = '',
    region_name = 'us-east-1'
)

def get_db_url():
    return os.environ['dburl']


def get_s3_cred():
    return os.environ['s3_creds']


def get_extracted_cred(cred):
    for a in range(0,len(cred)):
        if cred[a] == '=':
            a+=1
            return (cred[a:])

def save_file(name):
    try:  
        client_s3.upload_file(name,'elasticbeanstalk-us-east-1-937227286445','static/'+name)
        os.remove(name)
        return {'error':False}
    except Exception as e:
        print(e)
        if check_status():
            print('error saving')
            return {"error":True}
        else:
            #check_aws_validity()
            time.sleep(30)
            return save_file()

def read_file():
    if os.path.isfile("cred.txt"):
        print("file exists")
        f=open("cred.txt",'r')
        s=""
        for line in f:
            s=s+line
        try:
            res=json.loads(s)
            print("extracted------------------------------")
            print(get_extracted_cred(res[1]))
            print(get_extracted_cred(res[2]))
            print(get_extracted_cred(res[3]))

            new_client_s3 = boto3.client(
                's3',
                aws_access_key_id = get_extracted_cred(res[1]),
                aws_secret_access_key = get_extracted_cred(res[2]),
                aws_session_token = get_extracted_cred(res[3]),
                region_name = 'us-east-1'
            )
            global client_s3
            client_s3=new_client_s3
        except Exception as e:
            print(e)

def check_aws_validity():
    try:
        clientResponse = client_s3.list_buckets()
        print(clientResponse)
        print("creds are valid")
    except Exception as e:
        print(e)
        s=3
        #failed to conenct so fetch creds
        print("fetching fresh creds")
        r = requests.get(get_s3_cred())
        print("creds fetched")
        print(r.text)
        print(r.content)
        print(r.json())
        with open("cred.txt", 'w') as fd:
            fd.write(r.text)
        print("creds saved, calline read_file again")
        read_file()
        global flag_is_s3_fetch_running
        flag_is_s3_fetch_running=False

def check_status():
    try:
        clientResponse = client_s3.list_buckets()
        print(clientResponse)
        print("creds are valid")
        return True
    except Exception as e:
        print(e)
        return False

read_file()


class s3_cred_update_background(object):
    def __init__(self, interval=1200):
        self.interval = interval
        thread = threading.Thread(target=self.run, args=())
        thread.daemon = True
        thread.start()
    def run(self):
        while True:
            print('thred aws creds')
            check_aws_validity()
            time.sleep(self.interval)

update_thread = s3_cred_update_background()

