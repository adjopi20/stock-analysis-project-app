import requests
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def scrape_stock():
    url = "https://www.idx.co.id/id/data-pasar/data-saham/daftar-saham"

    # Fetch data
    response = requests.get(url)
    html_content = response.text

    # Parse HTML content using BeautifulSoup
    soup = BeautifulSoup(html_content, 'html.parser')

    # Find the table by its id
    table = soup.find('table', id='vgt-table')
    
    if table is None:
        print("No table found on the page.")
        return []

    stocks = []
    for row in table.find_all('tr')[1:]:  # Skip the header row
        
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
                'stock_shares': int(stocks_shares.replace('.', '')),  # Removing dots for numbers
                'listing_board': listing_board
            })

    return stocks


def scrape_stock2():
    url = "https://www.idx.co.id/id/data-pasar/data-saham/daftar-saham"

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
    WebDriverWait(driver, 20).until(
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
    return stocks

stocks = scrape_stock()
for stock in stocks:
    print(stock)