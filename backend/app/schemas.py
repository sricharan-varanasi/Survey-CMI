from pydantic import BaseModel
from typing import List

class OptionCreate(BaseModel):
    text: str
    raw_score: int

class QuestionCreate(BaseModel):
    text: str
    options: List[OptionCreate]

class OptionOut(OptionCreate):
    id: int
    class Config:
        orm_mode = True

class QuestionOut(BaseModel):
    id: int
    text: str
    options: List[OptionOut]

    class Config:
        orm_mode = True
