from pydantic import BaseModel, Field

class Analyze(BaseModel):
    id: int
    name: str = Field(title="Название")
    photo: str = Field(title="Фото")

