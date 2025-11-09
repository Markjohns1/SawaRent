#!/bin/bash

echo "Starting Property Management System..."

python backend/run.py &
BACKEND_PID=$!

cd frontend && npm run dev &
FRONTEND_PID=$!

wait $BACKEND_PID $FRONTEND_PID
