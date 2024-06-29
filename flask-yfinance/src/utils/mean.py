from services.histogram_sector_service import combine_fetched_scraped_info
import numpy as np
def mean():
    tes = combine_fetched_scraped_info()
    baskom = []
    for item in tes:
        if 'returnOnEquity' not in item:
           continue
        numbers = item.get('returnOnEquity', np.nan)
        
        if np.isnan(numbers) or numbers is None:
            continue 

        baskom.append(numbers)
    
    if baskom:
        #find mean
        mean = round(np.mean(baskom), 2)
        #find std
        std = round(np.std(baskom, dtype=float), 2)
    else:
        print("not found")

    print(f"mean: {mean}, std: {std}")
mean()
