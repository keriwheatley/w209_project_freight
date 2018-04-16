from flask import Flask, render_template
import sqlite3
from flask import g
from flask import jsonify
from flask import request
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

@app.route("/outgoing")
def outgoing():
    dest = request.args.get('dest', '%')    
    origin = request.args.get('origin', '%')    
    commodity = request.args.get('commodity', '%')    
    year = request.args.get('year', 'all')    
    metric = request.args.get('metric', 'value')    


    if (year == 'all'):
        rows = query_db("select commodity,origin,dest,tons_total,value_total,curval_total,tmiles_total from commodities_by_origin where origin like ? AND dest like ? and commodity like ? order by "+ metric + "_total" +" desc limit 100", (origin, dest, "%" + commodity + "%"))
    elif (year == '2012'):
        rows = query_db("select commodity,origin,dest,tmiles_2012,tons_2012,value_2012 from commodities_by_origin where origin like ? AND dest like ? and commodity like ? order by "+ metric + "_2012 desc limit 100", (origin, dest, "%" + commodity + "%"))
    elif (year == '2013'):
        rows = query_db("select commodity,origin,dest,tmiles_2013,tons_2013,value_2013,curval_2013 from commodities_by_origin where origin like ? AND dest like ? and commodity like ? order by "+ metric + "_2013 desc limit 100", (origin, dest, "%" + commodity + "%"))
    elif (year == '2014'):
        rows = query_db("select commodity,origin,dest,tmiles_2014,tons_2014,value_2014,curval_2014 from commodities_by_origin where origin like ? AND dest like ? and commodity like ? order by "+ metric + "_2014 desc limit 100", (origin, dest, "%" + commodity + "%"))
    elif (year == '2015'):
        rows = query_db("select commodity,origin,dest,tmiles_2015,tons_2015,value_2015,curval_2015 from commodities_by_origin where origin like ? AND dest like ? and commodity like ? order by "+ metric + "_2015 desc limit 100", (origin, dest, "%" + commodity + "%"))
    else:
        return "not a year"

    return jsonify(rows)

@app.route("/incoming")
def incoming():
    dest = request.args.get('dest', '%')    
    origin = request.args.get('origin', '%')    
    commodity = request.args.get('commodity', '%')    
    year = request.args.get('year', 'all')    
    metric = request.args.get('metric', 'value')    

    if (year == 'all'):
        rows = query_db("select commodity,origin,dest, tons_total,value_total,curval_total,tmiles_total from commodities_by_dest where origin like ? AND dest like ? and commodity like ? order by " + metric + "_total" +" desc limit 100", (origin, dest, "%" + commodity + "%"))
    elif (year == '2012'):
        rows = query_db("select commodity,origin,dest,tmiles_2012,tons_2012,value_2012 from commodities_by_dest where origin like ? AND dest like ? and commodity like ? order by " + metric + "_2012" +" desc limit 100", (origin, dest, "%" + commodity + "%"))
    elif (year == '2013'):
        rows = query_db("select commodity,origin,dest,tmiles_2013,tons_2013,value_2013,curval_2013 from commodities_by_dest where origin like ? AND dest like ? and commodity like ? order by " + metric + "_2013" +" desc limit 100", (origin, dest, "%" + commodity + "%" ))
    elif (year == '2014'):
        rows = query_db("select commodity,origin,dest,tmiles_2014,tons_2014,value_2014,curval_2014 from commodities_by_dest where origin like ? AND dest like ? and commodity like ? order by " + metric + "_2014" +" desc limit 100", (origin, dest, "%" + commodity + "%"))
    elif (year == '2015'):
        rows = query_db("select commodity,origin,dest,tmiles_2015,tons_2015,value_2015,curval_2015 from commodities_by_dest where origin like ? AND dest like ? and commodity like ? order by " + metric + "_2015" +" desc limit 100", (origin, dest, "%" + commodity + "%"))
    else:
        return "not a year"

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

@app.route("/commodities/<commodity>")
def commodities(commodity):
    rows = query_db("select commodity,origin,origin_region,dest,dest_region,tmiles_2012,tmiles_2013,tmiles_2014,tmiles_2015,tons_2012,tons_2013,tons_2014,tons_2015,trade_type,value_2012,value_2013,value_2014,value_2015,curval_2013,curval_2014,curval_2015,tons_total,value_total,curval_total,tmiles_total from commodities_by_origin where commodity=? limit 50", (commodity,))
    return jsonify(rows)

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
    df = pd.read_csv("sql_data/commodities_by_origin_table.csv")
    df.to_sql("commodities_by_origin", db, if_exists='replace', index=False)
    df = pd.read_csv("sql_data/commodities_by_dest_table.csv")
    df.to_sql("commodities_by_dest", db, if_exists='replace', index=False)

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
