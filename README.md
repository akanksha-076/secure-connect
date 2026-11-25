# Secure Connect and Communication Platform

Web Dev III - Lab 4

## Features
- Signup and login with bcrypt password hashing
- JWT authentication and protected routes
- Role-based access control (user / admin)
- Secure Notes API (CRUD, per-user)
- Real-time chat using Socket.IO
- Event-driven logging using EventEmitter
- Environment variables using dotenv

## Run
1. npm install
2. Create a .env file with PORT, MONGO_URI, JWT_SECRET
3. node server.js

## API
- POST /api/auth/signup
- POST /api/auth/login
- GET /api/notes (protected)
- POST /api/notes (protected)
- PUT /api/notes/:id (protected)
- DELETE /api/notes/:id (protected)