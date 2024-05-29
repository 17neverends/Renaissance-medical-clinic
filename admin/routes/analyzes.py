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
from admin.models.analyze import Analyze
from admin.models.analyzeUpdate import AnalyzeUpdate
from admin.models.crud import CRUD

psql = PSQL(db_name, user, password, host, port)
router = APIRouter()




def fetch_analyzes() -> List[Analyze]:
    query = """SELECT   id,
                        name,
                        photo
                        FROM analyzedata;"""
    psql.connect()
    data = psql.fetch_all(query=query)
    psql.disconnect()
    analyzes = [Analyze(id=row[0],
                  name=row[1],
                  photo=row[2]
                  ) for row in data]
    return analyzes



def tabs() -> list[AnyComponent]:
    return [
        c.LinkList(
            links=[
                c.Link(
                    components=[c.Text(text='Анализы')],
                    on_click=GoToEvent(url='/table/analyzes'),
                    active='startswith:/table/analyzes',
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



@router.get('/analyzes', response_model=FastUI, response_model_exclude_none=True)
def users_view() -> list[AnyComponent]:
    global analyzes
    analyzes = fetch_analyzes()
    return demo_page(
        *tabs(),
        c.Table(
            data=analyzes,
            data_model = Analyze,
            columns=[
                DisplayLookup(field='id', on_click=GoToEvent(url='/table/analyzes/{id}/')),
                DisplayLookup(field='name'),
                DisplayLookup(field='photo')

            ],  
        ),
        c.Paragraph(text="     "),

        c.Button(text="Добавить анализ", on_click=GoToEvent(url='/table/analyzes/add')),
        title='Анализы',
        
    )



@router.get('/analyzes/{id}/', response_model=FastUI, response_model_exclude_none=True)
def user_profile(id: int) -> list[AnyComponent]:
    global old_id
    old_id = id
    analyze = next(u for u in analyzes if int(u.id) == id)
    return demo_page(
        c.Link(components=[c.Text(text='Назад')], on_click=BackEvent()),
        c.Details(
            data=analyze,
            fields=[
                DisplayLookup(field='id'),
                DisplayLookup(field='name'),
                DisplayLookup(field='photo')

            ],
        ),

        c.Button(text="Изменить данные", on_click=GoToEvent(url='/table/analyzes/update')),
        c.Paragraph(text="     "),
        c.Button(text="Удалить", on_click=PageEvent(name="delete-analyzes")),
        c.Form(
                    submit_url="/api/table/docdelete",
                    form_fields=[
                        c.FormFieldInput(name='id', title='', initial=int(id), html_type='hidden'),
                    ],
                    footer=[],
                    submit_trigger=PageEvent(name="delete-analyzes"),
                ),

        title=f"Доктор ID: {id}",
    )

@router.post("/analyzesdelete")
def delete_doc(form: Annotated[CRUD, fastui_form(CRUD)]) -> list[AnyComponent]:
    psql.connect()
    psql.execute_query("DELETE FROM analyzedata WHERE id = %s", (form.id,))
    psql.disconnect()
    return [c.FireEvent(event=GoToEvent(url='/table/analyzes'))]


@router.get("/analyzes/update", response_model=FastUI, response_model_exclude_none=True)
def add_user_page():
    return [
        c.Page(
            components=[
                c.Heading(text='Обновить данные', level=2),
                c.Link(components=[c.Text(text='Назад')], on_click=BackEvent()),
                c.ModelForm(
                    model=AnalyzeUpdate,
                    submit_url="/api/table/analyzeupdate"
                ),
            ]
        )
    ]



@router.post("/analyzesupdate")
def add_user(form: Annotated[AnalyzeUpdate, fastui_form(AnalyzeUpdate)]) -> list[AnyComponent]:
    psql.connect()
    psql.execute_query("""UPDATE analyzedata SET name = %s,
                                             photo = %s
                                                 WHERE id = %s""", (form.name,
                                                                    form.photo,
                                                                    old_id))
    psql.disconnect()
    return [c.FireEvent(event=GoToEvent(url='/table/analyzes'))]



@router.get('/analyzes/add', response_model=FastUI, response_model_exclude_none=True)
def user_add() -> list[AnyComponent]:
    return demo_page(
        c.Heading(text='Добавить пользователя', level=2),
        c.Link(components=[c.Text(text='Назад')], on_click=BackEvent()),
        c.ModelForm(
            model=AnalyzeUpdate,
            submit_url="/api/table/analyzesadd"
        ),

    )



@router.post("/analyzesadd")
def add_doc(form: Annotated[AnalyzeUpdate, fastui_form(AnalyzeUpdate)]) -> list[AnyComponent]:
    psql.connect()
    psql.execute_query("""INSERT INTO analyzedata (name,
                                                photo) VALUES (%s, %s)""",
                                                (form.name,
                                                  form.photo))
    psql.disconnect() 
    return [c.FireEvent(event=GoToEvent(url='/table/analyzes'))]