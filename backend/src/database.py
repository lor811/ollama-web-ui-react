from datetime import datetime
from pathlib import Path
from typing import Annotated, List, Optional
from fastapi import Depends
from sqlmodel import Field, Relationship, Session, SQLModel, create_engine, select, func

sqlite_file = Path(__file__).resolve().parent / "database" / "ollama_web_ui.db"
sqlite_url = f"sqlite:///{sqlite_file}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)

class User(SQLModel, table=True):
    user_id: Optional[int] = Field(primary_key=True)
    username: str = Field(index=True, unique=True)
    hashed_password: str = Field()

    chats: List["Chat"] = Relationship(back_populates="user")

class Chat(SQLModel, table=True):
    chat_id: Optional[int] = Field(primary_key=True)
    user_chat_id: int = Field(index=True, nullable=False)
    model: str = Field(index=True)
    creation_date: str = Field(default=datetime.now().strftime("%d/%m/%y"), index=True)
    
    user_id: int = Field(foreign_key="user.user_id")
    user: User = Relationship(back_populates="chats")
    messages: List["Message"] = Relationship(back_populates="chat", sa_relationship_kwargs={"cascade": "all, delete"})

class Message(SQLModel, table=True):
    message_id: Optional[int] = Field(primary_key=True)
    role: str
    content: str
    sent_date: str = Field(default=datetime.now().strftime("%d/%m/%y"))
    sent_time: str = Field(default=datetime.now().strftime("%H:%M"))

    chat_id: int = Field(foreign_key="chat.chat_id", nullable=False)
    chat: Chat = Relationship(back_populates="messages")

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

def get_next_user_chat_id(db: SessionDep, user_id: str):
    max_id = db.exec(
        select(func.max(Chat.user_chat_id))
        .where(Chat.user_id == user_id)
    ).first()
    next_id = max_id or 0
    return next_id + 1

