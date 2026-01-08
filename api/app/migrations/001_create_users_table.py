# migrations/001_create_users_table.py
import boto3

def up():
    client = boto3.client('dynamodb', endpoint_url="http://localhost:8000")
    client.create_table(
        TableName='users-table',
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
            }
        ],
        ProvisionedThroughput={
            'ReadCapacityUnits': 5,
            'WriteCapacityUnits': 5
        }
        # ... configurações de chaves e GSI ...
    )

if __name__ == "__main__":
    up()