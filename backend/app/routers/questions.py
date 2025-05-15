# routers/questions.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app import models, schemas
from app.database import SessionLocal
from sqlalchemy.orm import joinedload


router = APIRouter(prefix="/questions", tags=["Questions"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.QuestionOut)
def create_question(question: schemas.QuestionCreate, db: Session = Depends(get_db)):
    db_question = models.Question(text=question.text)
    db.add(db_question)
    db.flush()  # Get the ID before committing

    for opt in question.options:
        db_option = models.Option(**opt.dict(), question_id=db_question.id)
        db.add(db_option)

    db.commit()
    db.refresh(db_question)
    return db_question

@router.get("/", response_model=List[schemas.QuestionOut])
def get_questions(db: Session = Depends(get_db)):
    return db.query(models.Question).options(joinedload(models.Question.options)).all()