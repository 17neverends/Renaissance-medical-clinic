from pydantic import BaseModel, Field

class CRUD(BaseModel):
    id: int = Field(title="ID")


