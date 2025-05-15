# app/routers/submission.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import models, schemas

router = APIRouter(prefix="/submit", tags=["Submit"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def submit_form(data: schemas.FullSubmission, db: Session = Depends(get_db)):
    user = models.User(**data.user.dict())
    db.add(user)
    db.flush()  # Get user.id

    for resp in data.responses:
        db_resp = models.Response(user_id=user.id, **resp.dict())
        db.add(db_resp)

    db.commit()
    return {"message": "Submission saved!"}
