# routers/questions.py
from fastapi import APIRouter, Depends, HTTPException
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

@router.get("/{question_id}", response_model=schemas.QuestionOut)
def get_question(question_id: int, db: Session = Depends(get_db)):
    question = (
        db.query(models.Question)
        .options(joinedload(models.Question.options))
        .filter(models.Question.id == question_id)
        .first()
    )
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    return question

@router.patch("/{question_id}", response_model=schemas.QuestionOut)
def update_question(question_id: int, data: schemas.QuestionCreate, db: Session = Depends(get_db)):
    question = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    # Update question text
    question.text = data.text

    # Clear old options
    db.query(models.Option).filter(models.Option.question_id == question_id).delete()

    # Add new options
    for opt in data.options:
        db_option = models.Option(**opt.dict(), question_id=question_id)
        db.add(db_option)

    db.commit()
    db.refresh(question)
    return question

@router.delete("/{question_id}")
def delete_question(question_id: int, db: Session = Depends(get_db)):
    question = db.query(models.Question).filter(models.Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    # First delete the options linked to the question
    db.query(models.Option).filter(models.Option.question_id == question_id).delete()

    # Then delete the question itself
    db.delete(question)
    db.commit()

    return {"message": "Question deleted successfully"}
