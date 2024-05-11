import sqlite3

# Connect to the SQLite database
conn = sqlite3.connect('user_interactions.db')
cursor = conn.cursor()

# Create a table to store user interactions
cursor.execute('''
    CREATE TABLE IF NOT EXISTS user_stats (
        id INTEGER PRIMARY KEY,
        username TEXT,
        total_solves INTEGER,
        correct_solves INTEGER
    )
''')

conn.commit()
conn.close()
