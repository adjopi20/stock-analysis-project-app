from flask import send_file
import pandas as pd 
import matplotlib.pyplot as plt
import json
import numpy as np
from astropy.stats import knuth_bin_width
from services.histogram_sector_service import *

def histogram_tool (dataset, category: str):
    values = []
    try: 
        for data in dataset :
            if pd.notna(data[category]):     
                values.append(data[category])
            else:
                pass
        width, bin_edges = knuth_bin_width(values, return_bins=True) #compute the how many bins to use
        freq, bin_edges = np.histogram(values, bins=bin_edges) #determine variable for histogram
        bin_edges = [round(x, 3) for x in bin_edges] #bulatkan ke 2 angka di blkg koma, disini ndarray sudah diubah jadi list

        print(f"freq: {len(freq)}, bin_edges2: {len(bin_edges)}") 
        return freq, bin_edges
    except Exception as e:
        print(f"error: {e}")
