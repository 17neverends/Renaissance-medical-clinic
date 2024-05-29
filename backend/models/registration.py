from pydantic import BaseModel

class RegistrationData(BaseModel):
    secondName: str
    firstName: str
    patronymic: str
    gender: str
    dob: str
    bloodType: str
    email: str
    phone: str
    address: str
    username: str
    password: str