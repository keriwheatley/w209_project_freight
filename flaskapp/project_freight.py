from flask import Flask, render_template
import sqlite3
from flask import g
from flask import jsonify
import pandas as pd

DATABASE = 'sqlite.db'
app = Flask(__name__)

@app.route("/")
def dashboard():
    # file="about9.jpg"
    return render_template("dashboard.html")

@app.route("/states")
def states():
    rows = query_db("select state, value_total_exported, value_total_imported, curval_total_exported, curval_total_imported, tmiles_total_exported, tmiles_total_imported, tons_total_exported, tons_total_imported from states where commodity = 'all'")
    return jsonify(rows)

@app.route("/state/<target_state>")
def state(target_state):
    target_state = target_state.replace("_", " ")
    rows = query_db("select * from states where state = ?", (target_state.capitalize(),))
    obj = {}
    for row in rows:
        obj[row['commodity']] = {
            'value_total_exported': row['value_total_exported'],
            'value_total_imported': row['value_total_imported'],
            'curval_total_exported': row['curval_total_exported'],
            'curval_total_imported': row['curval_total_imported'],
            'tmiles_total_exported': row['tmiles_total_exported'],
            'tmiles_total_imported':row['tmiles_total_imported'],
            'tons_total_exported': row['tons_total_exported'],
            'tons_total_imported': row['tons_total_imported']
        }
    obj['state'] = target_state
    return jsonify(obj)

@app.route("/commodities")
def commodities():
    cur = get_db().cursor()
    return "commodities"

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def init_db():
    db = get_db()
    # with app.open_resource('schema.sql', mode='r') as f:
    #     db.cursor().executescript(f.read())
    # db.commit()

    df = pd.read_csv("sql_data/state_table.csv")
    df.to_sql("states", db, if_exists='replace', index=False)

@app.cli.command('initdb')
def initdb_command():
    """Initializes the database."""
    init_db()
    print('Initialized the database.')

def query_db(query, args=(), one=False):
    cur = get_db().execute(query, args)
    rv = cur.fetchall()
    cur.close()
    return (rv[0] if rv else None) if one else [dict(item) for item in rv]

if __name__ == "__main__":
    loaddb()
    app.run()
