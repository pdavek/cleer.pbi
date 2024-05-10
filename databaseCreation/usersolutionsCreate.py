import sqlite3

conn = sqlite3.connect('user_interactions.db')
cursor = conn.cursor()
cursor.execute('''
    CREATE TABLE IF NOT EXISTS user_solutions (
        id INTEGER PRIMARY KEY,
        question_id INTEGER,
        username TEXT,
        user_input TEXT,
        correct_answer TEXT,
        result TEXT
    )
''')
conn.commit()
conn.close()