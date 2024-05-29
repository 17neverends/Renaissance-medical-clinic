from fastapi import APIRouter, HTTPException
from backend.database.psql import PSQL
from backend.config import user, password, db_name, host, port
from backend.models.patsient import Patsient
from backend.models.registration import RegistrationData
from backend.models.authorization import AuthorizationData
from backend.models.updateselfdata import UpdateSelfData
import hashlib
import random
from datetime import datetime
from fastapi.responses import JSONResponse


router = APIRouter(
    prefix="/patsient"
)

psql = PSQL(db_name, user, password, host, port)


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

@router.post("/registration", response_class=JSONResponse)
async def register(data: RegistrationData) -> JSONResponse: 
    print(data)
    disc_code = lambda: ''.join([str(random.randint(0, 9)) for _ in range(7)])
    join_date = datetime.now().strftime("%d.%m.%Y")
    code = disc_code()
    
    hashed_password = hash_password(data.password)

    psql.connect()
    insert_query = """INSERT INTO patsient
        (username, password, email, phone, address, firstName, secondName,
        patronymic, gender, dob, joinDate, bloodType, discCode)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
        """
    values = (data.username, hashed_password, data.email, data.phone, data.address, data.firstName, data.secondName,
              data.patronymic, data.gender, data.dob, join_date, data.bloodType, code)
    psql.execute_query(insert_query, values)

    id_query = f"SELECT id, photo from patsient WHERE username = '{data.username}'"
    new_data = psql.fetch_one_or_none(id_query)
    id = new_data[0]
    photo = new_data[1]

    psql.disconnect()

    response_data = {
            "join_date": join_date,
            "disc_code": code,
            "discount": "10%",
            "id": id,
            "photo": photo
    }
    return JSONResponse(content={"data": response_data}, status_code=200)


@router.post("/authorization", response_class=JSONResponse)
async def register(data: AuthorizationData) -> JSONResponse: 
    psql.connect()
    query = """SELECT email, phone, address, firstname, secondname, patronymic, gender, dob, joindate, bloodtype, disccode, disc, id, photo, password FROM patsient WHERE username = %s;"""
        
    values = (data.username,)
    result = psql.fetch_one_or_none(query, values)
    print(result)
    psql.disconnect()
    response_data = {}
    if result:
        stored_password = result[-1]  
        if stored_password == hash_password(data.password):
            patsient_data = Patsient(
                username=data.username,
                isAuthenticated=True,
                email=result[0],
                phone=result[1],
                address=result[2],
                firstName=result[3],
                secondName=result[4],
                patronymic=result[5],
                gender=result[6],
                dob=result[7],
                joinDate=result[8],
                bloodType=result[9],
                discCode=result[10],
                disc=result[11],
                id=result[12],
                photo=result[13]
            )
            response_data = patsient_data.model_dump_json()
            return JSONResponse(content={"data": response_data}, status_code=200)
        else:
            return JSONResponse(content={"message": "Неверный пароль"}, status_code=401)
    else:
        return JSONResponse(content={"message": "Пользователя не существует"}, status_code=404)


@router.post("/update_selfdata", response_class=JSONResponse)
async def update_selfdata(data: UpdateSelfData) -> JSONResponse: 
    psql.connect()
    insert_query = """
    UPDATE patsient 
    SET email = %s, phone = %s, address = %s, firstName = %s, secondName = %s, patronymic = %s WHERE id = %s;
    """
    values = (data.email, data.phone, data.address, data.firstName, data.secondName, data.patronymic, data.id)
    psql.execute_query(insert_query, values)
    psql.disconnect()

    return JSONResponse(content={"data": "Успешно"}, status_code=200)

