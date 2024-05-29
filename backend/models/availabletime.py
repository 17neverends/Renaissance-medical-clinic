from pydantic import BaseModel

class AvailableTime(BaseModel):
    id: int
    start: str
    end: str