import boto3
from boto3.dynamodb.conditions import Key, Attr

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

'''
Code adapted from Boto3 documentation
https://boto3.amazonaws.com/v1/documentation/api/latest/index.html
'''

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

def search_music(input_title=None, input_year=None, input_artist=None):

    table = dynamodb.Table('music')


    if input_title.strip() != '':

        if input_year.strip() != '' and input_artist.strip() != '':

            response = table.scan(
                FilterExpression=Attr('year').eq(input_year) & Attr('artist').eq(input_artist) & Key('title').eq(input_title)
            )
        elif input_year.strip() != '':

            response = table.scan(
                FilterExpression=Attr('year').eq(input_year) & Key('title').eq(input_title)
            )
        elif input_artist.strip() != '':

            response = table.scan(
                FilterExpression=Attr('artist').eq(input_artist) & Key('title').eq(input_title)
            )
        else:

            response = table.scan(
                FilterExpression=Key('title').eq(input_title)
            )
    elif input_year.strip() != '':

        if input_artist.strip() != '':

            response = table.scan(
                FilterExpression=Attr('year').eq(input_year) & Attr('artist').eq(input_artist)
            )
        else:

            response = table.scan(
                FilterExpression=Attr('year').eq(input_year)
            )
    elif input_artist.strip() != '':
        response = table.scan(
            FilterExpression=Attr('artist').eq(input_artist)
        )
    else:
 
        print("Please provide at least one input parameter.")
        response = None

    if response:
        items = response['Items']
        return items

    return []


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
    dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
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
        return False
        


def lambda_handler(event, context):
    operation = event['httpMethod']
    if operation == "GET":
        if 'email' in event['params']['querystring']:
            email = event['params']['querystring']['email']
            table = dynamodb.Table('login')
            response = table.get_item(
                Key={
                    'email': email
                }
            )
            item = response['Item']
            if 'subscribed' not in item:
                return []
            return list(item['subscribed'])
        else:
            try:
                artist = event['params']['querystring']['artist']
            except KeyError:
                artist = ''
            try:
                title = event['params']['querystring']['title']
            except KeyError:
                title = ''
            try:
                year = event['params']['querystring']['year']
            except KeyError:
                year = ''
            res_items = search_music(title, year, artist)
            return res_items
    elif operation == "POST":
        action = event['action']

        if action == 'register':
            email = event['email']
            username = event['username']
            password = event['password']

            if check_register_details(email, username, password):
                return "success"
            return "failed"
        

        elif action == 'login': 
            email = event['email']
            password = event['password']
            if check_login_details(email, password):
                return check_login_details(email, password)
            return 'failed'
        
        elif action == 'subscribe':
            email = event['email']
            song = event['title']

            if subscribe(email, song):
                return subscribe(email, song)        
            else:
                return False
        elif action == 'remove':
            email = event['email']
            song = event['title']
            return remove_song(email, song)

    else:
        return (ValueError('Unsupported method "{}"'.format(operation)))
