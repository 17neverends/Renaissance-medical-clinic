from typing import Annotated, List
from fastui.forms import fastui_form
from fastapi import APIRouter
from fastui import AnyComponent, FastUI
from fastui import components as c
from fastui.components.display import DisplayLookup
from fastui.events import BackEvent, GoToEvent, PageEvent
from admin.config import user, password, db_name, host, port
from admin.database.psql import PSQL
from admin.middleware.shared import demo_page
from admin.models.user import User
from admin.models.userUpdate import UserUpdate
from admin.models.doctor import Doctor
from admin.models.doctorUpdate import DoctorUpdate
from admin.models.crud import CRUD
from admin.models.docInsert import DoctorInsert
import hashlib

psql = PSQL(db_name, user, password, host, port)
router = APIRouter()


def fetch_users() -> List[User]:
    query = """SELECT   id,
                        firstname,
                        secondname,
                        patronymic,
                        gender,
                        email,
                        phone,
                        dob
                        FROM patsient;"""
    psql.connect()
    data = psql.fetch_all(query=query)
    psql.disconnect()
    users = [User(id=row[0],
                  firstname=row[1],
                  secondname=row[2],
                  patronymic=row[3],
                  gender=row[4],
                  email=row[5],
                  phone=row[6],
                  dob=row[7]) for row in data]
    return users


def fetch_doctors() -> List[Doctor]:
    query = """SELECT   id,
                        firstname,
                        secondname,
                        patronymic,
                        specialty,
                        photo
                        FROM doctor;"""
    psql.connect()
    data = psql.fetch_all(query=query)
    psql.disconnect()
    doctors = [Doctor(id=row[0],
                  firstname=row[1],
                  secondname=row[2],
                  patronymic=row[3],
                  specialty=row[4],
                  photo = row[5]) for row in data]
    return doctors



def tabs() -> list[AnyComponent]:
    return [
        c.LinkList(
            links=[
                c.Link(
                    components=[c.Text(text='Пациенты')],
                    on_click=GoToEvent(url='/table/users'),
                    active='startswith:/table/users',
                ),
                c.Link(
                    components=[c.Text(text='Врачи')],
                    on_click=GoToEvent(url='/table/doctors'),
                    active='startswith:/table/doctors',
                ),
            ],
            mode='tabs',
            class_name='+ mb-4',
        ),
    ]


def info(title: str, body: str, actions: str, trigger: str) -> List[AnyComponent]:
    return [
        c.Modal(
                    title=title,
                    body=[c.Paragraph(text=body)],
                    footer=[
                        c.Button(text='Закрыть', on_click=GoToEvent(url=actions)),
                    ],
                    open_trigger=PageEvent(name=trigger),
                ),
    ]





@router.get('/users', response_model=FastUI, response_model_exclude_none=True)
def users_view() -> list[AnyComponent]:
    global users
    users = fetch_users()
    return demo_page(
        *tabs(),
        c.Table(
            data=users,
            data_model = User,
            columns=[
                DisplayLookup(field='id', on_click=GoToEvent(url='/table/users/{id}/')),
                DisplayLookup(field='firstname'),
                DisplayLookup(field='secondname'),
                DisplayLookup(field='patronymic'),
                DisplayLookup(field='gender'),
                DisplayLookup(field='email'),
                DisplayLookup(field='phone'),
                DisplayLookup(field='dob'),
            ],  
        ),
        c.Paragraph(text="     "),
        *info("Отчет о действии", "Пользователь успешно добавлен, результат добавлен в логи", '/table/actions', 'static-modal' ),
        *info("Отчет о действии", "ID уже есть в БД, логи не изменились", '/table/actions', 'static-modal-error' ),
        title='Пользователи',
        
    )



@router.get('/users/{id}/', response_model=FastUI, response_model_exclude_none=True)
def user_profile(id: int) -> list[AnyComponent]:
    global old_id
    old_id = id
    user = next(u for u in users if int(u.id) == id)
    return demo_page(
        c.Link(components=[c.Text(text='Назад')], on_click=BackEvent()),
        c.Details(
            data=user,
            fields=[
                DisplayLookup(field='id'),
                DisplayLookup(field='firstname'),
                DisplayLookup(field='secondname'),
                DisplayLookup(field='patronymic'),
                DisplayLookup(field='gender'),
                DisplayLookup(field='email'),
                DisplayLookup(field='phone'),
                DisplayLookup(field='dob'),
            ],
        ),
        *info("Отчет о действии", "Пользователь успешно добавлен, результат добавлен в логи", '/table/actions', 'static-modal' ),

        c.Button(text="Изменить данные", on_click=GoToEvent(url='/table/users/update')),
        c.Paragraph(text="     "),
        c.Button(text="Удалить пользователя", on_click=PageEvent(name="delete-user")),
        c.Form(
                    submit_url="/api/table/userdelete",
                    form_fields=[
                        c.FormFieldInput(name='id', title='', initial=id, html_type='hidden'),
                    ],
                    footer=[],
                    submit_trigger=PageEvent(name="delete-user"),
                ),

        title=f"Пользователь ID: {id}",
    )


@router.get("/users/update", response_model=FastUI, response_model_exclude_none=True)
def add_user_page():
    return [
        c.Page(
            components=[
                c.Heading(text='Обновить данные', level=2),
                c.Link(components=[c.Text(text='Назад')], on_click=BackEvent()),
                c.ModelForm(
                    model=UserUpdate,
                    submit_url="/api/table/userupdate"
                ),
            ]
        )
    ]



@router.post("/userupdate")
def add_user(form: Annotated[UserUpdate, fastui_form(UserUpdate)]) -> list[AnyComponent]:
    psql.connect()
    psql.execute_query("""UPDATE patsient SET firstname = %s,
                                             secondname = %s,
                                             patronymic = %s,
                                             gender = %s,
                                             email = %s,
                                             phone = %s,
                                             dob = %s
                                                 WHERE id = %s""", (form.firstname,
                                                                    form.secondname,
                                                                    form.patronymic,
                                                                    form.gender,
                                                                    form.email,
                                                                    form.phone,
                                                                    form.dob,
                                                                    old_id))
    psql.disconnect()
    return [c.FireEvent(event=GoToEvent(url='/table/users'))]


@router.post("/userdelete")
def delete_user(form: Annotated[CRUD, fastui_form(CRUD)]) -> list[AnyComponent]:
    psql.connect()
    psql.execute_query("DELETE FROM patsient WHERE id = %s", (form.id,))
    psql.disconnect()
    return [c.FireEvent(event=GoToEvent(url='/table/users'))]

@router.get('/doctors', response_model=FastUI, response_model_exclude_none=True)
def users_view() -> list[AnyComponent]:
    global doctors
    doctors = fetch_doctors()
    return demo_page(
        *tabs(),
        c.Table(
            data=doctors,
            data_model = Doctor,
            columns=[
                DisplayLookup(field='id', on_click=GoToEvent(url='/table/doctors/{id}/')),
                DisplayLookup(field='firstname'),
                DisplayLookup(field='secondname'),
                DisplayLookup(field='patronymic'),
                DisplayLookup(field='specialty'),
                DisplayLookup(field='photo'),

            ],  
        ),
        c.Paragraph(text="     "),
        *info("Отчет о действии", "Пользователь успешно добавлен, результат добавлен в логи", '/table/doctors', 'static-modal' ),

        c.Button(text="Добавить доктора", on_click=GoToEvent(url='/table/doctors/add')),
        title='Пользователи',
        
    )



@router.get('/doctors/{id}/', response_model=FastUI, response_model_exclude_none=True)
def user_profile(id: int) -> list[AnyComponent]:
    global old_id
    old_id = id
    doc = next(u for u in doctors if int(u.id) == id)
    print(doc)
    return demo_page(
        c.Link(components=[c.Text(text='Назад')], on_click=BackEvent()),
        c.Details(
            data=doc,
            fields=[
                DisplayLookup(field='id'),
                DisplayLookup(field='firstname'),
                DisplayLookup(field='secondname'),
                DisplayLookup(field='patronymic'),
                DisplayLookup(field='specialty'),
                DisplayLookup(field='photo'),

            ],
        ),

        c.Button(text="Изменить данные", on_click=GoToEvent(url='/table/doctors/update')),
        c.Paragraph(text="     "),
        c.Button(text="Удалить пользователя", on_click=PageEvent(name="delete-doc")),
        c.Form(
                    submit_url="/api/table/docdelete",
                    form_fields=[
                        c.FormFieldInput(name='id', title='', initial=int(id), html_type='hidden'),
                    ],
                    footer=[],
                    submit_trigger=PageEvent(name="delete-doc"),
                ),

        title=f"Доктор ID: {id}",
    )

@router.post("/docdelete")
def delete_doc(form: Annotated[CRUD, fastui_form(CRUD)]) -> list[AnyComponent]:
    psql.connect()
    psql.execute_query("DELETE FROM doctor WHERE id = %s", (form.id,))
    psql.disconnect()
    return [c.FireEvent(event=GoToEvent(url='/table/doctors'))]


@router.get("/doctors/update", response_model=FastUI, response_model_exclude_none=True)
def add_user_page():
    return [
        c.Page(
            components=[
                c.Heading(text='Обновить данные', level=2),
                c.Link(components=[c.Text(text='Назад')], on_click=BackEvent()),
                c.ModelForm(
                    model=DoctorUpdate,
                    submit_url="/api/table/docupdate"
                ),
            ]
        )
    ]



@router.post("/docupdate")
def add_user(form: Annotated[DoctorUpdate, fastui_form(DoctorUpdate)]) -> list[AnyComponent]:
    psql.connect()
    psql.execute_query("""UPDATE doctor SET firstname = %s,
                                             secondname = %s,
                                             patronymic = %s,
                                             specialty = %s
                                                 WHERE id = %s""", (form.firstname,
                                                                    form.secondname,
                                                                    form.patronymic,
                                                                    form.specialty,
                                                                    old_id))
    psql.disconnect()
    return [c.FireEvent(event=GoToEvent(url='/table/doctors'))]



@router.get('/doctors/add', response_model=FastUI, response_model_exclude_none=True)
def user_add() -> list[AnyComponent]:
    return demo_page(
        c.Heading(text='Добавить доктора', level=2),
        c.Link(components=[c.Text(text='Назад')], on_click=BackEvent()),
        c.ModelForm(
            model=DoctorInsert,
            submit_url="/api/table/docadd"
        ),

    )



@router.post("/docadd")
def add_doc(form: Annotated[DoctorInsert, fastui_form(DoctorInsert)]) -> list[AnyComponent]:
    psql.connect()
    password = hashlib.sha256(form.password.encode()).hexdigest()
    psql.execute_query("""INSERT INTO doctor (username,
                                                password,
                                                firstname,
                                                secondname,
                                                patronymic,
                                                specialty,
                                                photo) VALUES (%s, %s, %s, %s,%s, %s, %s)""",
                                                (form.username,
                                                  password, 
                                                  form.firstname, 
                                                  form.secondname, 
                                                  form.patronymic, 
                                                  form.specialty, 
                                                  form.photo))
    psql.disconnect() 
    return [c.FireEvent(event=GoToEvent(url='/table/doctors'))]