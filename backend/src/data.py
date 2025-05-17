from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import SQLModel, select

from auth import UserDep
from database import Chat, Message, SessionDep, get_next_user_chat_id

router = APIRouter(
    prefix="/data",
    tags=["data"]
)

def get_user_chat(user_chat_id: str, user_id: str, db: SessionDep):
    chat = db.exec(select(Chat).where(Chat.user_id == user_id).where(Chat.user_chat_id == user_chat_id)).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found.")
    if chat.user_id != user_id:
        raise HTTPException(status_code=401, detail="Unauthorized.")
    return chat

@router.get('/chat/{chat_id}', response_model=Chat)
def get_chat_model(chat_id: str, user: UserDep, db: SessionDep):
    chat = get_user_chat(user_chat_id=chat_id, user_id=user['user_id'], db=db)
    return chat

def get_chat_messages(chat_id: str, user: UserDep, db: SessionDep):
    chat = get_user_chat(user_chat_id=chat_id, user_id=user['user_id'], db=db)
    messages = db.exec(
        select(Message).join(Chat).where(Message.chat_id == chat.chat_id).where(Chat.user_id == user['user_id'])
    ).all()
    if messages != [] and not messages:
        raise HTTPException(status_code=404, detail="Chat not found.")
    return messages

@router.get("/chat/{chat_id}/messages", response_model=List[Message])
def get_messages(messages: Annotated[Chat, Depends(get_chat_messages)]):
    return messages

@router.get('/chat/{chat_id}/model', response_model=str)
def get_chat_model(chat_id: str, user: UserDep, db: SessionDep):
    curr_chat = get_user_chat(user_chat_id=chat_id, user_id=user['user_id'], db=db)
    return curr_chat.model

class ChatCreationRequest(SQLModel):
    selected_model: str

@router.post('/chat/create', status_code=201, response_model=Chat)
def add_chat(chat_creation_request: ChatCreationRequest, db: SessionDep, user: UserDep):
    try:
        chat = Chat(
            model=chat_creation_request.selected_model,
            user_id=user['user_id'],
            user_chat_id=get_next_user_chat_id(db, user_id=user['user_id'])
        )
        db.add(chat)
        db.commit()
        db.refresh(chat)
        return chat;
    except Exception:
        raise HTTPException(status_code=500, detail="Unknown error: couldn't create chat.")

@router.delete("/chat/{chat_id}/delete")
def delete_item(chat_id: str, db: SessionDep, user: UserDep):
    chat_to_delete = get_user_chat(user_chat_id=chat_id, user_id=user['user_id'], db=db)
    if not chat_to_delete:
        raise HTTPException(status_code=404, detail="Chat not found")
    
    db.delete(chat_to_delete)
    db.commit()
    
    return { 'ok': 'Chat deleted.'}

class UserChatExtended(SQLModel):
    chat: Chat
    title: str

class UserChats(SQLModel):
    chats: List[UserChatExtended]

@router.get('/chats', response_model=UserChats)
async def get_user_chats(user: UserDep, db: SessionDep):
    chats = db.exec(select(Chat).where(Chat.user_id == user['user_id'])).all()
    chats_extended = []
    for chat in chats:
        chat_first_message = db.exec(select(Message).join(Chat).where(Message.chat_id == chat.chat_id ).where(Chat.user_id == user['user_id'])).first()
        if not chat_first_message:
            chats_extended.append(UserChatExtended(chat=chat, title="?"))
        else:
            chat_first_message_cut = chat_first_message.content[:60]
            chats_extended.append(UserChatExtended(chat=chat, title=chat_first_message_cut))
    return UserChats(chats=chats_extended)
