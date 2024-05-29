from pydantic import BaseModel

class UpdateSelfData(BaseModel):
    email: str
    phone: str
    address: str
    firstName: str
    secondName: str
    patronymic: str
    id: int