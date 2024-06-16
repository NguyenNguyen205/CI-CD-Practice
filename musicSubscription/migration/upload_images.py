import json
import logging
import boto3
from botocore.exceptions import ClientError
import os
import requests
import re


def upload_file(file_name, bucket, object_name=None):
    if object_name is None:
        object_name = os.path.basename(file_name)

    # Upload the file
    s3_client = boto3.client('s3')
    try:
        response = s3_client.upload_file(file_name, bucket, object_name, 
                                        #  ExtraArgs={'Metadata': {'title': 'some title'}}
                                         )
    except ClientError as e:
        logging.error(e)
        return False
    return True



def download_upload_s3():
    # No repeating artist
    artists_set = set()
    with open('a1.json') as f:
        dictionary = json.load(f)
        songs = dictionary['songs']
        for song in songs:
            if song["artist"] in artists_set:
                continue
            artists_set.add(song["artist"])
            image_url = song["img_url"]
            img_data = requests.get(image_url).content
            pattern = ".*/(.*)\.jpg"
            author_name = (re.match(pattern=pattern, string=image_url).group(1))

            with open(f'{author_name}.jpg', 'wb') as handler:
                handler.write(img_data)
            
            bucket_name = "s3927198-music-images"
            file_name = author_name + ".jpg"

            if (upload_file(file_name=file_name, bucket=bucket_name)):
                print("Upload successful")
            os.remove(file_name)

if __name__ == "__main__":
    download_upload_s3()