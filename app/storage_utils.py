from genericpath import isfile
import os
import cmd
import requests
from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential
import boto3
import json
import threading

client_s3 = boto3.client(
    's3',
    aws_access_key_id = '',
    aws_secret_access_key = '',
    aws_session_token = '',
    region_name = 'us-east-1'
)
keyVaultName = "keyVaultsForSecureCreds"
KVUri = f"https://{keyVaultName}.vault.azure.net"



def get_db_url():
    try:
        credential = DefaultAzureCredential()
        client = SecretClient(vault_url=KVUri, credential=credential)
        url = client.get_secret("databaseCredentials")
        print("dburl")
        print(url)
        return url
    except Exception as e:
        print(e)
        return ""
def get_s3_cred():
    try:
        credential = DefaultAzureCredential()
        client = SecretClient(vault_url=KVUri, credential=credential)
        url = client.get_secret("awscredurl")
        print("aws url")
        print(url)
        return url
    except Exception as e:
        print(e)
        return ""

def get_extracted_cred(cred):
    for a in range(0,len(cred)):
        if cred[a] == '=':
            a+=1
            return (cred[a:])


def save_file(name):
    try:  
        client_s3.upload_file(name,'elasticbeanstalk-us-east-1-937227286445','static/'+name)
        os.remove(name)
    except Exception as e:
        print(e)
        print("error occured while upload")

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

read_file()

class thread(threading.Thread):
    def __init__(self):
        threading.Thread.__init__(self)
    def run(self):
        print("thread started")
        check_aws_validity()

async_obj = thread()
async_obj.start() #42.54