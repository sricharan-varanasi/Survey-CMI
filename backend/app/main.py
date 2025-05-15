# main.py
from fastapi import FastAPI
from app import models
from app.database import engine
from app.routers.questions import router as questions_router
from app.routers.submission import router as submission_router
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(questions_router)
app.include_router(submission_router)
