from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import declarative_base, sessionmaker

# This creates a file called 'nids_feedback.db' in your backend folder
SQLALCHEMY_DATABASE_URL = "sqlite:///./nids_feedback.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Define the table where human answers will be saved
class FeedbackDB(Base):
    __tablename__ = "human_feedback"
    
    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(String, index=True)
    human_label = Column(String)
    notes = Column(String)

# Create the table automatically
Base.metadata.create_all(bind=engine)