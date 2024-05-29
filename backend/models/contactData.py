from pydantic import BaseModel

class ContactData(BaseModel):
    firstName: str
    lastName: str
    email: str
    phoneNumber: str
    message: str