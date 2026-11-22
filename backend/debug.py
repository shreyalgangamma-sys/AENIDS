import traceback

print("1. Trying to import app.main...")
try:
    from app.main import app
    print("2. Success! The app loaded perfectly.")
    print("App:", app)
except Exception as e:
    print("\n❌ CRASHED! Here is the real error:")
    traceback.print_exc()