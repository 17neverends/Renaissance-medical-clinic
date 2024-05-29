from pydantic import BaseModel

class Doctor(BaseModel): 
    id: int   
    firstName: str
    secondName: str
    patronymic: str
    specialty: str
    photo: str