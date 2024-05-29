from pydantic import BaseModel

class Patsient(BaseModel):
    username: str
    isAuthenticated: bool
    email: str
    phone: str
    address: str
    firstName: str
    secondName: str
    patronymic: str
    gender: str
    dob: str
    joinDate: str
    bloodType: str
    discCode: str
    disc: str
    id: int
    photo: str