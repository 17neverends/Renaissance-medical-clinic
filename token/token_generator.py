import secrets
import pyperclip


def main():
    from redis_client import RedisClient 
    redis = RedisClient()
    admin_token = secrets.token_urlsafe(32)
    redis.set("admin", admin_token, 10)
    pyperclip.copy(admin_token)
    print("Токен администратора скопирован в буфер обмена.")

if __name__ == "__main__":
    main()
