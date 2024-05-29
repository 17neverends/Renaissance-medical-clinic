from pydantic import BaseModel, Field

class AnalyzeUpdate(BaseModel):
    name: str = Field(title="Название")
    photo: str = Field(title="Фото")

