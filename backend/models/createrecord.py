from pydantic import BaseModel

class CreateRecord(BaseModel):
    id: int
    patsient_id: int
    purpose: str


 