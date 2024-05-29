from pydantic import BaseModel, Field

class DoctorInsert(BaseModel):
    username: str = Field(title="Логин")
    password: str= Field(title="Пароль")
    firstname: str = Field(title="Имя")
    secondname: str = Field(title="Фамилия")
    patronymic: str = Field(title="Отчество")
    specialty: str = Field(title="Специальность")
    photo: str = Field(title="Фото")
