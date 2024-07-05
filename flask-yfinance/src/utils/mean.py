
# from services.histogram_sector_service import combine_fetched_scraped_info
from services.fetching_stock_info_service import fetched_info_with_cache,combine_fetched_scraped_info
import numpy as np
import scipy.stats as stats
import astropy.stats as astats


def trimmed_mean():
    tes = fetched_info_with_cache()

    # tes_z_score = stats.zscore(tes)

    
    baskom = []
    for item in tes:
        if 'returnOnEquity' not in item:
           continue
        numbers = item.get('returnOnEquity', np.nan)
        
        if np.isnan(numbers) or numbers is None:
            continue 

        baskom.append(numbers)

    if baskom:
        zscore = stats.zscore(baskom)
    
    print(f"z score: {len(zscore)}")

    # for item1,item2 in zip(baskom, zscore):
    #     if baskom[item1] == zscore[item2]:
    filtered = filter(lambda x: x<=3 and x>=-3, zscore)
    filtered = list(filtered)
    #         return baskom if baskom[item1] == 
    print(f"len filtered zscore: {len(filtered)}\nfiltered zscore: {filtered}")

    threshold = 3
    mask = np.abs(zscore) < threshold
    baskom = np.array(baskom)
    cleaned = baskom[mask]

    print(f"data cleaned length: {len(cleaned)}\ndata cleaned value: {cleaned}")

    x = round(np.mean(cleaned), 2)
    print(f"rounded: {x}")

trimmed_mean()
