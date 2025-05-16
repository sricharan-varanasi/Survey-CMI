from pydantic import BaseModel
from typing import List, Literal

# ----------------------------
# User & Response Submission
# ----------------------------

class UserCreate(BaseModel):
    name: str
    age: int
    gender: str

class ResponseCreate(BaseModel):
    question_id: int
    answer: str
    raw_score: int

class FullSubmission(BaseModel):
    user: UserCreate
    responses: List[ResponseCreate]

# ----------------------------
# Question & Option Management
# ----------------------------

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

# ----------------------------
# Subscale Management
# ----------------------------

class SubscaleBase(BaseModel):
    name: str
    method: Literal["sum", "average"]
    question_ids: List[int]

class SubscaleCreate(SubscaleBase):
    pass

class SubscaleUpdate(SubscaleBase):
    pass

class SubscaleOut(SubscaleBase):
    id: int

    class Config:
        orm_mode = True

# ----------------------------
# Normalization Table Management
# ----------------------------

class NormalizationEntryOut(BaseModel):
    age: int
    sex: str
    raw_score: int
    normalized_score: int

    class Config:
        orm_mode = True

