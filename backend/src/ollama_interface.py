from typing import Optional
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
import ollama
from sqlmodel import SQLModel

from data import get_user_chat
from database import Chat, Message, SessionDep
from auth import UserDep

router = APIRouter(
    prefix="/ollama",
    tags=["ollama"]
)

@router.get('/models')
async def get_models(user: UserDep):
    try:
        list = ollama.list()
        return list.model_dump()
    except ConnectionError:
        raise HTTPException(status_code=503, detail="Failed to connect to ollama.")
    except Exception:
        raise HTTPException(status_code=500, detail="Unknown error: could not get models.")

class OllamaChatRequest(SQLModel):
    selected_model: str
    user_message: str

@router.post('/chat')
@router.post('/chat/{user_chat_id}')
async def stream_message(
    request: OllamaChatRequest, 
    user: UserDep,
    db: SessionDep,
    user_chat_id: Optional[str] = None,
):
    try:
        selected_model = request.selected_model
        
        chat: Chat = get_user_chat(user_chat_id=user_chat_id, user_id=user['user_id'], db=db)
        if chat.model != selected_model:
            raise HTTPException(status_code=400, detail="Model doesn't match.")
            

        user_message = Message(
            role="user", 
            content=request.user_message, 
            chat_id=chat.chat_id
        )
        db.add(user_message)
        db.commit()
        
        mapped_messages = [{"role": msg.role, "content": msg.content} for msg in chat.messages]
        
        chat_response = ollama.chat(
            model=selected_model,
            messages=mapped_messages,
            stream=True
        )

        generated_message = Message(
            role="assistant",
            content="",
            chat_id=chat.chat_id
        )
        
        def streamer():
            for chunk in chat_response:
                yield chunk['message']['content']
                generated_message.content += chunk['message']['content']
            db.add(generated_message)
            db.commit()
        
        return StreamingResponse(streamer())
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        print(e, flush=True)
        raise HTTPException(status_code=500, detail="Unknown error: could not generate message.")




