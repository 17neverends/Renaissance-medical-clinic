import redis
from backend.config import host, redis_port

class RedisClient:
    def __init__(self, host=host, port=redis_port, db=0):
        self.client = redis.StrictRedis(host=host, port=port, db=db)

    def set(self, key, value):
        self.client.set(key, value)

    def get(self, key):
        return self.client.get(key)

    def delete(self, key):
        self.client.delete(key)

