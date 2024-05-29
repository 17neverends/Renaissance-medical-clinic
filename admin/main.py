from __future__ import annotations as _annotations
from fastapi import FastAPI, HTTPException, Request, BackgroundTasks
from fastapi.responses import HTMLResponse, PlainTextResponse
from fastui import prebuilt_html
from ipaddress import ip_address
from admin.routes.tables import router as table_router
from admin.routes.mainpage import router as main_router
from admin.routes.contacts import router as contact_router
from admin.routes.analyzes import router as analyze_router
from admin.database.redis_admin import RedisClient
from admin.config import user, password, db_name, host, port

from admin.database.psql import PSQL

app = FastAPI()
redis = RedisClient()
psql = PSQL(db_name, user, password, host, port)

app.include_router(table_router, prefix='/api/table')
app.include_router(contact_router, prefix='/api/table')
app.include_router(analyze_router, prefix='/api/table')

app.include_router(main_router, prefix='/api')



@app.get('/favicon.ico', status_code=404, response_class=PlainTextResponse)
async def favicon_ico() -> str:
    return 'page not found'


def verify_token() -> bool:
    return bool(redis.get("admin"))

def verify_ip(ip: str) -> bool:
    return ip == '127.0.0.1'

def delete_past_records() -> None:
    psql.connect()
    query = """DELETE FROM record
                WHERE (record_date < CURRENT_DATE OR
                    (record_date = CURRENT_DATE AND record_time_end < CURRENT_TIME))
                    AND is_available = true;"""
    psql.execute_query(query=query)
    psql.disconnect()



@app.get('/{path:path}')
async def html_landing(request: Request, background_tasks: BackgroundTasks):
    client_ip = ip_address(request.client.host)
    if not verify_token() and not verify_ip(client_ip):
        raise HTTPException(status_code=403, detail="Отказано в доступе")
    background_tasks.add_task(delete_past_records)
    return HTMLResponse(prebuilt_html(title='Admin'))