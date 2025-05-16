from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

# Load your PostgreSQL connection URL
DATABASE_URL = os.getenv("DATABASE_URL")

# Create the engine
engine = create_engine(DATABASE_URL)

# Configure session
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

Base = declarative_base()

# ✅ Dependency for DB session (used with Depends)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
