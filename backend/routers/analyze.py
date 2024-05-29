from typing import List
from fastapi import APIRouter, HTTPException, Query
from backend.database.psql import PSQL
from backend.config import user, password, db_name, host, port
from fastapi.responses import JSONResponse
from backend.models.analyzeData import AnalyzeData
from backend.models.patsientAnalyzes import PatsientAnalyzes
from backend.models.createAnalyze import CreateAnalyze


router = APIRouter(
    prefix="/analyze"
)

psql = PSQL(db_name, user, password, host, port)


@router.get("/get_analyze", response_model=List[AnalyzeData])
async def get_analyze() -> List[AnalyzeData]: 
    try:
        psql.connect()
        query = "SELECT id, name, photo FROM analyzeData"
        result = psql.fetch_all(query)
        psql.disconnect()
        
        if result:
            analyze = []
            for row in result:
                id = row[0]
                name = row[1]
                photo = row[2]
                analyze.append(AnalyzeData(id=id,
                               name=name,
                               photo=photo))
                
            return analyze
        else:
            raise HTTPException(status_code=404, detail="No analyze found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




@router.get("/get_patsient_analyzes", response_model=List[PatsientAnalyzes])
async def get_patsient_analyzes(id: int = Query(None)) -> List[PatsientAnalyzes]:
    try:
        psql.connect()
        
        query = f"""SELECT analyzeSchedule.id,
                        analyzeData.id,
                        analyzeData.name,
                        analyzeSchedule.analyze_date,
                        analyzeData.photo,
                        analyzeSchedule.analyze_result
                        FROM analyzeSchedule
                        JOIN analyzeData ON analyzeSchedule.analyze_id = analyzeData.id
                        JOIN patsient ON analyzeSchedule.patsient_id = patsient.id
                        WHERE patsient.id = {id};"""
        result = psql.fetch_all(query=query)
        psql.disconnect()
        analyzes = []
        for row in result:
                id = row[0]
                analyze_id = row[1]
                analyze_name = row[2]
                date = row[3].strftime("%Y-%m-%d")
                photo = row[4]
                result = row[5] if row[5] is not None else ""
                analyzes.append(PatsientAnalyzes(id=id,
                                           analyze_id=analyze_id,
                                           analyze_name=analyze_name,
                                           date=date,
                                           photo=photo,
                                           result=result
                                           ))
        return analyzes
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.post("/create_analyze", response_class=JSONResponse)
async def create_analyze(data: CreateAnalyze) -> JSONResponse:
    try:
        psql.connect()

        query = """INSERT INTO analyzeSchedule (analyze_id, patsient_id, analyze_date)
                    values (%s, %s, %s)"""
        
        values = (data.id, data.patsient_id, data.date)
        psql.execute_query(query=query, params=values)
        psql.disconnect()
        return JSONResponse(content={"data": "Успешно"}, status_code=200)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@router.get("/get_ready_analyzes", response_model=List[PatsientAnalyzes])
async def get_patsient_analyzes(id: int = Query(None)) -> List[PatsientAnalyzes]:
    try:
        psql.connect()
        
        query = f"""SELECT analyzeSchedule.id,
                        analyzeData.id,
                        analyzeData.name,
                        analyzeSchedule.analyze_date,
                        analyzeData.photo,
                        analyzeSchedule.analyze_result
                        FROM analyzeSchedule
                        JOIN analyzeData ON analyzeSchedule.analyze_id = analyzeData.id
                        JOIN patsient ON analyzeSchedule.patsient_id = patsient.id
                        WHERE patsient.id = %s
                        AND analyzeSchedule.analyze_result IS NOT NULL;""" 
        value = (id,)
        result = psql.fetch_all(query=query, params=value)
        psql.disconnect()
        analyzes = []
        for row in result:
            id = row[0]
            analyze_id = row[1]
            analyze_name = row[2]
            date = row[3].strftime("%Y-%m-%d")
            photo = row[4]
            result = row[5]
            analyzes.append(PatsientAnalyzes(id=id,
                                             analyze_id=analyze_id,
                                             analyze_name=analyze_name,
                                             date=date,
                                             photo=photo,
                                             result=result
                                             ))
        return analyzes
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
