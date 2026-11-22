import os
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

import uvicorn
from app.main import app

if __name__ == "__main__":
    print("STARTING SERVER VIA RUN.PY...")
    uvicorn.run(app, host="127.0.0.1", port=8000)