import sqlite3
from datetime import datetime

conn = sqlite3.connect('user_interactions.db')
cursor = conn.cursor()
cursor.execute('''
    CREATE TABLE IF NOT EXISTS user_solutions (
        id INTEGER PRIMARY KEY,
        question_id INTEGER,
        username TEXT,
        user_input TEXT,
        correct_answer TEXT,
        result TEXT,
        timestamp TIMESTAMP
    )
''')
conn.commit()
conn.close()
