import sys
import pandas as pd


if (len(sys.argv) == 1):
    sys.exit("needs filename")
inputfile = sys.argv[1]
file_parts = inputfile.split("_")
print inputfile 

data = pd.read_csv(inputfile)
print data.head(1)

se = data.groupby('state_origin')['total_ktons', 'total_current_m_dollar', 'total_m_dollar', 'total_ton_mile'].sum()
si = data.groupby('state_dest')['total_ktons', 'total_current_m_dollar', 'total_m_dollar', 'total_ton_mile'].sum()

joined = se.join(si, lsuffix='_se', rsuffix='_si')
joined['net_total_ktons'] = joined['total_ktons_se'] - joined['total_ktons_si']
joined['net_total_m_dollar'] = joined['total_m_dollar_se'] - joined['total_m_dollar_si']
joined['net_total_current_m_dollar'] = joined['total_current_m_dollar_se'] - joined['total_current_m_dollar_si']
joined['net_total_ton_mile'] = joined['total_ton_mile_se'] - joined['total_ton_mile_si']

joined[['net_total_ktons', 'net_total_current_m_dollar', 'net_total_m_dollar', 'net_total_ton_mile']] = joined[['net_total_ktons', 'net_total_current_m_dollar', 'net_total_m_dollar', 'net_total_ton_mile']].astype('int64')
joined.to_csv('joined_' + file_parts[1] + '.csv')

