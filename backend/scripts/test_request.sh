curl -X POST http://localhost:3000/gemini/stream \
    -H "Content-Type: application/json" \
    -d '{"history": [], "message": "Hello! How are you?"}'