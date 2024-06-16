import boto3

# Get the service resource.
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

# Create the DynamoDB table.


def create_login_table():
    login_table = dynamodb.create_table(
        TableName='login',
        KeySchema=[
            {
                'AttributeName': 'email',
                'KeyType': 'HASH'
            },

        ],
        AttributeDefinitions=[
            {
                'AttributeName': 'email',
                'AttributeType': 'S'
            },
        ],
        ProvisionedThroughput={
            'ReadCapacityUnits': 5,
            'WriteCapacityUnits': 5
        }
    )

    # Wait until the table exists.
    login_table.wait_until_exists()

    # Print out some data about the table.
    print(login_table.item_count)


def put_login_items():
    table = dynamodb.Table('login')
    sid = 's3927198'
    email_tail = '@student.rmit.edu.au'

    def generate_pattern():
        pattern = ""
        for i in range(10):
            for j in range(6):
                pattern += str((i + j) % 10)
            pattern += ", "
        return pattern[:-2].split(', ') 

    s = generate_pattern()

    for i in range(10):
        table.put_item(
            Item={
                'email': f'{sid}{i}{email_tail}',
                'user_name': f'Quang{i}',
                'password': s[i]
            }
        )


create_login_table()
put_login_items()
