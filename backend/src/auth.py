from datetime import datetime, timedelta, timezone
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlmodel import SQLModel, select
from jose import ExpiredSignatureError, jwt, JWTError

from database import SessionDep, User

import bcrypt
bcrypt.__about__ = bcrypt #fixes AttributeError: module 'bcrypt' has no attribute '__about__'

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

ENCODE_SECRET_KEY = 'TECNOLOGIE_WEB_SECRET'
ENCODE_ALGORITHM = 'HS256'

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='/auth/login')

TokenDep = Annotated[str, Depends(oauth2_scheme)]

TOKEN_EXPIRE_TIME = 15
class Token(SQLModel):
    access_token: str
    token_type: str

async def create_token(user_id: int, username: str, expires_in: timedelta):
    expires_time = datetime.now(timezone.utc) + expires_in
    to_encode = { 
        'id': user_id, 
        'name': username, 
        'exp': expires_time,
        'iat': datetime.now(timezone.utc)
    }
    encoded_token = jwt.encode(to_encode, key=ENCODE_SECRET_KEY, algorithm=ENCODE_ALGORITHM)
    return Token(access_token=encoded_token, token_type="bearer")

async def get_current_user(token: TokenDep, db: SessionDep):
    try:
        jwt_payload = jwt.decode(
            token=token, 
            key=ENCODE_SECRET_KEY, 
            algorithms=[ENCODE_ALGORITHM]
        )
        username = jwt_payload.get('name')
        user_id = jwt_payload.get('id')

        if not username or not user_id:
            raise HTTPException(status_code=401, detail="Unauthorized.")
        
        db_user = db.exec(select(User).where(User.user_id == user_id)).first()
        if not db_user:
             raise HTTPException(status_code=401, detail="Unauthorized.")
        
        return { 'user_id': user_id, 'username': username, 'token': token }
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired.")
    except JWTError:
        raise HTTPException(status_code=401, detail="Unauthorized.")

UserDep = Annotated[dict, Depends(get_current_user)]

@router.get('/me')
async def get_user(user: UserDep):
    return user

class RegisterRequest(SQLModel):
    username: str
    password: str

@router.post('/register', status_code=201)
async def register_user(db: SessionDep, register_request: RegisterRequest):
    if db.exec(select(User).where(User.username == register_request.username)).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    
    try:
        username = register_request.username
        hashed_password = bcrypt_context.hash(register_request.password)
        new_user = User(
            username=username,
            hashed_password=hashed_password
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return { "user_id": new_user.user_id, "username": new_user.username }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Username already taken")


class UserPublic(SQLModel):
    user_id: str
    username: str

class LoginResponse(SQLModel):
    token: Token
    user: UserPublic

@router.post('/login', response_model=LoginResponse)
async def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: SessionDep):
    user = db.exec(select(User).where(User.username == form_data.username)).first()

    if not user or not bcrypt_context.verify(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    token = await create_token(user.user_id, user.username, timedelta(minutes=TOKEN_EXPIRE_TIME))
    
    return LoginResponse(
        token=token,
        user=UserPublic(
            user_id=str(user.user_id),
            username=user.username
        )
    )