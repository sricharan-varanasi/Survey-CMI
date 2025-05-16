from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
import csv
from typing import List

router = APIRouter(prefix="/subscales", tags=["Subscales"])

@router.get("/", response_model=List[schemas.SubscaleOut])
def get_subscales(db: Session = Depends(get_db)):
    return db.query(models.Subscale).all()

@router.post("/", response_model=schemas.SubscaleOut)
def create_subscale(subscale: schemas.SubscaleCreate, db: Session = Depends(get_db)):
    db_sub = models.Subscale(**subscale.dict())
    db.add(db_sub)
    db.commit()
    db.refresh(db_sub)
    return db_sub

@router.patch("/{id}", response_model=schemas.SubscaleOut)
def update_subscale(id: int, subscale: schemas.SubscaleUpdate, db: Session = Depends(get_db)):
    db_sub = db.query(models.Subscale).filter(models.Subscale.id == id).first()
    if not db_sub:
        raise HTTPException(status_code=404, detail="Subscale not found")
    for key, value in subscale.dict(exclude_unset=True).items():
        setattr(db_sub, key, value)
    db.commit()
    db.refresh(db_sub)
    return db_sub

@router.post("/{subscale_id}/upload-normalization/")
async def upload_normalization_table(subscale_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    contents = await file.read()
    decoded = contents.decode("utf-8").splitlines()
    reader = csv.DictReader(decoded)

    db.query(models.NormalizationEntry).filter_by(subscale_id=subscale_id).delete()

    for row in reader:
        entry = models.NormalizationEntry(
            subscale_id=subscale_id,
            age=int(row["age"]),
            sex=row["sex"],
            raw_score=int(row["raw_score"]),
            normalized_score=int(row["normalized_score"]),
        )
        db.add(entry)
    db.commit()
    return {"detail": "Normalization table uploaded successfully"}

@router.get("/{subscale_id}/normalization-table/", response_model=List[schemas.NormalizationEntryOut])
def get_normalization_table(subscale_id: int, db: Session = Depends(get_db)):
    return db.query(models.NormalizationEntry).filter_by(subscale_id=subscale_id).all()
