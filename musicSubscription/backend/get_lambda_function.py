import boto3
from boto3.dynamodb.conditions import Key, Attr

dynamodb = boto3.resource('dynamodb', region_name='ap-southeast-2')

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

def lambda_handler(event, context):
    # body = ""
    # if (event['body']) and (event['body'] is not None):
    #     body = json.loads(event['body'])
    
    # action = body['action']
    # status = "failed"
    queryStringParams = event['queryStringParameters']
    response_format = {
        'statusCode': 200,
        'headers':  {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        }
    }

    if queryStringParams is None:
        response_format['body'] = "No queries"
        return response_format

    if 'email' in queryStringParams:
        email = queryStringParams['email']
        table = dynamodb.Table('login')
        response = table.get_item(
            Key={
                'email': email
            }
        )
        item = response['Item']
        if 'subscribed' not in item:
            response_format['body'] = []
            return response_format
        response_format['body'] = list(item['subscribed'])
        return response_format
    else:
        try:
            artist = queryStringParams['artist']
        except KeyError:
            artist = ''
        try:
            title = queryStringParams['title']
        except KeyError:
            title = ''
        try:
            year = queryStringParams['year']
        except KeyError:
            year = ''
        res_items = search_music(title, year, artist)
        response_format['body'] = res_items
        return response_format