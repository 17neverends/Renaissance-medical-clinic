from pydantic import BaseModel

class CreateAnalyze(BaseModel):
    id: int
    patsient_id: int
    date: str
