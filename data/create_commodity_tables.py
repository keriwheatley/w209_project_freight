import pandas as pd
import sys

if __name__ == "__main__":
    faf_name = sys.argv[1]
    print "reading " + faf_name
    data = pd.read_csv(faf_name)
    print data.columns
    #data = pd.read_csv("~/Downloads/FAF4.4.csv")
    state_codes = pd.read_csv("state_codes.csv", quotechar="'")
    region_codes = pd.read_csv("region_codes.csv", quotechar="'")
    commodity_codes = pd.read_csv("commodity_codes.csv", quotechar="'")
    international_codes = pd.read_csv("international_codes.csv", quotechar="'")


    # remove unused columns
    data = data.drop([
        'tons_2020',
        'tons_2025',
        'tons_2030',
        'tons_2035',
        'tons_2040',
        'tons_2045',
        'value_2020',
        'value_2025',
        'value_2030',
        'value_2035',
        'value_2040',
        'value_2045',
        'tmiles_2020',
        'tmiles_2025',
        'tmiles_2030',
        'tmiles_2035',
        'tmiles_2040',
        'tmiles_2045'], axis=1)

    column_order = [ 'origin', 'origin_region', 'dest', 'dest_region', 'commodity', 'port', 'dms_mode','fr_inmode', 'fr_outmode', 'tmiles_2012', 'tmiles_2013', 'tmiles_2014', 'tmiles_2015','tons_2012', 'tons_2013', 'tons_2014', 'tons_2015', 'trade_type','value_2012', 'value_2013', 'value_2014', 'value_2015', 'curval_2013', 'curval_2014', 'curval_2015']
    domestic = data[ data.fr_orig.isnull() & data.fr_dest.isnull()]
    # domestic = domestic.drop(domestic.columns[0], axis=1)
    domestic = domestic.drop(['fr_orig', 'fr_dest'], axis=1)
    domestic = domestic.rename(columns={'dms_orig': 'origin', 'dms_dest': 'dest'})
    domestic.loc[:, 'port'] = None 
    
    # make origin human readable
    domestic = domestic.merge(region_codes, how='left', left_on='origin', right_on='code')
    domestic.loc[:, 'origin_region'] = domestic.region
    domestic.loc[:, 'origin'] = domestic.state
    domestic = domestic.drop(['state', 'region', 'code'], axis=1 )

    # make dest human readable
    domestic = domestic.merge(region_codes, how='left', left_on='dest', right_on='code')
    domestic.loc[:, 'dest_region'] = domestic.region
    domestic.loc[:, 'dest'] = domestic.state
    domestic = domestic.drop(['state', 'region', 'code'], axis=1 )
    domestic = domestic.reset_index().drop(['index'], axis=1)

    # create a subset of exports to international destinations
    exported = data.dropna(axis=0, how='any', subset=['fr_dest'])
    # exported = exported.drop(exported.columns[0], axis=1)
    exported = exported.rename(columns={'fr_dest': 'dest', 'dms_dest': 'port', 'dms_orig': 'origin'})
    exported = exported.drop(['fr_orig'], axis=1)

    # make origin human readable
    exported = exported.merge(region_codes, how='left', left_on='origin', right_on='code')
    exported.loc[:, 'origin'] = exported.state
    exported.loc[:, 'origin_region'] = exported.region
    exported = exported.drop(['state', 'region', 'code'], axis=1 )

    # make dest human readable
    exported = exported.merge(international_codes, how='left', left_on='dest', right_on='code')
    exported.loc[:, 'dest'] = exported.location
    exported.loc[:, 'dest_region'] = None
    exported = exported.drop(['location', 'code'], axis=1 )
    exported = exported.reset_index().drop(['index'], axis=1)

    # create a subset of imports from international destinations
    imported = data.dropna(axis=0, how='any', subset=['fr_orig'])
    # imported = imported.drop(imported.columns[0], axis=1)
    imported = imported.rename(columns={'dms_dest': 'dest', 'dms_orig': 'port', 'fr_orig': 'origin'})
    imported = imported.drop(['fr_dest'], axis=1)

    # make origin human readable
    imported = imported.merge(international_codes, how='left', left_on='origin', right_on='code')
    imported.loc[:, 'origin'] = imported.location
    imported.loc[:, 'origin_region'] = None
    imported = imported.drop(['location', 'code'], axis=1 )

    # make dest human readable
    imported = imported.merge(region_codes, how='left', left_on='dest', right_on='code')
    imported.loc[:, 'dest'] = imported.state
    imported.loc[:, 'dest_region'] = imported.region
    imported = imported.drop(['state', 'region', 'code'], axis=1 )
    imported = imported.reset_index().drop(['index'], axis=1)

    data = domestic.append(imported, ignore_index=True).append(exported, ignore_index=True)

    # make commodities human readable
    data = data.merge(commodity_codes, how='left', left_on='sctg2', right_on='code').drop(['sctg2', 'code'], axis=1)
    data = data.reindex(column_order, axis=1)

    data.loc[:, 'tons_total'] = data.loc[:, 'tons_2013'] + data.loc[:, 'tons_2014'] + data.loc[:, 'tons_2015']
    data.loc[:, 'value_total'] = data.loc[:, 'value_2013'] + data.loc[:, 'value_2014'] + data.loc[:, 'value_2015']
    data.loc[:, 'curval_total'] = data.loc[:, 'curval_2013'] + data.loc[:, 'curval_2014'] + data.loc[:, 'curval_2015']
    data.loc[:, 'tmiles_total'] = data.loc[:, 'tmiles_2013'] + data.loc[:, 'tmiles_2014'] + data.loc[:, 'tmiles_2015']

    data.loc[:, 'commodity'] = data.commodity.apply(lambda x: x.replace(" ", "_"))

    # add up all years into 
    commodities_by_origin = data.groupby(['commodity', 'origin', 'dest'])['tmiles_2012', 'tmiles_2013', 'tmiles_2014', 'tmiles_2015','tons_2012', 'tons_2013', 'tons_2014', 'tons_2015', 'trade_type','value_2012', 'value_2013', 'value_2014', 'value_2015', 'curval_2013', 'curval_2014', 'curval_2015', 'tons_total', 'value_total', 'curval_total', 'tmiles_total'].sum().reset_index()
    commodities_by_dest = data.groupby(['commodity', 'dest',  'origin', ])['tmiles_2012', 'tmiles_2013', 'tmiles_2014', 'tmiles_2015','tons_2012', 'tons_2013', 'tons_2014', 'tons_2015', 'trade_type','value_2012', 'value_2013', 'value_2014', 'value_2015', 'curval_2013', 'curval_2014', 'curval_2015', 'tons_total', 'value_total', 'curval_total', 'tmiles_total'].sum().reset_index()


    commodities_by_origin.to_csv("commodities_by_origin_table.csv")
    commodities_by_dest.to_csv("commodities_by_dest_table.csv")

