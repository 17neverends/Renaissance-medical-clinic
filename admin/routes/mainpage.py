from __future__ import annotations as _annotations

from fastapi import APIRouter
from fastui import AnyComponent, FastUI
from fastui import components as c

from admin.middleware.shared import demo_page

router = APIRouter()


@router.get('/', response_model=FastUI, response_model_exclude_none=True)
def api_index() -> list[AnyComponent]:
    return demo_page(        c.Div(
            components=[
                c.Heading(text='commands.sql', level=2),
                c.Code(
                language='sql',
                    text="""CREATE TABLE patsient (
    id serial PRIMARY KEY,
    username text unique not null,
	password text not null,
    email text not null,
    phone varchar(12) not null,
    address varchar(70) not null,
    firstName varchar(20) not null,
    secondName varchar(20) not null,
    patronymic varchar(20) not null,
    gender varchar(7) not null,
    dob varchar(10) not null,
    joinDate varchar(10) not null,
    bloodType varchar(3) not null,
    discCode text unique not null,
    disc varchar(3) DEFAULT '10%' not null,
	photo text
);


CREATE OR REPLACE FUNCTION update_photo_based_on_gender()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.gender = 'Мужской' THEN
        NEW.photo = 'man.png';
    ELSE
        NEW.photo = 'girl.png';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER set_photo_based_on_gender
BEFORE INSERT OR UPDATE ON patsient
FOR EACH ROW
EXECUTE FUNCTION update_photo_based_on_gender();


CREATE TABLE doctor (
    id serial PRIMARY KEY,
    username text unique not null,
    password text not null,
    firstname varchar(20) not null,
    secondname varchar(20) not null,
    patronymic varchar(20) not null,
    specialty varchar(50) not null,
	photo text not null unique
);


INSERT INTO doctor (id, username, password, firstName, secondName, patronymic, specialty, photo)
VALUES 
    (1, 'doc1', 'e6c3da5b206634d7f3f3586d747ffdb36b5c675757b380c6a5fe5c570c714349', 'Мария', 'Крылова', 'Романовна', 'Терапевт', '/doc1.png'),
    (2, 'doc2', '1ba3d16e9881959f8c9a9762854f72c6e6321cdd44358a10a4e939033117eab9', 'Леонид', 'Романов', 'Иванович', 'Хирург', '/doc2.png'),
    (3, 'doc3', '3acb59306ef6e660cf832d1d34c4fba3d88d616f0bb5c2a9e0f82d18ef6fc167', 'Пётр', 'Славин', 'Иванович', 'Окулист', '/doc3.png');
-- pass2 --

INSERT INTO doctor (id, username, password, firstName, secondName, patronymic, specialty, photo)
VALUES 
    (4, 'doc4', 'e6c3da5b206634d7f3f3586d747ffdb36b5c675757b380c6a5fe5c570c714349', 'Семен', 'Крылов', 'Романович', 'Аллерголог', '/doc4.png'),
    (5, 'doc5', '1ba3d16e9881959f8c9a9762854f72c6e6321cdd44358a10a4e939033117eab9', 'Анастасия', 'Романова', 'Константиновна', 'Педиатр', '/doc5.png'),
    (6, 'doc6', '3acb59306ef6e660cf832d1d34c4fba3d88d616f0bb5c2a9e0f82d18ef6fc167', 'Иван', 'Берёзин', 'Львович', 'Окулист', '/doc6.png');

CREATE TABLE record (
    id serial PRIMARY KEY,
    doctor_id integer REFERENCES doctor(id),
    patsient_id integer REFERENCES patsient(id),
    record_date date not null,
    record_time_start time not null,
    record_time_end time not null,
    is_available boolean DEFAULT true,
	purpose text,
	diagnosis text,
	healing text
);

delete from record;
INSERT INTO record (doctor_id, record_date, record_time_start, record_time_end)
VALUES 
    (1, '2024-04-10', '10:00', '10:25'),
    (1, '2024-04-10', '10:30', '10:55'),
	(1, '2024-04-10', '11:00', '11:25'),
    (1, '2024-04-10', '11:30', '11:55');

INSERT INTO record (doctor_id, record_date, record_time_start, record_time_end)
VALUES 
    (3, '2024-04-16', '21:17', '21:18');


create table analyzeData (
    id serial primary key,
    name text,
    photo text
);

insert into analyzeData (name, photo) values 
('Общий анализ крови', '/analyze/blood.png'),
('Возбудители аллергии', '/analyze/allergy.png'),
('Глазное дно и сетчатка', '/analyze/eye.png');


create table analyzeSchedule (
    id serial primary key,
    analyze_id integer REFERENCES analyzeData(id),
    patsient_id integer REFERENCES patsient(id),
    analyze_date date,
    analyze_result json
);

create table contact(
	id serial primary key,
	firstname text,
	secondname text,
	mail text,
	mobile text,
	messageinfo text
);
""",
                ),
            ],
            class_name='border-top mt-3 pt-1',
        ),)


@router.get('/{path:path}', status_code=404)
async def api_404():
    return {'message': 'Not Found'}