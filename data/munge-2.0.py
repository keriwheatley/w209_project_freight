import pandas as pd

data = pd.read_csv("sample-faf4.csv")
# state_codes = pd.read_csv("state_codes.csv", quotechar="'")
# region_codes = pd.read_csv("region_codes.csv", quotechar="'")
# commodity_codes = pd.read_csv("commodity_codes.csv", quotechar="'")

# joined = data.join(region_codes.set_index("code"), on="dms_orig", rsuffix="_dms_orig")

domestic = data.loc[data.fr_orig.isnull() & data.fr_dest.isnull()]
exported = data.dropna(axis=0, how='any', subset=['fr_dest'])
imported = data.dropna(axis=0, how='any', subset=['fr_orig'])

domestic.loc[:, 'type'] = 'domestic'
domestic.loc[:, 'port'] = None

exported.loc[:, 'type'] = 'export'
exported.rename('port'] = exported.dms_dest

imported.loc[:, 'type'] = 'import'
imported.loc[:, 'port'] = exported.dms_orig

print domestic.head()

# print data.head(2)
# print state_codes.head()
# print region_codes.head(10)
# print commodity_codes.head(10)

# data.set_index('').join(state_codes, on="")
