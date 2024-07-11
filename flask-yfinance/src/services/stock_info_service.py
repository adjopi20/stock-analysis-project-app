import yfinance as yf
import logging
from configs.config import session
import pydantic
from pydantic import BaseModel, ValidationError
from configs.cache_config import cache_ttl, client
import json
import pydantic.parse
import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from pyvirtualdisplay import Display
from datetime import timedelta, datetime
from typing import Optional
import numpy as np

class FetchedStock(BaseModel) :
    symbol: Optional[str] = None
    sector: Optional[str] = None
    industry: Optional[str] = None
    bookValue: Optional[float] = None
    companyOfficers: Optional[list] =   None
    currentPrice: Optional[float] = None
    currentRatio: Optional[float]= None
    debtToEquity: Optional[float]= None
    dividentRate: Optional[float]= None
    dividentYield: Optional[float]= None
    earningsGrowth: Optional[float]= None
    earningsQuarterlyGrowth: Optional[float]= None
    ebitda: Optional[float]= None
    ebitdaMargins: Optional[float]= None
    enterpriseValue: Optional[float]= None
    enterpriseToEbitda: Optional[float]= None
    enterpriseToRevenue: Optional[float]= None
    enterpriseValueToRevenue: Optional[float]= None
    freeCashflow: Optional[float]= None
    floatShares: Optional[float]= None
    forwardEps: Optional[float]= None
    forwardPE: Optional[float]= None
    grossMargins: Optional[float]= None
    grossProfits: Optional[float]= None
    heldPercentInsiders: Optional[float]= None
    heldPercentInstitutions: Optional[float]= None
    longBusinessSummary: Optional[str]= None
    marketCap: Optional[float]= None
    netIncomeToCommon: Optional[float]= None
    numberOfAnalystOpinions: Optional[float]= None
    operatingCashflow: Optional[float]= None
    operatingCashflow: Optional[float]= None
    operatingMargins: Optional[float]= None
    payoutRatio: Optional[float]= None
    pegRatio: Optional[float]= None
    priceToBook: Optional[float]= None
    profitMargins: Optional[float]= None
    quickRatio: Optional[float]= None
    recommendationKey: Optional[str]= None
    recommendationMean: Optional[float]= None
    returnOnAssets: Optional[float]= None
    returnOnEquity: Optional[float]= None
    revenueGrowth: Optional[float]= None
    revenuePerShare: Optional[float]= None
    sharesOutstanding: Optional[float]= None
    totalCash: Optional[float]= None
    totalCashPerShare: Optional[float]= None
    totalRevenue: Optional[float]= None
    trailingEps: Optional[float]= None
    trailingPE: Optional[float]= None
    volume: Optional[float]= None

class ScrapedStock(BaseModel):
    symbol: str
    company_name: str
    listing_date: str
    stock_shares: int
    listing_board: str

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

def fetch_stock():
    fetched_stocks = []
    scraped_stock = scrape_stock()
    print(f"scraped stock without cache: {len(scraped_stock)}")
    # stock_info = {}
    try:
        symbolJK = [item['symbol'] for item in scraped_stock]
        print(f"symbolJK from scrape_stock: {len(symbolJK)}")

        for symbol in symbolJK:
        
            stock = yf.Ticker(symbol, session=session)
            stock_info = stock.info

            print(f"fetched stock without cache: {stock_info.get('underlyingSymbol')}")  
            fetched_stock = FetchedStock(
                symbol=stock_info.get('underlyingSymbol'),
                sector=stock_info.get('sector'),
                industry=stock_info.get('industry'),
                bookValue=stock_info.get('bookValue'),
                companyOfficers=stock_info.get('companyOfficers'),
                currentPrice=stock_info.get('currentPrice'),
                currentRatio=stock_info.get('currentRatio'),
                debtToEquity=stock_info.get('debtToEquity'),
                dividendRate=stock_info.get('dividendRate'),
                dividendYield=stock_info.get('dividendYield'),
                earningsGrowth=stock_info.get('earningsGrowth'),
                earningsQuarterlyGrowth=stock_info.get('earningsQuarterlyGrowth'),
                ebitda=stock_info.get('ebitda'),
                ebitdaMargins=stock_info.get('ebitdaMargins'),
                enterpriseValue=stock_info.get('enterpriseValue'),
                enterpriseToEbitda=stock_info.get('enterpriseToEbitda'),
                enterpriseToRevenue=stock_info.get('enterpriseToRevenue'),
                enterpriseValueToRevenue=stock_info.get('enterpriseValueToRevenue'),
                freeCashflow=stock_info.get('freeCashflow'),
                floatShares=stock_info.get('floatShares'),
                forwardEps=stock_info.get('forwardEps'),
                forwardPE=stock_info.get('forwardPE'),
                grossMargins=stock_info.get('grossMargins'),
                grossProfits=stock_info.get('grossProfits'),
                heldPercentInsiders=stock_info.get('heldPercentInsiders'),
                heldPercentInstitutions=stock_info.get('heldPercentInstitutions'),
                longBusinessSummary=stock_info.get('longBusinessSummary'),
                marketCap=stock_info.get('marketCap'),
                netIncomeToCommon=stock_info.get('netIncomeToCommon'),
                numberOfAnalystOpinions=stock_info.get('numberOfAnalystOpinions'),
                operatingCashflow=stock_info.get('operatingCashflow'),
                operatingMargins=stock_info.get('operatingMargins'),
                payoutRatio=stock_info.get('payoutRatio'),
                pegRatio=stock_info.get('pegRatio'),
                priceToBook=stock_info.get('priceToBook'),
                profitMargins=stock_info.get('profitMargins'),
                quickRatio=stock_info.get('quickRatio'),
                recommendationKey=stock_info.get('recommendationKey'),
                recommendationMean=stock_info.get('recommendationMean'),
                returnOnAssets=stock_info.get('returnOnAssets'),
                returnOnEquity=stock_info.get('returnOnEquity'),
                revenueGrowth=stock_info.get('revenueGrowth'),
                revenuePerShare=stock_info.get('revenuePerShare'),
                sharesOutstanding=stock_info.get('sharesOutstanding'),
                totalCash=stock_info.get('totalCash'),
                totalCashPerShare=stock_info.get('totalCashPerShare'),
                totalRevenue=stock_info.get('totalRevenue'),
                trailingEps=stock_info.get('trailingEps'),
                trailingPE=stock_info.get('trailingPE'),
                volume=stock_info.get('volume')
            )
            fetched_stocks.append(fetched_stock.model_dump(mode='json'))
            # return fetched_stocks
            # fetched_stocks.append(stock_info)
  

            
        print(f"fetched stock without cache: {len(fetched_stocks)}")    
        return fetched_stocks
            
            
    except Exception as e:
        logging.error(f"error: stock_info_service.fetch_stock: {e}")



def combine_fetched_scraped_info():
    cache_key = 'all_stock'
    all_stocks = []

    try:

        cached_raw_value = client.get(cache_key)
        # print(f"fetching_stock_info_service.combine_fetched_scraped_info.cached_raw_value: {cached_raw_value}")

        if cached_raw_value is not None:
            try: 
                cached_all_stock = json.loads(cached_raw_value)
                cached_all_stock = [item for item in cached_all_stock]
                print(f"fetching_stock_info_service.combine_fetched_scraped_info: {len(cached_all_stock)}")
                return cached_all_stock
            except (json.JSONDecodeError, ValidationError) as e:
                logging.error(f"found error 1 : {e}")

            
        else:
            scraped_stocks = scrape_stock_with_cache()
            print(f"controller.get_all_info_with_cache.scraped_stocks: {len(scraped_stocks)}")        
            fetched_stocks = fetch_stock()
            print(f"stock_info_service.combine_fetched_scraped_info.fetched_stocks: {len(fetched_stocks)}")        

            for fetched_stock, scraped_stock in zip(fetched_stocks, scraped_stocks):            
                if scraped_stock["symbol"] == fetched_stock['symbol']:
                    stock_info = {**scraped_stock, **fetched_stock}
                    all_stocks.append(stock_info)
            raw_value = json.dumps([stock for stock in all_stocks])
            client.set(cache_key, raw_value, ex=cache_ttl)


            # print(f"p {len(stocks_info)}")
            return all_stocks

    except Exception as e:
        logging.error(f"found error 2 : {e}")
