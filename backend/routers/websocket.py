from fastapi import WebSocket, APIRouter
import json
from backend.database.psql import PSQL
from backend.config import user, password, db_name, host, port

router = APIRouter(
    prefix="/ws"
)

psql = PSQL(db_name, user, password, host, port)


connections = {}  

@router.websocket("/{patient_id}")
async def websocket_endpoint(websocket: WebSocket, patient_id: int):
    await websocket.accept()
    connections[patient_id] = websocket

    try:
        while True:
            data = await websocket.receive_text()
            print(data)
            if data:
                await save_data_and_send_response(patient_id, data)
    except Exception as e:
        print(f"WebSocket connection closed with exception: {e}")
    finally:
        del connections[patient_id]
        await websocket.close() 



async def save_data_and_send_response(patient_id: int, data):
    try:
        json_data = json.loads(data)
        diagnosis = json_data["diagnosis"]
        healing = json_data["treatment"]
        message1 = {"message": diagnosis, "input": "d"}
        message2 = {"message": healing, "input": "h"}
        if patient_id in connections:
            await connections[patient_id].send_json(message1) 
            await connections[patient_id].send_json(message2)
        
        psql.connect()
        query = """UPDATE record 
                    SET diagnosis = %s , healing = %s 
                    WHERE id = %s;"""
        values = (diagnosis, healing, json_data["id"])
        psql.execute_query(query=query, params=values)
        psql.disconnect()
    except Exception as e:
        print(f"Error processing data: {e}")
