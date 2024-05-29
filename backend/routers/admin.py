from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from backend.database.redis import RedisClient
import asyncio

router = APIRouter(
    prefix="/admin"
)

redis = RedisClient()

@router.post("/token", response_class=JSONResponse)
async def check_token(token_data: dict) -> JSONResponse:
    try:
        token = token_data.get("token")
        if not token:
            raise HTTPException(status_code=422, detail="Отсутствует токен")
        
        admin_token = redis.get("admin")
        if admin_token:
            if token == admin_token.decode('utf-8'):
                asyncio.create_task(delete_admin_token())
                return JSONResponse(content={"message": "Токен подтвержден"}, status_code=200)
            else:
                return JSONResponse(content={"error": "Неверный токен"}, status_code=401)
        else:
            return JSONResponse(content={"error": "Отсутствует административный токен"}, status_code=404)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def delete_admin_token():
    await asyncio.sleep(10)
    redis.delete("admin")

