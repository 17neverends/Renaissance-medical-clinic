import redis
from admin.config import host, redis_port

class RedisClient:
    def __init__(self, host=host, port=redis_port, db=0):
        self.client = redis.Redis(host=host, port=port, db=db)

    def set(self, key, value):
        return self.client.set(key, value)

    def get(self, key):
        return self.client.get(key)

    def delete(self, key):
        return self.client.delete(key)
