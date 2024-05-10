import sqlite3

def delete_record(database_file, table_name, record_id):
    try:
        conn = sqlite3.connect(database_file)
        cursor = conn.cursor()
        cursor.execute(f"DELETE FROM {table_name} WHERE id = ?", (record_id,))
        conn.commit()
        print(f"Record with id {record_id} deleted successfully.")

    except sqlite3.Error as e:
        print("Error deleting record:", e)

    finally:
        if conn:
            conn.close()

database_file = "user_interactions.db"

table_name = "user_interactions"
record_id = 41

delete_record(database_file, table_name, record_id)
