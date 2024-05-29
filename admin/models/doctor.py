from pydantic import BaseModel, Field

class Doctor(BaseModel):
    id: int = Field(title="ID")
    firstname: str = Field(title="Имя")
    secondname: str = Field(title="Фамилия")
    patronymic: str = Field(title="Отчество")
    specialty: str = Field(title="Специальность")
    photo: str = Field(title="Фото")

