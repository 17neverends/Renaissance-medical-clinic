from pydantic import BaseModel

class Intermediate(BaseModel):
    diagnosis: str
    healing: str
    