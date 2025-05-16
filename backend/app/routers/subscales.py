from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from fastapi import status
from typing import List

router = APIRouter(
    prefix="/subscales",
    tags=["Subscales"]
)

# GET all subscales
@router.get("/", response_model=List[schemas.SubscaleOut])
def get_subscales(db: Session = Depends(get_db)):
    return db.query(models.Subscale).all()

# POST new subscale
@router.post("/", response_model=schemas.SubscaleOut)
def create_subscale(subscale: schemas.SubscaleCreate, db: Session = Depends(get_db)):
    db_subscale = models.Subscale(**subscale.dict())
    db.add(db_subscale)
    db.commit()
    db.refresh(db_subscale)
    return db_subscale

# PATCH (update) subscale by ID
@router.patch("/{subscale_id}", response_model=schemas.SubscaleOut)
def update_subscale(subscale_id: int, subscale: schemas.SubscaleUpdate, db: Session = Depends(get_db)):
    db_subscale = db.query(models.Subscale).filter(models.Subscale.id == subscale_id).first()
    if not db_subscale:
        raise HTTPException(status_code=404, detail="Subscale not found")

    for key, value in subscale.dict().items():
        setattr(db_subscale, key, value)

    db.commit()
    db.refresh(db_subscale)
    return db_subscale

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subscale(id: int, db: Session = Depends(get_db)):
    db_sub = db.query(models.Subscale).filter(models.Subscale.id == id).first()
    if not db_sub:
        raise HTTPException(status_code=404, detail="Subscale not found")

    db.delete(db_sub)
    db.commit()
    return None
