from fastapi import APIRouter
from backend.database.psql import PSQL
from backend.config import user, password, db_name, host, port
from backend.models.authorization import AuthorizationData
from backend.models.doctorauth import Doctor
import hashlib
from fastapi.responses import JSONResponse

router = APIRouter(
    prefix="/doctor"
)

psql = PSQL(db_name, user, password, host, port)


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


@router.post("/login", response_model=Doctor)
async def doctor_auth(data: AuthorizationData) -> Doctor: 
    psql.connect()
    query = """SELECT id, firstname, secondname, patronymic, specialty, photo, password FROM doctor WHERE username = %s;"""
        
    values = (data.username,)
    result = psql.fetch_one_or_none(query, values)
    psql.disconnect()
    if result:
        stored_password = result[-1]  
        if stored_password == hash_password(data.password):
            doctor = Doctor(
                id=result[0],
                firstName=result[1],
                secondName=result[2],
                patronymic=result[3],
                specialty=result[4],
                photo=result[5]
            )
            return doctor
        else:
            return JSONResponse(content={"message": "Неверный пароль"}, status_code=401)
    else:
        return JSONResponse(content={"message": "Пользователя не существует"}, status_code=404)


