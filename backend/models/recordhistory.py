from pydantic import BaseModel

class RecordHistory(BaseModel):
    firstname: str
    secondname: str
    patronymic: str
    specialty: str
    photo: str
    concat: str
    purpose: str
    diagnosis: str
    healing: str
    date: str
