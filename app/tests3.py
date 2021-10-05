import boto3
import pandas
# Creating the low level functional client
client = boto3.client(
    's3',
    aws_access_key_id = 'ASIA5UNYZO6W6UNULJKG',
    aws_secret_access_key = 'i18WSmDetqK77V1Ly6QC7BSzYtJcJs/lM/99FTuR',
    #aws_session_token = 'FwoGZXIvYXdzEHgaDApP6VEGqD2S3VA9OSLEAR9uaZ016WB1k1AMgE887MN/fCxajfJ/R+2ra+FkN8bxdoDhXPX1GcthRYsNKGifoE+MuELLNI04r/FH2x6UQQzF6EpR8WeGijlEh3cs3W39f/KF7jrjSAqEQCNH/0Wap3KuwXvRkLwqy6pU/5GSYI8UrDGNlFsY0i8C+v6b7SPtgBDuG5Efki2qrbZghriKiTUF/TyLTBQ8/LE1jLqwhvK6t0t3j/27lWHtWOn1r6IylE/5K/a6pEcYoM3lTL5kweIK+Zco573VigYyLZGYjMShISrdOqmhz0TLFerpXPVkhPS7nO0d+1xNi3eVBSXQlJ5gyIZrDpa2CQ==',
    region_name = 'us-east-1'
)

# Fetch the list of existing buckets
clientResponse = client.list_buckets()
    
# Print the bucket names one by one
print('Printing bucket names...')
for bucket in clientResponse['Buckets']:
    print(f'Bucket Name: {bucket["Name"]}')

client.upload_file('run_model_memory.py','elasticbeanstalk-us-east-1-937227286445','tesiuyutpytohn.py')