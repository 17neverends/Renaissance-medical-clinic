from typing import List
from fastapi import APIRouter, HTTPException, Query
from backend.database.psql import PSQL
from backend.config import user, password, db_name, host, port
from fastapi.responses import JSONResponse
from backend.models.contactData import ContactData



router = APIRouter(
    prefix="/contact"
)

psql = PSQL(db_name, user, password, host, port)


@router.post("/get_contact_data", response_class=JSONResponse)
async def create_analyze(data: ContactData) -> JSONResponse:
    try:
        psql.connect()
        print(data)

        query = """INSERT INTO contact (firstname, secondname, mail, mobile, messageinfo)
                    VALUES (%s, %s, %s, %s, %s)"""
        
        values = (data.firstName, data.lastName, data.email, data.phoneNumber, data.message)
        psql.execute_query(query=query, params=values)
        psql.disconnect()
        return JSONResponse(content={"data": "Успешно"}, status_code=200)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))