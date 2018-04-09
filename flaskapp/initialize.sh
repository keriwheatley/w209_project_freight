#! /bin/bash

export FLASK_APP=project_freight.py

if [ ! -d "venv" ]; then
  virtualenv venv
  # Control will enter here if $DIRECTORY exists.
fi

source venv/bin/activate
pip install pandas
pip install flask

if [ ! -d "static/js/config.js" ]; then
  echo 'options = { STATES_URL: "states" }' > static/js/config.js
fi

flask initdb
flask run
