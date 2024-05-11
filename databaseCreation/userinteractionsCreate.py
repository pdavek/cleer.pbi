import sqlite3

# Connect to the SQLite database
conn = sqlite3.connect('user_interactions.db')
cursor = conn.cursor()

# Create a table to store user interactions
cursor.execute('''
    CREATE TABLE IF NOT EXISTS user_interactions (
        id INTEGER PRIMARY KEY,
        session_id TEXT,
        username TEXT,
        question_id INTEGER,
        job_id INTEGER,
        timestamp TIMESTAMP
    )
''')

conn.commit()
conn.close()
