import pydantic.parse
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from pyvirtualdisplay import Display
import json
import pydantic
from pydantic import BaseModel
import redis
from datetime import timedelta, datetime

class ScrapedStock(BaseModel):
    symbol: str
    company_name: str
    listing_date: str
    stock_shares: int
    listing_board: str

#initiate cache and cache saveplace
client = redis.Redis()
cache_ttl = int(timedelta(hours=24).total_seconds())

def scrape_stock() :
    url = "https://www.idx.co.id/id/data-pasar/data-saham/daftar-saham"

    display = Display(visible=0, size=(800, 600))
    display.start()

    # Initialize the WebDriver
    service = Service(executable_path="/usr/local/bin/chromedriver")
    options = webdriver.ChromeOptions()
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    driver = webdriver.Chrome(service=service, options=options)

    try:
        driver.get(url)

        wait = WebDriverWait(driver, 1800)

        # find_page_category = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "footer__row-count__select")))
        # select_page_category = Select(find_page_category)
        # time.sleep(10)
        # select_page_category.select_by_value("-1")  # Select the "All" option
        # time.sleep(10)

        dropdown = wait.until(
            EC.presence_of_element_located((By.CLASS_NAME, "footer__row-count__select")))
        dropdown.click()
        option_all = wait.until(
            EC.presence_of_element_located((By.XPATH, '//option[@value="-1"]')))
        select_element = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, '//option[@value="-1"]')))
        select_element.click()

        # Wait for the table to be loaded
        wait.until(EC.presence_of_element_located((By.ID, "vgt-table")))

        # Dynamically wait for the rows to finish lo    ading
        previous_row_count = 0
        max_wait_time = 3600  # Maximum wait time in seconds
        wait_time_elapsed = 0
        check_interval = 5  # Check every 5 seconds

        while wait_time_elapsed < max_wait_time:
            # Get the current number of rows
            rows = driver.find_elements(By.XPATH, '//*[@id="vgt-table"]/tbody/tr')
            current_row_count = len(rows)
            print(f"element found when scraping: {len(rows)}")

            if current_row_count == previous_row_count:
                # If the number of rows hasn't changed in the last interval, assume loading is complete
                break

            previous_row_count = current_row_count
            time.sleep(check_interval)
            wait_time_elapsed += check_interval

        # Ensure at least some rows are found
        if current_row_count == 0:
            print("No rows found in the table.")
            return []

        stocks = []
        for row in rows:
            columns = row.find_elements(By.TAG_NAME, 'td')
            if len(columns) >= 5:
                scrapedStock = ScrapedStock(
                    symbol = str(columns[0].text.strip() + ".JK"),
                    company_name= str(columns[1].text.strip()),
                    listing_date = (columns[2].text.strip()),
                    stock_shares = int(columns[3].text.strip().replace('.', '')),
                    listing_board = str(columns[4].text.strip()),
                )
                stocks.append(
                    # pydantic.TypeAdapter.dump_json(json, scrapedStock)
                    scrapedStock.model_dump(mode='json')
                    )
        
        print(f"1. scrape stock without cache = {len(stocks)}")
        return stocks

    except Exception as e:
        print(f"Error: {e}")
        return []

    finally:
        # Quit the driver and stop the display
        driver.quit()
        display.stop()
    

def scrape_stock_with_cache() :
    cache_key = 'scrape_all_stock'
    try:

        cached_raw_value = client.get(cache_key)

        if cached_raw_value is not None : #ambil yang lama--------
            typeAdapter = pydantic.TypeAdapter(list)
            retrieved_stocks = typeAdapter.validate_json(cached_raw_value)
            print(f"1. scrape stock with cache, get chace: {len(retrieved_stocks)}")
            return retrieved_stocks

            
        stocklist_to_cache = scrape_stock() #ambil yang baru--------
        raw_value=json.dumps(stocklist_to_cache) #list nya dibikin ke json
        client.set(cache_key, raw_value, ex=cache_ttl) # trus disimpan
        print(f"1. scrape stock with cache, set chace: {len(stocklist_to_cache)}")

        return stocklist_to_cache
    except Exception as e:
        print(f"error: {e}")

    