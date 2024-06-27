import redis
from datetime import timedelta

client = redis.Redis()
cache_ttl = int(timedelta(hours=24).total_seconds())
