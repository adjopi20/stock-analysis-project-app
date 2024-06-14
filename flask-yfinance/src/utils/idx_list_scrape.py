import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from pyvirtualdisplay import Display



def scrape_stock():
    url = "https://www.idx.co.id/id/data-pasar/data-saham/daftar-saham"
    
    # Initialize the WebDriver
    service = Service(executable_path="/usr/local/bin/chromedriver")
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    
    driver = webdriver.Chrome(service=service, options=options)
    driver.get(url)

    # Wait until the table is loaded
    try:
        WebDriverWait(driver, 20).until(
            EC.presence_of_element_located((By.ID, "vgt-table"))
        )
    except Exception as e:
        print("Error:", e)
        driver.quit()
        return []

    html_content = driver.page_source
    driver.quit()

    soup = BeautifulSoup(html_content, 'html.parser')
    table = soup.find('table', {'id': 'vgt-table'})
    
    if not table:
        print("No table found on the page.")
        return []

    stocks = []
    rows = table.find('tbody').find_all('tr')

    for row in rows:
        columns = row.find_all('td')
        if len(columns) >= 5:
            symbol = columns[0].text.strip()
            company_name = columns[1].text.strip()
            listing_date = columns[2].text.strip()
            stocks_shares = columns[3].text.strip().replace('.', '')
            listing_board = columns[4].text.strip()
            stocks.append({
                'symbol': symbol,
                'company_name': company_name,
                'listing_date': listing_date,
                'stock_shares': int(stocks_shares.replace('.', '')),
                'listing_board': listing_board
            })

    return stocks



def scrape_stock2():
    url = "https://www.idx.co.id/id/data-pasar/data-saham/daftar-saham"

    #set display 
    display = Display(visible=0, size=(800,600))
    display.start()

    # Initialize the WebDriver
    service = Service(executable_path="/usr/local/bin/chromedriver")
    options = webdriver.ChromeOptions()
    # options.add_argument('--headless')
    options.add_argument('--disable-gpu')
    options.add_argument('--no-sandbox')
    driver = webdriver.Chrome(service=service, options=options)

    # Open the URL
    driver.get(url)

    # Wait until the table is loaded
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "vgt-table"))
    )

    # Find the table
    table = driver.find_element(By.ID, 'vgt-table')

    stocks = []

    # Find rows in the table body
    rows = table.find_elements(By.TAG_NAME, 'tr')

    for row in rows[1:]:  # Skip the header row
        columns = row.find_elements(By.TAG_NAME, 'td')
        if len(columns) >= 5:
            symbol = columns[0].text.strip()
            company_name = columns[1].text.strip()
            listing_date = columns[2].text.strip()
            stocks_shares = columns[3].text.strip().replace('.', '')
            listing_board = columns[4].text.strip()
            stocks.append({
                'symbol': symbol,
                'company_name': company_name,
                'listing_date': listing_date,
                'stock_shares': int(stocks_shares.replace('.', '')),
                'listing_board': listing_board
            })

    driver.quit()
    display.stop()
    # driver.close()
    return stocks
    


stocks = scrape_stock2()
for stock in stocks:
    print(stock)