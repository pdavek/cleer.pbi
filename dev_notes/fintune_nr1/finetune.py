from openai import OpenAI

client = OpenAI(api_key='sk-proj-h2YMv0GNHL4y9mLZqMMOT3BlbkFJgyhhlaq0QqaiGawllj0Q')
import dotenv
import os


def open_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as infile:
        return infile.read()

def save_file(filepath, content):
    with open(filepath, 'a', encoding="utf-8") as outfile:
        outfile.write(content)

api_key=''

file_id = 'file-OXKOZBWTCLUnjeMD9fYIngdG'
model_name = "gpt-3.5-turbo"

response = client.fine_tuning.jobs.create(
    training_file=file_id,
    model=model_name    
)

print(response)


id='ftjob-uw3GlyGDXi2UXMZjxKGso5B5'
