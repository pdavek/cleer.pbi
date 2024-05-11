import sqlite3

def drop_table():
    conn = sqlite3.connect('user_interactions.db')
    cursor = conn.cursor()
    
    try:
        # Drop the user_stats table if it exists
        cursor.execute("DROP TABLE IF EXISTS user_stats")
        conn.commit()
        print("user_stats table dropped successfully.")
    except sqlite3.Error as e:
        print("Error dropping table:", e)
    
    conn.close()

if __name__ == '__main__':
    drop_table()
