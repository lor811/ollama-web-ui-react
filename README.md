# ollama-web-ui-react

A simple full-stack React+FastAPI-based web interface for interacting with [ollama](https://ollama.com/)

## 🚀 Features

- 🔌 Uses ollama API to interact with the server hosted locally on your machine
- 💬 Chat UI with streaming response
- 🎛️ Model selection and context management
- 🧠 Supports [multiple models](https://ollama.com/search)

You must have [ollama](https://ollama.com/) installed on your local machine, serving a local server, and at least one model installed to run the application.
Once you installed ollama, run the server:
```sh
ollama serve
```
and download at least one model using:
```sh
ollama pull {model_name}
```

For example:
```sh
ollama pull llama3.2:1b
```

---

## 🛠️ Installation

First, clone the repository and go to the project root:
```sh
git clone https://github.com/lor811/ollama-web-ui-react.git
cd ollama-web-ui-react
```

### On macOS

#### 🧩 Frontend
**1. Install dependencies**
```sh
cd frontend
npm install
```
**2. Build the frontend project**
```sh
npm run build
```

#### ⚙️ Backend
**3. Setup envinronment**
```sh
cd ../backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
**4. Run FastAPI**
```sh
cd src
uvicorn main:app --host 127.0.0.1 --port 8000
```

The app should now be available at http://localhost:8000

### On Windows

#### 🧩 Frontend
**1. Install dependencies**
```powershell
cd frontend
npm install
```
**2. Build the frontend project**
```powershell
npm run build
```

#### ⚙️ Backend
**3. Setup envinronment**
```powershell
cd ..\backend
python -m venv .venv
.venv\Scripts\activate.bat
pip install -r requirements.txt
```
**4. Run FastAPI**
```powershell
cd src
uvicorn main:app --host 127.0.0.1 --port 8000
```

The app should now be available at http://localhost:8000