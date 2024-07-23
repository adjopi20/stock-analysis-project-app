import requests_cache

def cache_session_config():
    session = requests_cache.CachedSession('yfinance.cache')
    session.headers['User-agent'] = 'adjopi20'
    session.expire_after = 86400
    return session  