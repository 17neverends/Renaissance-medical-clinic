from pydantic import BaseModel

class PatsientRecords(BaseModel):
    doctor: str
    record_id: int
    record_date: str
    record_start: str
    record_end: str
    purpose: str
    photo: str
    specialty: str