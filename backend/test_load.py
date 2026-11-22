import os
os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

import traceback

try:
    print("Attempting to import app.main...", flush=True)
    import app.main
    print("FastAPI app loaded successfully!", flush=True)
except Exception:
    print("\n--- CRASHED! HERE IS THE REAL ERROR ---", flush=True)
    traceback.print_exc()