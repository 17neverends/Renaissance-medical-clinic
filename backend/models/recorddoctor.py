from pydantic import BaseModel

class RecordDoctor(BaseModel):
    username: str
    firstName: str
    secondName: str
    patronymic: str
    specialty: str
    photo: str
