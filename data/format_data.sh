#! /bin/bash

python create_commodity_tables.py FAF4.4.csv
cp commodities_by_* ../flaskapp/sql_data/
