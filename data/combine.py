import sys
import pandas as pd


if (len(sys.argv) == 1):
    sys.exit("needs filename")
inputfile1 = sys.argv[1]
inputfile2 = sys.argv[2]
inputfile3 = sys.argv[3]

data1 = pd.read_csv(inputfile1)
data2 = pd.read_csv(inputfile2)
data3 = pd.read_csv(inputfile3)

columns = data1.columns.tolist()
del columns[0]
data = data1[columns] + data2[columns] + data3[columns]
data['state'] = data1['state_origin']
cols = data.columns.tolist()
cols = cols[-1:] + cols[:-1]
data = data[cols]

data.to_csv("domestic_combined.csv")
