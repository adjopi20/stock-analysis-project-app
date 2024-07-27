
# from services.histogram_sector_service import combine_fetched_scraped_info
# from services.stock_info_service import fetched_info_with_cache,combine_fetched_scraped_info
import numpy as np
import scipy.stats as stats
import astropy.stats as astats


def trimmed_mean(dataset, category: str):

    baskom = []
    for item in dataset:
        if category not in item:
           continue
        
        numbers = item.get(category, np.nan)
        
        if numbers==0 or numbers is None:
            continue 

        baskom.append(numbers)


    if baskom:
        zscore = stats.zscore(baskom)
    
    print(f"baskom: {len(baskom)}")
    
    filtered = filter(lambda x: x<=3 and x>=-3, zscore)
    filtered = list(filtered)
    
    threshold = 3
    mask = np.abs(zscore) < threshold
    baskom = np.array(baskom)
    cleaned = baskom[mask]

    x = round(np.mean(cleaned), 4)

    return x
