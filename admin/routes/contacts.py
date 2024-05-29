from typing import List
from fastapi import APIRouter
from fastui import AnyComponent, FastUI
from fastui import components as c
from fastui.components.display import DisplayLookup
from fastui.events import GoToEvent, PageEvent
from admin.config import user, password, db_name, host, port
from admin.database.psql import PSQL
from admin.middleware.shared import demo_page
from admin.models.contact import Contact

psql = PSQL(db_name, user, password, host, port)
router = APIRouter()



def fetch_contacts() -> List[Contact]:
    query = """SELECT   firstname,
                        secondname,
                        mail,
                        mobile,
                        messageinfo
                        FROM contact;"""
    psql.connect()
    data = psql.fetch_all(query=query)
    psql.disconnect()
    doctors = [Contact(firstname=row[0],
                  secondname=row[1],
                  mail=row[2],
                  mobile=row[3],
                  messageinfo=row[4]) for row in data]
    return doctors



def tabs() -> list[AnyComponent]:
    return [
        c.LinkList(
            links=[
                c.Link(
                    components=[c.Text(text='Данные')],
                    on_click=GoToEvent(url='/table/contacts'),
                    active='startswith:/table/contacts',
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





@router.get('/contacts', response_model=FastUI, response_model_exclude_none=True)
def contacts_view() -> list[AnyComponent]:
    global contacts
    contacts = fetch_contacts()
    return demo_page(
        *tabs(),
        c.Table(
            data=contacts,
            data_model = Contact,
            columns=[
                DisplayLookup(field='firstname'),
                DisplayLookup(field='secondname'),
                DisplayLookup(field='mail'),
                DisplayLookup(field='mobile'),
                DisplayLookup(field='messageinfo')
            ],  
        ),
        title='Обращения',
        
    )



