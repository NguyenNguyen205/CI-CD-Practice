import boto3
from boto3.dynamodb.conditions import Key, Attr
import json

dynamodb = boto3.resource('dynamodb', region_name='ap-southeast-2')

def remove_song(input_email, input_title):
    try:
        table = dynamodb.Table('login')

        response = table.get_item(
            Key={
                'email': input_email
            }
        )
        item = response['Item']
        
        curr = item['subscribed']
    
        curr.remove(input_title)
        if len(curr) == 0:
            table.update_item(
                Key={
                    'email': input_email
                },
                UpdateExpression='REMOVE subscribed',
            )
        else:
            table.update_item(
                Key={
                    'email': input_email
                },
                UpdateExpression='SET subscribed = :val1',
                ExpressionAttributeValues={
                    ':val1': curr
                }
            )
        
        return True
        
    except Exception as e:
        return str(e)


def check_register_details(input_email, input_user_name, input_password):
    login_table = dynamodb.Table('login')

    response = login_table.get_item(
        Key={
            'email': input_email,
        
        }
    )
    if 'Item' not in response.keys():
        # put item in db
        login_table.put_item(Item={
            'email': input_email,
            'user_name': input_user_name,
            'password': input_password
        })
        return True
    else:
        # notify user of identical
        return False
    
def check_login_details(input_email, input_password):
    try:
        login_table = dynamodb.Table('login')
        response = login_table.get_item(
            Key={
                'email': input_email,
            }
        )
        item = response['Item']
        if item['password'] == input_password:
            return [item['email'], item['user_name']]
        return False
    except Exception as e:
        print(e)
        return False
    
def subscribe(user_email, song):
    
    try: 
        table = dynamodb.Table('login')

        response = table.get_item(
            Key={
                'email': user_email
            }
        )
        item = response['Item']


        if 'subscribed' not in item:
            print("no songs")

            table.update_item(
                Key={
                    'email': user_email
                },
                UpdateExpression='SET subscribed = :val1',
                ExpressionAttributeValues={
                    ':val1': {song}
                }
            )
        else:
            curr = item['subscribed']
            curr.add(song)
            table.update_item(
                Key={
                    'email': user_email
                },
                UpdateExpression='SET subscribed = :val1',
                ExpressionAttributeValues={
                ':val1': curr
                }
            )
        new_response = table.get_item(
            Key={
                'email': user_email
            }
        )
        new_item = new_response['Item']
        return list(new_item['subscribed'])
    except Exception as e:
        return e
        


def lambda_handler(event, context):
    body = ""
    if (event['body']) and (event['body'] is not None):
        body = json.loads(event['body'])
    
    action = body['action']
    status = "failed"

    response_format = {
        'statusCode': 200,
        'headers':  {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        }
    }

    if action == 'register':
        email = body['email']
        username = body['username']
        password = body['password']

        if check_register_details(email, username, password):
            status = "success"
        else: 
            status = "failed"
        response_format['body'] = status
        return response_format
    
    elif action == 'login': 
        email = body['email']
        password = body['password']
        if check_login_details(email, password):
            response_format["body"] = "success"
            return response_format
        response_format['body'] = "failed"
        return response_format
    
    elif action == 'subscribe':
        email = body['email']
        song = body['title']

        if subscribe(email, song):
            response_format['body'] = subscribe(email, song)
            return response_format
        else:
            response_format['body'] = False
            return response_format
    elif action == 'remove':
        email = body['email']
        song = body['title']
        response_format['body'] = remove_song(email, song)
        return response_format
