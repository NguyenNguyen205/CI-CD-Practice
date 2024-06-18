import boto3
import json

# Get the service resource.
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

# Create the DynamoDB table.


# def create_music_table():
#     login_table = dynamodb.create_table(
#         TableName='music',
#         KeySchema=[
#             {
#                 'AttributeName': 'title',
#                 'KeyType': 'HASH'
#             },
#             # {
#             #     'AttributeName': 'year',
#             #     'KeyType': 'RANGE'
#             # }
#         ],
#         AttributeDefinitions=[
#             {
#                 'AttributeName': 'title',
#                 'AttributeType': 'S'
#             },
#             # {
#             #     'AttributeName': 'year',
#             #     'AttributeType': 'S'
#             # }
#         ],
#         ProvisionedThroughput={
#             'ReadCapacityUnits': 10,
#             'WriteCapacityUnits': 10
#         }
#     )

#     # Wait until the table exists.
#     login_table.wait_until_exists()

#     # Print out some data about the table.
#     print(login_table.item_count)


def load_music_items():
    table = dynamodb.Table('music')
    with open('a1.json') as f:
        songs = json.load(f)['songs']
        count = 0

        for song in songs:
            count += 1
            table.put_item(
                Item={
                    'title': song['title'],
                    'artist': song['artist'],
                    'year': song['year'],
                    'web_url': song['web_url'],
                    'img_url': song['img_url']
                }
            )
    print("count ", count)
create_music_table()
load_music_items()