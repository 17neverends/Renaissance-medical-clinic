import redis
from config import host, port, db

class RedisClient:
    def __init__(self, host=host, port=port, db=db):
        self.client = redis.Redis(host=host, port=port, db=db)

    def set(self, key, value, ex):
        return self.client.set(key, value, ex)