from pydantic import BaseModel

class PatsientAnalyzes(BaseModel):
    id: int
    analyze_id: int
    analyze_name: str
    date: str
    photo: str
    result: str
