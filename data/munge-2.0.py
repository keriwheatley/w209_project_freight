import pandas as pd
import sys 


def generate_exports(df):
    domestic_bystate_all = df.groupby(['origin_state', 'dest_state', 'commodity', ])['tons', 'value', 'curval'].sum()
    domestic_bystate_2013 = df.groupby(['origin_state', 'dest_state', 'commodity', ])['tons_2013', 'value_2013', 'curval_2013'].sum()
    domestic_bystate_2014  = df.groupby(['origin_state', 'dest_state', 'commodity', ])['tons_2014', 'value_2014', 'curval_2014'].sum()
    domestic_bystate_2015 = df.groupby(['origin_state', 'dest_state', 'commodity', ])['tons_2015', 'value_2015', 'curval_2015'].sum()
    domestic_bystate_all = domestic_bystate_all.reset_index()

    commodity_tables = {}
    commodity_list = domestic_bystate_all.commodity.unique() 
    for commodity in commodity_list:
        commodity_tables[commodity] = domestic_bystate_all[domestic_bystate_all.commodity == commodity]

    domestic_bystate_all.loc[:, 'commodity'] = 'any'
    domestic_bystate_all = domestic_bystate_all.groupby(['origin_state', 'dest_state', 'commodity', ])['tons', 'value', 'curval'].sum()
    domestic_bystate_all = domestic_bystate_all.reset_index()
    commodity_tables['all'] = domestic_bystate_all

    for c in commodity_tables:
        for metric in ['value', 'curval', 'tons']:
            table = commodity_tables[c].pivot(index='origin_state', columns='dest_state', values=metric)
            table.to_csv("outgoing/" + c.replace(" ", "_").replace("/", "_") + '_' + metric + '.csv')

def generate_imports(df):
    domestic_bystate_all = df.groupby(['dest_state','origin_state', 'commodity', ])['tons', 'value', 'curval'].sum()
    domestic_bystate_2013 = df.groupby(['dest_state','origin_state',  'commodity', ])['tons_2013', 'value_2013', 'curval_2013'].sum()
    domestic_bystate_2014  = df.groupby([ 'dest_state', 'origin_state', 'commodity', ])['tons_2014', 'value_2014', 'curval_2014'].sum()
    domestic_bystate_2015 = df.groupby(['dest_state','origin_state', 'commodity', ])['tons_2015', 'value_2015', 'curval_2015'].sum()
    domestic_bystate_all = domestic_bystate_all.reset_index()

    commodity_tables = {}
    commodity_list = domestic_bystate_all.commodity.unique() 
    for commodity in commodity_list:
        commodity_tables[commodity] = domestic_bystate_all[domestic_bystate_all.commodity == commodity]

    domestic_bystate_all.loc[:, 'commodity'] = 'any'
    domestic_bystate_all = domestic_bystate_all.groupby(['dest_state', 'origin_state', 'commodity', ])['tons', 'value', 'curval'].sum()
    domestic_bystate_all = domestic_bystate_all.reset_index()
    commodity_tables['all'] = domestic_bystate_all

    for c in commodity_tables:
        for metric in ['value', 'curval', 'tons']:
            table = commodity_tables[c].pivot(index='dest_state', columns='origin_state', values=metric)
            table.to_csv("incoming/" + c.replace(" ", "_").replace("/", "_") + '_' + metric + '.csv')

if __name__ == "__main__":
    faf_name = sys.argv[1]
    print "reading " + faf_name
    data = pd.read_csv(faf_name)
    #data = pd.read_csv("~/Downloads/FAF4.4.csv")
    # state_codes = pd.read_csv("state_codes.csv", quotechar="'")
    region_codes = pd.read_csv("region_codes.csv", quotechar="'")
    commodity_codes = pd.read_csv("commodity_codes.csv", quotechar="'")

    # joined = data.join(region_codes.set_index("code"), on="dms_orig", rsuffix="_dms_orig")

    domestic = data[ data.fr_orig.isnull() & data.fr_dest.isnull()]
    exported = data.dropna(axis=0, how='any', subset=['fr_dest'])
    imported = data.dropna(axis=0, how='any', subset=['fr_orig'])

    domestic.loc[:, 'type'] = 'domestic'
    domestic.loc[:, 'port'] = None

    exported.loc[:, 'type'] = 'export'
    exported.loc[:, 'port'] = exported.dms_dest

    imported.loc[:, 'type'] = 'import'
    imported.loc[:, 'port'] = exported.dms_orig

    domestic = domestic.merge(region_codes, how='left', left_on='dms_orig', right_on='code')
    domestic.loc[:, 'origin_region'] = domestic.region
    domestic.loc[:, 'origin_state'] = domestic.state 
    domestic = domestic.drop(['state', 'region'], axis=1 )

    domestic = domestic.merge(region_codes, how='left', left_on='dms_dest', right_on='code')
    domestic.loc[:, 'dest_region'] = domestic.region
    domestic.loc[:, 'dest_state'] = domestic.state 
    domestic = domestic.drop(['state', 'region'], axis=1 )

    # filter by category
    domestic = domestic.merge(commodity_codes, how='left', left_on='sctg2', right_on='code')
    #domestic.loc[:, 'commodity'] = domestic.sctg2
    domestic = domestic.drop(['code', 'sctg2'], axis=1 )

    domestic.loc[:, 'tons'] = domestic.loc[:, 'tons_2013'] + domestic.loc[:, 'tons_2014'] + domestic.loc[:, 'tons_2015']
    domestic.loc[:, 'value'] = domestic.loc[:, 'value_2013'] + domestic.loc[:, 'value_2014'] + domestic.loc[:, 'value_2015']
    domestic.loc[:, 'curval'] = domestic.loc[:, 'curval_2013'] + domestic.loc[:, 'curval_2014'] + domestic.loc[:, 'curval_2015']
    # df = df.drop(['tons_2013', 'tons_2014', 'tons_2015'], axis=1 )
    # df = df.drop(['value_2013', 'value_2014', 'value_2015'], axis=1 )
    # df = df.drop(['curval_2013', 'curval_2014', 'curval_2015'], axis=1 )

    #domestic_byregion_all.to_csv("domestic_all.csv")
    # domesti_byregionc_all = domestic.groupby(['origin_region', 'dest_region', 'commodity', ])['tons', 'value', 'curval'].sum()
    # domesti_byregionc_2013 = domestic.groupby(['origin_region', 'dest_region', 'commodity', ])['tons_2013', 'value_2013', 'curval_2013'].sum()
    # domestic_byregion_2014  = domestic.groupby(['origin_region', 'dest_region', 'commodity', ])['tons_2014', 'value_2014', 'curval_2014'].sum()
    # domestic_byregion_2015 = domestic.groupby(['origin_region', 'dest_region', 'commodity', ])['tons_2015', 'value_2015', 'curval_2015'].sum()
    # domestic_byregion_all = domestic_byregion_all.reset_index()

    generate_exports(domestic)
    generate_imports(domestic)

# commodity_tables['Gravel']
# for c in commodity_tables:
#     for metric in ['value', 'curval', 'tons']:
#         table = commodity_tables[commodity].pivot(index='origin_region', columns='dest_region', values=metric)
#         table.to_csv("csvs/" + c.replace(" ", "_").replace("/", "_") + '_' + metric + '.csv')

#commodity_tables['all'].to_csv("x.csv")



# for key in commodity_tables:
#     df = commodity_tables[key]
#     df.loc[:, 'tons_all'] = df.loc[:, 'tons_2013'] + df.loc[:, 'tons_2014'] + df.loc[:, 'tons_2015']
#     df.loc[:, 'value_all'] = df.loc[:, 'value_2013'] + df.loc[:, 'value_2014'] + df.loc[:, 'value_2015']
#     df.loc[:, 'curval_all'] = df.loc[:, 'curval_2013'] + df.loc[:, 'curval_2014'] + df.loc[:, 'curval_2015']
#     df = df.drop(['tons_2013', 'tons_2014', 'tons_2015'], axis=1 )
#     df = df.drop(['value_2013', 'value_2014', 'value_2015'], axis=1 )
#     df = df.drop(['curval_2013', 'curval_2014', 'curval_2015'], axis=1 )
#     commodity_tables[key] = df




# for all years, combine values


# print data.head(2)
# print state_codes.head()
# print region_codes.head(10)
# print commodity_codes.head(10)

# data.set_index('').join(state_codes, on="")
