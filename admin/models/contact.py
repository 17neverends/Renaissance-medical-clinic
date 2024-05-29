from pydantic import BaseModel, Field

class Contact(BaseModel):
    firstname: str = Field(title="Имя")
    secondname: str = Field(title="Фамилия")
    mail: str = Field(title="Почта")
    mobile: str = Field(title="Телефон")
    messageinfo: str = Field(title="Информация")
