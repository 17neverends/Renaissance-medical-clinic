from pydantic import BaseModel

class Archive(BaseModel):
    firstname: str
    secondname: str
    patronymic: str
    photo: str
    concat: str
    purpose: str
    diagnosis: str
    healing: str
    date: str
