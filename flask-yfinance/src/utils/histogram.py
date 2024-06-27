from flask import send_file
import pandas as pd 
import matplotlib.pyplot as plt
import json
import numpy as np
from astropy.stats import knuth_bin_width
from services.histogram_sector_service import *

def histogram_tool (sector, category, listBoard=None, industry=None, marketCap=None, recKey=None, recMean=None):
    dataset = get_stock_info_for_histogram(sector, category, listBoard, industry, marketCap, recKey, recMean)
    values = []
    try: 
        for data in dataset :
            if data['sector'] == sector and category in data and pd.notna(data[category]):     
                if listBoard and data.get('listing_board') != listBoard:
                    continue
                if industry and data.get('industry') != industry:
                    continue
                if marketCap and data.get('marketCap') != marketCap:
                    continue
                if recKey and data.get('recommendationKey') != recKey:
                    continue
                if recMean and data.get('recommendationMean') != recMean:
                    continue
               
                values.append(data[category])
            else:
                pass
        width, bin_edges = knuth_bin_width(values, return_bins=True) #compute the how many bins to use
        freq, bin_edges = np.histogram(values, bins=bin_edges) #determine variable for histogram
        bin_edges = [round(x, 2) for x in bin_edges] #bulatkan ke 2 angka di blkg koma, disini ndarray sudah diubah jadi list

        # print(f"freq: {len(freq)}, bin_edges2: {len(bin_edges)}") 
        return freq, bin_edges
    except Exception as e:
        print(f"error: {e}")
