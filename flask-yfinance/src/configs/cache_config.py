import redis
from datetime import timedelta
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
import pytz


client = redis.Redis()
cache_ttl = int(timedelta(hours=23).total_seconds())

