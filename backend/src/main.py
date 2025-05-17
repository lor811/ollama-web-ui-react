from pathlib import Path
from fastapi import FastAPI
from fastapi.concurrency import asynccontextmanager
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import ollama

import auth
import data
from database import create_db_and_tables
import ollama_interface

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield
    print("Shutting down FastAPI... stopping ollama models.", flush=True)
    try:
        models = ollama.ps().model_dump()['models']
        for model in models:
            ollama.chat(
                model=model['model'],
                keep_alive=0
            )
            print(f"{model['model']} stopped successfully", flush=True)
    except ConnectionError:
        print(f"ollama was not running.", flush=True)
        

app = FastAPI(lifespan=lifespan)
app.include_router(auth.router, prefix='/api')
app.include_router(ollama_interface.router, prefix='/api')
app.include_router(data.router, prefix='/api')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

project_path = Path(__file__).resolve().parent.parent.parent
frontend_dist_path = project_path / "frontend" / "dist"
app.mount("/static", StaticFiles(directory=frontend_dist_path), name="static")
app.mount("/assets", StaticFiles(directory=frontend_dist_path / "assets"), name="assets")

@app.get("/{full_path:path}")
async def serve_react():
    return FileResponse(path=frontend_dist_path / "index.html")
