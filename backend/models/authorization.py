from pydantic import BaseModel

class AuthorizationData(BaseModel):
    username: str
    password: str