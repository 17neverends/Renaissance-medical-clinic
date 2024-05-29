from pydantic import BaseModel

class PastRecord(BaseModel):
    record_id: int
    record_date: str
    record_start: str
    record_end: str
    purpose: str
    diagnosis: str
    healing: str