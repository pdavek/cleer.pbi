from flask import Flask, render_template, url_for, request, session, redirect, flash, jsonify
import os
import sqlite3
import hashlib
import uuid
import json
import time
from datetime import datetime, timedelta
from flask_session import Session

app = Flask(__name__)
app.secret_key = os.urandom(24)
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(hours=72)
app.config['SESSION_TYPE'] = 'filesystem'
app.config['SESSION_PERMANENT'] = True
app.config['SESSION_COOKIE_NAME'] = 'cleer_session_' + str(uuid.uuid4())  # Set session cookie name with 'cleer.' prefix

Session(app)

DATABASE = 'database.db'

# Function to create the database table if it doesn't exist
def create_database():
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users 
                 (id TEXT PRIMARY KEY, 
                  username TEXT UNIQUE, 
                  password TEXT, 
                  email TEXT, 
                  registration_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
                  last_login_time TIMESTAMP,
                  login_counter INTEGER DEFAULT 0,
                  serial_number INTEGER)''')
    conn.commit()
    conn.close()

# Function to get the next serial number for users
def get_next_serial_number():
    conn = sqlite3.connect(DATABASE)
    c = conn.cursor()
    c.execute("SELECT COALESCE(MAX(serial_number), 0) + 1 FROM users")
    serial_number = c.fetchone()[0]
    conn.close()
    return serial_number

# Homepage
@app.route('/')
def index():
    if 'username' in session:
        return render_template('index.html', username=session['username'])
    else:
        return redirect(url_for('login'))

# Login route
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = hashlib.sha256(request.form['password'].encode()).hexdigest()

        conn = sqlite3.connect(DATABASE)
        c = conn.cursor()
        c.execute("SELECT * FROM users WHERE username=? AND password=?", (username, password))
        user = c.fetchone()
        conn.close()

        if user:
            session['username'] = username
            return redirect(url_for('index'))
        else:
            return redirect(url_for('usernotfound'))

    return render_template('login.html')

# User not found route
@app.route('/usernotfound')
def usernotfound():
    return render_template('usernotfound.html')

# Upload job route
@app.route('/uploadjob')
def uploadjob():
    if session.get('username') == 'davek':
        return render_template('uploadjob.html')
    else:
        flash('You are not authenticated to upload jobs.')
        return redirect(url_for('index'))

# Upload job post route
@app.route('/upload_job', methods=['POST'])
def upload_job():
    if session.get('username') != 'davek':
        flash('You are not authenticated to upload jobs.')
        return redirect(url_for('index'))

    name = request.form['name']
    description = request.form['description']
    difficulty = request.form['difficulty']
    question = request.form['question']

    try:
        with open('static/jobs.json', 'r') as file:
            jobs = json.load(file)
    except FileNotFoundError:
        jobs = []

    id = len(jobs) + 1

    new_job = {
        "id": str(id),
        "name": name,
        "description": description,
        "difficulty": difficulty,
        "question": question
    }
    jobs.append(new_job)

    with open('static/jobs.json', 'w') as file:
        json.dump(jobs, file, indent=4)

    return 'Job added successfully!'

# Register route
@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = hashlib.sha256(request.form['password'].encode()).hexdigest()
        email = request.form['email']
        user_id = str(uuid.uuid4())
        serial_number = get_next_serial_number()

        conn = sqlite3.connect(DATABASE)
        c = conn.cursor()
        c.execute("INSERT INTO users (id, username, password, email, serial_number) VALUES (?, ?, ?, ?, ?)", 
                  (user_id, username, password, email, serial_number))
        conn.commit()
        conn.close()

        return redirect(url_for('index'))

    return render_template('register.html')

# Get current timestamp
def current_timestamp():
    return int(time.time())

# Generate unique ID
def generate_unique_id():
    return str(uuid.uuid4())

# Start timer for solving
def start_timer():
    session['start_time'] = datetime.now()

# Calculate elapsed time
def get_elapsed_time():
    start_time = session.get('start_time')
    if start_time:
        return datetime.now() - start_time
    else:
        return None
    


def create_user_interactions_table():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_interactions (
            id INTEGER PRIMARY KEY,
            session_id TEXT,
            username TEXT,
            question_id INTEGER,
            timestamp TIMESTAMP,
            FOREIGN KEY (username) REFERENCES users(username),
            FOREIGN KEY (question_id) REFERENCES jobs(id)
        )
    ''')
    conn.commit()
    conn.close()

def create_user_solutions_table():
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


@app.route('/start_solving', methods=['POST'])
def start_solving():
    session_id = session.sid
    username = session.get('username')
    question_id = request.json.get('questionId')
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')  # Get current date & time

    # Insert a new entry for every start_solving request
    conn = sqlite3.connect('user_interactions.db')
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO user_interactions (session_id, username, question_id, timestamp)
        VALUES (?, ?, ?, ?)
    ''', (session_id, username, question_id, current_time))
    conn.commit()
    conn.close()

    return jsonify(success=True)


@app.route('/done_and_submit', methods=['POST'])
def done_and_submit():
    session_id = session.sid
    username = session.get('username')
    question_id = request.json.get('questionId')
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')  # Get current date & time

    # Insert a new entry for every done_and_submit request
    conn = sqlite3.connect('user_interactions.db')
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO user_interactions (session_id, username, question_id, timestamp)
        VALUES (?, ?, ?, ?)
    ''', (session_id, username, question_id, current_time))
    conn.commit()
    conn.close()

    return jsonify(success=True)


# Function to insert user solution into user_solutions table
def insert_user_solution(question_id, username, user_input):
    # Fetch correct answer from jobs.json
    with open('static/jobs.json', 'r') as file:
        jobs = json.load(file)
    correct_answer = next((job['answer'] for job in jobs if job['id'] == question_id), None)

    # Determine result
    result = "correct" if user_input == correct_answer else "incorrect"
    current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    # Insert into user_solutions table
    conn = sqlite3.connect('user_interactions.db')
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO user_solutions (question_id, username, user_input, correct_answer, result, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (question_id, username, user_input, correct_answer, result, current_time))
    conn.commit()
    conn.close()

@app.route('/submit_solution', methods=['POST'])
def submit_solution():
    data = request.json
    question_id = data.get('questionId')
    user_input = data.get('userInput')
    username = session.get('username')
    

    insert_user_solution(question_id, username, user_input)

    return jsonify(success=True)

# Logout route
@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))

# Run the app
if __name__ == '__main__':
    create_database()
    create_user_solutions_table()
    app.run(debug=True)