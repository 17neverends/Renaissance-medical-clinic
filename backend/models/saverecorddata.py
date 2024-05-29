from pydantic import BaseModel

class SaveRecordData(BaseModel):
    record_id: int
    diagnosis: str
    healing: str
