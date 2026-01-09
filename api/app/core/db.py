import os
import boto3

def get_dynamodb():
    return boto3.resource("dynamodb")

def get_users_table():
    return get_dynamodb().Table(os.environ["USERS_TABLE"])