import sqlite3

def delete_records(database_file, table_name, record_ids):
    try:
        conn = sqlite3.connect(database_file)
        cursor = conn.cursor()
        for record_id in record_ids:
            cursor.execute(f"DELETE FROM {table_name} WHERE id = ?", (record_id,))
        conn.commit()
        print("Records deleted successfully.")

    except sqlite3.Error as e:
        print("Error deleting records:", e)

    finally:
        if conn:
            conn.close()

database_file = "user_interactions.db"
table_name = "user_interactions" #"user_solutions" 
record_ids = []
for i in range(101):
    record_ids.append(i)
print(record_ids)

delete_records(database_file, table_name, record_ids)
