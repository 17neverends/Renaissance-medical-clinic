from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers.patsient import router as patsient
from backend.routers.record import router as record
from backend.routers.websocket import router as ws
from backend.routers.analyze import router as analyze
from backend.routers.contact import router as contact
from backend.routers.doctor import router as doctor
from backend.routers.admin import router as admin
app = FastAPI()

app.include_router(patsient)
app.include_router(record)
app.include_router(ws)
app.include_router(analyze)
app.include_router(contact)
app.include_router(doctor)
app.include_router(admin)


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)