# Stock Actions Microservice

This project is a microservice for handling stock actions. It provides endpoints for performing various operations related to stock data.

## Setup

### Prerequisites

- Python 3.9+
- Virtual Environment (recommended)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/adjopi20/stock-analysis-project-app.git
   cd stock-analysis-project-app/flask-yfinance 
   ```

2. Create virtual environment 
    ```sh
    python3 -m venv .venv
    ```

3. Activate the virtual environment:
    on Linux:
    ```sh
    source .venv/bin/activate
    ```
    on Windows
    ```sh
    .venv\Scripts\activate
    ```
    

4. Install dependencies
    ```sh
    pip install -r requirements.txt
    ```

5. Navigate to the src directory and run the application:
    on Linux:
    ```sh
    cd src
    export FLASK_APP=app
    export FLASK_ENV=development
    flask run
    ```
    on Windows:
    ```sh
    cd src
    set FLASK_APP=app
    set FLASK_ENV=development
    flask run
    ```
