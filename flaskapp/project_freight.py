from flask import Flask, render_template
import sqlite3
from flask import g
from flask import jsonify
from flask import request
import pandas as pd

DATABASE = 'sqlite.db'
#DATABASE = '/~daniel.balck/w209/project_freight/sqlite.db'
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
    origin = request.args.get('origin', 'All')
    # dest = request.args.get('dest', 'All')
    metric = request.args.get('metric', 'value')    
    commodity = request.args.get('commodity', '%')    
    if (commodity == "All"): commodity = "%"
    year = request.args.get('year', 'all')    
    print origin

    if (year == 'all'):
        rows = query_db("""select origin,
                        sum(tons_total) as tons_total,
                        sum(value_total) as value_total,
                        sum(tmiles_total) as tmiles_total 
                        from commodities_by_origin 
                        where commodity like ? 
                        group by origin
                        order by """ + metric + "_total " + 
                        "desc limit 5", ["%" + commodity + "%"])
        if (origin != "All" ):
            current = query_db("""select origin,
                            sum(tons_total) as tons_total,
                            sum(value_total) as value_total,
                            sum(tmiles_total) as tmiles_total 
                            from commodities_by_origin 
                            where commodity like ? AND origin like ?
                            group by origin""",
                            ["%" + commodity + "%", "%" + origin + "%"])
            if (len(current) ==1 ):
                rows.append(current[0])
    elif (year == "2012"):
        rows = query_db("""select origin,
                        sum(tons_2012) as tons_2012,
                        sum(value_2012) as value_2012,
                        sum(tmiles_2012) as tmiles_2012 
                        from commodities_by_origin 
                        where commodity like ? 
                        group by origin
                        order by """ + metric + "_2012 " + 
                        "desc limit 5", ["%" + commodity + "%"])
        if (origin != "All" ):
            current = query_db("""select origin,
                            sum(tons_2012) as tons_2012,
                            sum(value_2012) as value_2012,
                            sum(tmiles_2012) as tmiles_2012 
                            from commodities_by_origin 
                            where commodity like ? AND origin like ?
                            group by origin""",
                            ["%" + commodity + "%", "%" + origin + "%"])
            if (len(current) == 1):
                rows.append(current[0])
    elif (year == "2013"):
        rows = query_db("""select origin,
                        sum(tons_2013) as tons_2013,
                        sum(value_2013) as value_2013,
                        sum(tmiles_2013) as tmiles_2013 
                        from commodities_by_origin 
                        where commodity like ? 
                        group by origin
                        order by """ + metric + "_2013 " + 
                        "desc limit 5", ["%" + commodity + "%"])
        if (origin != "All" ):
            current = query_db("""select origin,
                            sum(tons_2013) as tons_2013,
                            sum(value_2013) as value_2013,
                            sum(tmiles_2013) as tmiles_2013 
                            from commodities_by_origin 
                            where commodity like ? and origin like ?
                            group by origin""",
                            ["%" + commodity + "%", "%" + origin + "%"])
            if (len(current) ==1 ):
                rows.append(current[0])
    elif (year == "2014"):
        rows = query_db("""select origin,
                        sum(tons_2014) as tons_2014,
                        sum(value_2014) as value_2014,
                        sum(tmiles_2014) as tmiles_2014 
                        from commodities_by_origin 
                        where commodity like ? 
                        group by origin
                        order by """ + metric + "_2014 " + 
                        "desc limit 5", ["%" + commodity + "%"])
        if (origin != "All" ):
            current = query_db("""select origin,
                            sum(tons_2014) as tons_2014,
                            sum(value_2014) as value_2014,
                            sum(tmiles_2014) as tmiles_2014 
                            from commodities_by_origin 
                            where commodity like ? and origin like ?
                            group by origin""",
                            ["%" + commodity + "%", "%" + origin + "%"])
            if (len(current) ==1 ):
                rows.append(current[0])
    elif (year == "2015"):
        rows = query_db("""select origin,
                        sum(tons_2015) as tons_2015,
                        sum(value_2015) as value_2015,
                        sum(tmiles_2015) as tmiles_2015 
                        from commodities_by_origin 
                        where commodity like ? 
                        group by origin
                        order by """ + metric + "_2015 " + 
                        "desc limit 5", ["%" + commodity + "%"])
        if (origin != "All" ):
            current = query_db("""select origin,
                            sum(tons_2015) as tons_2015,
                            sum(value_2015) as value_2015,
                            sum(tmiles_2015) as tmiles_2015 
                            from commodities_by_origin 
                            where commodity like ? and origin like ?
                            group by origin""",
                            ["%" + commodity + "%", "%" + origin + "%"])
            if (len(current) ==1 ):
                rows.append(current[0])
    print rows
    return jsonify(rows)
#" )


    # if (dest == 'All'):
    #     dest = '%'
#     dest = "%"
#     origin = request.args.get('origin', 'Anywhere')    
#     if (origin == 'All'):
#         origin = 'Anywhere'
#     commodity = request.args.get('commodity', '%')    
#     if (commodity == 'All'):
#         commodity = '%'
#     year = request.args.get('year', 'all')    
#     metric = request.args.get('metric', 'value')    
#     print year
#     print metric 
#     print origin 
#     print dest 
# 
# 
#     if (year == 'all'):
#         if (origin == 'Anywhere'):
#             print "grouping by commodity"
#             rows = query_db("select origin,sum(tons_total) as tons_total ,sum(value_total) as value_total,sum(curval_total) as curval_total ,sum(tmiles_total) as tmiles_total from commodities_by_origin where commodity like ? group by origin order by  " + metric + "_total" + " desc limit 100", ["%" + commodity + "%"])
#         else:
#             rows = query_db("select commodity,origin,dest,tons_total,value_total,curval_total,tmiles_total from commodities_by_origin where origin like ? AND dest like ? and commodity like ? order by "+ metric + "_total" +" desc limit 100", (origin, dest, "%" + commodity + "%"))
#     elif (year == '2012'):
#         if (origin == 'Anywhere'):
#             rows = query_db("select origin,dest,sum(tons_2012) as tons_2012,sum(value_2012) as value_2012,sum(curval_2012) as curval_2012,sum(tmiles_2012) as tmiles_2012 from commodities_by_origin where commodity like ? group by origin, dest order by  " + metric + "_2012" + " desc limit 100", ["%" + commodity + "%"])
#         else:
#             rows = query_db("select commodity,origin,dest,tmiles_2012,tons_2012,value_2012 from commodities_by_origin where origin like ? AND dest like ? and commodity like ? order by "+ metric + "_2012 desc limit 100", (origin, dest, "%" + commodity + "%"))
#     elif (year == '2013'):
#         if (origin == 'Anywhere'):
#             rows = query_db("select origin,dest,sum(tons_2013) as tons_2013,sum(value_2013) as value_2013,sum(curval_2013) as curval_2013, sum(tmiles_2013) as tmiles_2013 from commodities_by_origin where commodity like ? group by origin, dest order by  " + metric + "_2013" + " desc limit 100", ["%" + commodity + "%"])
#         else:
#             rows = query_db("select commodity,origin,dest,tmiles_2013,tons_2013,value_2013,curval_2013 from commodities_by_origin where origin like ? AND dest like ? and commodity like ? order by "+ metric + "_2013 desc limit 100", (origin, dest, "%" + commodity + "%"))
#     elif (year == '2014'):
#         print "year is 2014"
#         rows = query_db("select commodity,origin,dest,tmiles_2014,tons_2014,value_2014,curval_2014 from commodities_by_origin where origin like ? AND dest like ? and commodity like ? order by "+ metric + "_2014 desc limit 100", (origin, dest, "%" + commodity + "%"))
#     elif (year == '2015'):
#         rows = query_db("select commodity,origin,dest,tmiles_2015,tons_2015,value_2015,curval_2015 from commodities_by_origin where origin like ? AND dest like ? and commodity like ? order by "+ metric + "_2015 desc limit 100", (origin, dest, "%" + commodity + "%"))
#     else:
#         return "not a year"
# 
    return jsonify(rows)

@app.route("/incoming")
def incoming():
    # origin = request.args.get('origin', 'All')
    dest = request.args.get('dest', 'All')
    metric = request.args.get('metric', 'value')    
    commodity = request.args.get('commodity', '%')    
    if (commodity == "All"): commodity = "%"
    year = request.args.get('year', 'all')    

    if (year == 'all'):
        rows = query_db("""select dest,
                        sum(tons_total) as tons_total,
                        sum(value_total) as value_total,
                        sum(tmiles_total) as tmiles_total 
                        from commodities_by_origin 
                        where commodity like ? 
                        group by dest 
                        order by """ + metric + "_total " + 
                        "desc limit 5", ["%" + commodity + "%"])
        if (dest != "All" ):
            current = query_db("""select origin,
                            sum(tons_total) as tons_total,
                            sum(value_total) as value_total,
                            sum(tmiles_total) as tmiles_total 
                            from commodities_by_dest 
                            where commodity like ? AND dest like ?
                            group by dest""",
                            ["%" + commodity + "%", "%" + dest + "%"])
            if (len(current) ==1 ):
                rows.append(current[0])
    elif (year == "2012"):
        rows = query_db("""select dest,
                        sum(tons_2012) as tons_2012,
                        sum(value_2012) as value_2012,
                        sum(tmiles_2012) as tmiles_2012 
                        from commodities_by_dest 
                        where commodity like ? 
                        group by dest
                        order by """ + metric + "_2012 " + 
                        "desc limit 5", ["%" + commodity + "%"])
        if (dest != "All" ):
            current = query_db("""select dest,
                            sum(tons_2012) as tons_2012,
                            sum(value_2012) as value_2012,
                            sum(tmiles_2012) as tmiles_2012 
                            from commodities_by_dest 
                            where commodity like ? AND dest like ?
                            group by dest""",
                            ["%" + commodity + "%", "%" + dest + "%"])
            if (len(current) ==1 ):
                rows.append(current[0])
    elif (year == "2013"):
        rows = query_db("""select dest,
                        sum(tons_2013) as tons_2013,
                        sum(value_2013) as value_2013,
                        sum(tmiles_2013) as tmiles_2013 
                        from commodities_by_dest 
                        where commodity like ? 
                        group by dest
                        order by """ + metric + "_2013 " + 
                        "desc limit 5", ["%" + commodity + "%"])
        if (dest != "All" ):
            current = query_db("""select dest,
                            sum(tons_2013) as tons_2013,
                            sum(value_2013) as value_2013,
                            sum(tmiles_2013) as tmiles_2013 
                            from commodities_by_dest 
                            where commodity like ? and dest like ?
                            group by dest""",
                            ["%" + commodity + "%", "%" + dest + "%"])
            if (len(current) ==1 ):
                rows.append(current[0])
    elif (year == "2014"):
        rows = query_db("""select dest,
                        sum(tons_2014) as tons_2014,
                        sum(value_2014) as value_2014,
                        sum(tmiles_2014) as tmiles_2014 
                        from commodities_by_dest 
                        where commodity like ? 
                        group by dest
                        order by """ + metric + "_2014 " + 
                        "desc limit 5", ["%" + commodity + "%"])
        if (dest != "All" ):
            current = query_db("""select dest,
                            sum(tons_2014) as tons_2014,
                            sum(value_2014) as value_2014,
                            sum(tmiles_2014) as tmiles_2014 
                            from commodities_by_dest 
                            where commodity like ? and dest like ?
                            group by dest""",
                            ["%" + commodity + "%", "%" + dest + "%"])
            if (len(current) ==1 ):
                rows.append(current[0])
    elif (year == "2015"):
        rows = query_db("""select dest,
                        sum(tons_2015) as tons_2015,
                        sum(value_2015) as value_2015,
                        sum(tmiles_2015) as tmiles_2015 
                        from commodities_by_dest 
                        where commodity like ? 
                        group by dest
                        order by """ + metric + "_2015 " + 
                        "desc limit 5", ["%" + commodity + "%"])
        if (dest != "All" ):
            current = query_db("""select dest,
                            sum(tons_2015) as tons_2015,
                            sum(value_2015) as value_2015,
                            sum(tmiles_2015) as tmiles_2015 
                            from commodities_by_dest 
                            where commodity like ? and dest like ?
                            group by dest""",
                            ["%" + commodity + "%", "%" + dest + "%"])
            if (len(current) ==1 ):
                rows.append(current[0])
    print rows
    return jsonify(rows)
#     if (year == 'all'):
#         rows = query_db("""select dest,
#                         sum(tons_total) as tons_total,
#                         sum(value_total) as value_total,
#                         sum(tmiles_total) as tmiles_total 
#                         from commodities_by_dest
#                         where commodity like ? 
#                         group by dest 
#                         order by """ + metric + "_total " + 
#                         "desc limit 100", ["%" + commodity + "%"])
#     elif (year == "2012"):
#         rows = query_db("""select dest,
#                         sum(tons_2012) as tons_2012,
#                         sum(value_2012) as value_2012,
#                         sum(tmiles_2012) as tmiles_2012 
#                         from commodities_by_dest
#                         where commodity like ? 
#                         group by dest 
#                         order by """ + metric + "_2012 " + 
#                         "desc limit 100", ["%" + commodity + "%"])
#     elif (year == "2013"):
#         rows = query_db("""select dest,
#                         sum(tons_2013) as tons_2013,
#                         sum(value_2013) as value_2013,
#                         sum(tmiles_2013) as tmiles_2013 
#                         from commodities_by_dest
#                         where commodity like ? 
#                         group by dest 
#                         order by """ + metric + "_2013 " + 
#                         "desc limit 100", ["%" + commodity + "%"])
#     elif (year == "2014"):
#         rows = query_db("""select dest,
#                         sum(tons_2014) as tons_2014,
#                         sum(value_2014) as value_2014,
#                         sum(tmiles_2014) as tmiles_2014 
#                         from commodities_by_dest
#                         where commodity like ? 
#                         group by dest 
#                         order by """ + metric + "_2014 " + 
#                         "desc limit 100", ["%" + commodity + "%"])
#     elif (year == "2015"):
#         rows = query_db("""select dest,
#                         sum(tons_2015) as tons_2015,
#                         sum(value_2015) as value_2015,
#                         sum(tmiles_2015) as tmiles_2015 
#                         from commodities_by_dest
#                         where commodity like ? 
#                         group by dest 
#                         order by """ + metric + "_2015 " + 
#                         "desc limit 100", ["%" + commodity + "%"])
# 
#     return jsonify(rows)

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
    #rows =  query_db()
    #return jsonify(rows)
    return None

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
