import json
from mangum import Mangum
from app.main import app

@app.get("/health")
def health():
    return {"status": "ok"}

handler = Mangum(app)