from pydantic import BaseModel, Field

class User(BaseModel):
    id: int = Field(title="ID")
    firstname: str = Field(title="Имя")
    secondname: str = Field(title="Фамилия")
    patronymic: str = Field(title="Отчество")
    gender: str = Field(title="Пол")
    email: str = Field(title="Почта")
    phone: str = Field(title="Телефон")
    dob: str = Field(title="Дата рождения")
