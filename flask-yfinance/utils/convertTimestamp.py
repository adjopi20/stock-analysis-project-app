import pandas as pd

def convert_timestamp(data):
    if isinstance(data, dict):
        return {str(k): convert_timestamp(v) for k, v in data.items()} 
    elif isinstance(data, list):
        return [convert_timestamp(item) for item in data]
    elif isinstance(data, pd.Timestamp):
        return data.strftime('%Y-%m-%d')
    else :
        return data
    
