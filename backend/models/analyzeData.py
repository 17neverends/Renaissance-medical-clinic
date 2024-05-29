from pydantic import BaseModel

class AnalyzeData(BaseModel):
    id: int
    name: str
    photo: str