from typing import List
from fastapi import APIRouter, HTTPException, Query
from backend.database.psql import PSQL
from backend.config import user, password, db_name, host, port
from backend.models.availabletime import AvailableTime
from backend.models.createrecord import CreateRecord
from backend.models.patsientrecords import PatsientRecords
from backend.models.intermediate import Intermediate
from backend.models.recordhistory import RecordHistory
from backend.models.appointment import Appointment
from backend.models.archive import Archive
from backend.models.pastrecord import PastRecord
from fastapi.responses import JSONResponse


router = APIRouter(
    prefix="/record"
)

psql = PSQL(db_name, user, password, host, port)


@router.get("/get_doctors", response_class=JSONResponse)
async def get_doctors() -> JSONResponse: 
    try:
        psql.connect()
        query = "SELECT username, firstname, secondname, patronymic, specialty, photo, id FROM doctor"
        result = psql.fetch_all(query)
        psql.disconnect()
        
        if result:
            doctors = []
            for row in result:
                doctor_data = {
                    "username": row[0],
                    "firstName": row[1],
                    "secondName": row[2],
                    "patronymic": row[3],
                    "specialty": row[4],
                    "photo": row[5],
                    "id": row[6],
                }
                doctors.append(doctor_data)
                
            return JSONResponse(content={"data": doctors}, status_code=200)
        else:
            raise HTTPException(status_code=404, detail="No doctors found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/get_available_time", response_model=List[AvailableTime])
async def get_available_time(id: int = Query(None), date: str = Query(None), user_id: int = Query(None)) -> List[AvailableTime]:
    try:
        psql.connect()
        
        check_query = """SELECT COUNT(*)
                         FROM record
                         WHERE patsient_id = %s
                         AND record_date = %s AND doctor_id = %s"""
        check_values = (user_id, date, id)
        check_result = psql.fetch_one_or_none(check_query, check_values)
        if check_result[0] > 0:
            return []
        query = """SELECT id, record_time_start, record_time_end
                    FROM record
                    WHERE doctor_id = %s
                    AND record_date = %s
                    AND is_available = true
                    AND (
                        record_date > CURRENT_DATE 
                        OR (record_date = CURRENT_DATE AND record_time_start > CURRENT_TIME)
                    );
                    """
        
        values = (id, date)
        result = psql.fetch_all(query, values)
        psql.disconnect()
        available_times = []
        for row in result:
            record_id = row[0]
            start_time = row[1].strftime('%H:%M')
            end_time = row[2].strftime('%H:%M')    
            available_times.append(AvailableTime(id=record_id,start=start_time, end=end_time))
        return available_times
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




@router.post("/create_record", response_class=JSONResponse)
async def create_record(data: CreateRecord) -> JSONResponse:
    try:
        psql.connect()
        query = """UPDATE record SET patsient_id = %s, purpose = %s, is_available = false
            WHERE id = %s"""
        
        values = (data.patsient_id, data.purpose, data.id)
        psql.execute_query(query=query, params=values)
        psql.disconnect()
        return JSONResponse(content={"data": "Успешно"}, status_code=200)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.post("/delete_record", response_class=JSONResponse)
async def delete_record(id: int) -> JSONResponse:
    try:
        psql.connect()
        query = f"""UPDATE record SET patsient_id = null, purpose = null, is_available = true
            WHERE id = {id}"""
        
        psql.execute_query(query=query)
        psql.disconnect()
        return JSONResponse(content={"data": "Успешно"}, status_code=200)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




@router.get("/get_patsient_records", response_model=List[PatsientRecords])
async def get_patsient_records(id: int = Query(None)) -> List[PatsientRecords]:
    try:
        psql.connect()
        
        query = f"""SELECT doctor.firstName || ' ' || doctor.secondName || ' ' || doctor.patronymic,
                        record.record_date,
                        record.record_time_start,
                        record.record_time_end,
                        record.purpose,
                        doctor.photo,
                        doctor.specialty,
                        record.id
                        FROM record
                        JOIN doctor ON record.doctor_id = doctor.id
                        JOIN patsient ON record.patsient_id = patsient.id
                        WHERE patsient.id = {id}
                        ORDER BY 
                        record.record_date ASC,
                        record.record_time_start ASC;"""
        result = psql.fetch_all(query=query)
        psql.disconnect()
        records = []
        for row in result:
            doctor = row[0]
            record_date = row[1].strftime("%Y-%m-%d")
            record_start = row[2].strftime('%H:%M')
            record_end = row[3].strftime('%H:%M') 
            purpose = row[4]
            photo = row[5]
            specialty = row[6]
            record_id = row[7]
            records.append(PatsientRecords(doctor=doctor,
                                           record_date=record_date,
                                           record_start=record_start,
                                           record_end=record_end,
                                           purpose=purpose,
                                           photo=photo,
                                           specialty=specialty,
                                           record_id=record_id))
        return records
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


@router.get("/get_records_history", response_model=List[RecordHistory])
async def get_records_history(id: int = Query(None)) -> List[RecordHistory]:
    try:
        psql.connect()
        query = f"""SELECT 
                    doctor.firstName,
                    doctor.secondName,
                    doctor.patronymic,
                    doctor.specialty,
                    doctor.photo,
                    CONCAT(record.record_time_start, ' - ', record.record_time_end),
                    record.purpose,
                    record.diagnosis,
                    record.healing,
                    record.record_date
                
                FROM 
                    record
                JOIN 
                    doctor ON record.doctor_id = doctor.id
                JOIN 
                    patsient ON record.patsient_id = patsient.id
                WHERE 
                    record.purpose IS NOT NULL 
                    AND record.diagnosis IS NOT NULL 
                    AND record.healing IS NOT NULL
                    AND patsient.id = {id};"""
        result = psql.fetch_all(query=query)
        psql.disconnect()
        history = []
        for row in result:
            firstname = row[0]
            secondname = row[1]
            patronymic = row[2]
            specialty = row[3]
            photo = row[4]
            concat = row[5]
            purpose = row[6]
            diagnosis = row[7]
            healing = row[8]
            date = row[9].strftime("%Y-%m-%d")
            history.append(RecordHistory(firstname=firstname,
                                        secondname=secondname,
                                        patronymic=patronymic,
                                        specialty=specialty,
                                        photo=photo,
                                        concat=concat,
                                        purpose=purpose,
                                        diagnosis=diagnosis,
                                        healing=healing,
                                        date=date))
        print(history)
        return history
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


@router.get("/get_future_patsient_records", response_model=List[PatsientRecords])
async def get_patsient_records(id: int = Query(None)) -> List[PatsientRecords]:
    try:
        psql.connect()
        
        query = f"""SELECT doctor.secondName || ' ' || doctor.firstName || ' ' || doctor.patronymic,
                        record.record_date,
                        record.record_time_start,
                        record.record_time_end,
                        record.purpose,
                        doctor.photo,
                        doctor.specialty,
                        record.id
                        FROM record
                        JOIN doctor ON record.doctor_id = doctor.id
                        JOIN patsient ON record.patsient_id = patsient.id
                        WHERE patsient.id = {id}
                        AND record.diagnosis IS NULL 
                        AND record.healing IS NULL
                        ORDER BY 
                        record.record_date ASC,
                        record.record_time_start ASC;"""
        result = psql.fetch_all(query=query)
        psql.disconnect()
        records = []
        for row in result:
            doctor = row[0]
            record_date = row[1].strftime("%Y-%m-%d")
            record_start = row[2].strftime('%H:%M')
            record_end = row[3].strftime('%H:%M') 
            purpose = row[4]
            photo = row[5]
            specialty = row[6]
            record_id = row[7]
            records.append(PatsientRecords(doctor=doctor,
                                           record_date=record_date,
                                           record_start=record_start,
                                           record_end=record_end,
                                           purpose=purpose,
                                           photo=photo,
                                           specialty=specialty,
                                           record_id=record_id))
        return records
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


@router.get("/get_appointments", response_model=List[Appointment])
async def get_appointments(id: int = Query(None)) -> List[Appointment]:
    try:
        psql.connect()
        
        query = f"""SELECT patsient.secondName || ' ' || patsient.firstName || ' ' || patsient.patronymic,
                        record.record_date,
                        record.record_time_start,
                        record.record_time_end,
                        record.purpose,
                        patsient.photo,
                        record.id,
                        patsient.dob,
                        patsient.bloodtype,
                        patsient.gender,
                        patsient.id
                        FROM record
                        JOIN doctor ON record.doctor_id = doctor.id
                        JOIN patsient ON record.patsient_id = patsient.id
                        WHERE doctor.id = {id}
                        AND record.diagnosis IS NULL 
                        AND record.healing IS NULL;"""
        result = psql.fetch_all(query=query)
        psql.disconnect()
        records = []
        for row in result:
            patsient = row[0]
            record_date = row[1].strftime("%Y-%m-%d")
            record_start = row[2].strftime('%H:%M')
            record_end = row[3].strftime('%H:%M') 
            purpose = row[4]
            photo = row[5]
            record_id = row[6]
            dob = row[7]
            bloodType = row[8]
            gender = row[9]
            patsient_id = row[10]
            records.append(Appointment(record_id=record_id,
                                           patsient=patsient,
                                           record_date=record_date,
                                           record_start=record_start,
                                           record_end=record_end,
                                           purpose=purpose,
                                           photo=photo,
                                            dob = dob,
                                            bloodType = bloodType,
                                            gender = gender,
                                            patsient_id=patsient_id))
        return records
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.get("/get_archive", response_model=List[Archive])
async def get_archive(id: int = Query(None)) -> List[Archive]:
    try:
        psql.connect()
        query = f"""SELECT 
                    patsient.firstName,
                    patsient.secondName,
                    patsient.patronymic,
                    patsient.photo,
                    CONCAT(record.record_time_start, ' - ', record.record_time_end),
                    record.purpose,
                    record.diagnosis,
                    record.healing,
                    record.record_date
                FROM 
                    record
                JOIN 
                    doctor ON record.doctor_id = doctor.id
                JOIN 
                    patsient ON record.patsient_id = patsient.id
                WHERE 
                    record.purpose IS NOT NULL 
                    AND record.diagnosis IS NOT NULL 
                    AND record.healing IS NOT NULL
                    AND doctor.id = {id};"""
        result = psql.fetch_all(query=query)
        psql.disconnect()
        archive = []
        for row in result:
            firstname = row[0]
            secondname = row[1]
            patronymic = row[2]
            photo = row[3]
            concat = row[4]
            purpose = row[5]
            diagnosis = row[6]
            healing = row[7]
            date = row[8].strftime("%Y-%m-%d")
            archive.append(Archive(firstname=firstname,
                                        secondname=secondname,
                                        patronymic=patronymic,
                                        photo=photo,
                                        concat=concat,
                                        purpose=purpose,
                                        diagnosis=diagnosis,
                                        healing=healing,
                                        date=date))
        return archive
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


@router.get("/get_doctor_records", response_model=List[Appointment])
async def get_doctor_records(id: int = Query(None)) -> List[Appointment]:
    try:
        psql.connect()
        
        query = f"""SELECT patsient.secondName || ' ' || patsient.firstName || ' ' || patsient.patronymic,
                        record.record_date,
                        record.record_time_start,
                        record.record_time_end,
                        record.purpose,
                        patsient.photo,
                        record.id,
                        patsient.dob,
                        patsient.bloodtype,
                        patsient.gender,
                        patsient.id
                        FROM record
                        JOIN doctor ON record.doctor_id = doctor.id
                        JOIN patsient ON record.patsient_id = patsient.id
                        WHERE doctor.id = {id};"""
        result = psql.fetch_all(query=query)
        psql.disconnect()
        records = []
        for row in result:
            patsient = row[0]
            record_date = row[1].strftime("%Y-%m-%d")
            record_start = row[2].strftime('%H:%M')
            record_end = row[3].strftime('%H:%M') 
            purpose = row[4]
            photo = row[5]
            record_id = row[6]
            dob = row[7]
            bloodType = row[8]
            gender = row[9]
            patsient_id = row[10]
            records.append(Appointment(record_id=record_id,
                                           patsient=patsient,
                                           record_date=record_date,
                                           record_start=record_start,
                                           record_end=record_end,
                                           purpose=purpose,
                                           photo=photo,
                                            dob = dob,
                                            bloodType = bloodType,
                                            gender = gender,
                                            patsient_id=patsient_id))
        return records
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.get("/get_intermediate_result", response_model=Intermediate)
async def get_intermediate_result(id: int = Query(None)) -> Intermediate:
    try:
        psql.connect()
        
        query = """SELECT diagnosis, healing FROM record WHERE id = %s;"""
        value = (id, )
        result = psql.fetch_one_or_none(query=query, params=value)
        psql.disconnect()
        
        diagnosis, healing = result[0], result[1]
        intermediate = Intermediate(diagnosis=diagnosis if diagnosis is not None else "",
                                    healing=healing if healing is not None else "")
        return intermediate
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    



@router.get("/get_past_records", response_model=List[PastRecord])
async def get_past_records(pid: int = Query(None), did: int = Query(None), id: int = Query(None)) -> List[PastRecord]:
    try:
        psql.connect()
        
        
        query = f"""SELECT record.record_date,
                            record.record_time_start,
                            record.record_time_end,
                            record.purpose,
                            record.id,
                            record.diagnosis,
                            record.healing
                            FROM record
                            JOIN doctor ON record.doctor_id = doctor.id
                            JOIN patsient ON record.patsient_id = patsient.id
                            WHERE doctor.id = %s AND patsient.id = %s AND record.id != %s ;"""
        values = (did, pid, id)
        result = psql.fetch_all(query=query, params=values)
        psql.disconnect()
        records = []
        for row in result:
            record_date = row[0].strftime("%Y-%m-%d")
            record_start = row[1].strftime('%H:%M')
            record_end = row[2].strftime('%H:%M') 
            purpose = row[3]
            record_id = row[4]
            diagnosis = row[5]
            healing = row[6]
            records.append(PastRecord(record_id=record_id,
                                           diagnosis=diagnosis,
                                           record_date=record_date,
                                           record_start=record_start,
                                           record_end=record_end,
                                           purpose=purpose,
                                           healing=healing,
                                            ))
        return records
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    