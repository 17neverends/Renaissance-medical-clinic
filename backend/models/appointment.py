from pydantic import BaseModel

class Appointment(BaseModel):
    record_id: int
    patsient: str
    purpose: str
    record_date: str
    record_start: str
    record_end: str
    photo: str
    dob: str
    bloodType: str
    gender: str
    patsient_id: int