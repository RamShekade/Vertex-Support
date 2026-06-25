# Vertex-Support

A full-stack AI-powered customer support chat application built as part of the **Spur Founding Full-Stack Engineer Take-Home Assignment**.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- TanStack React Query

### Backend

- Node.js
- Express
- TypeScript
- SQLite (better-sqlite3)

### Generation Model

- Google Gemini 2.5 Flash (`gemini-2.5-flash`)

### Deployment

- Frontend: Cloudflare Pages
- Backend: Render

---

# Project Structure

```
frontend/
    src/
        components/
        hooks/
        services/
        models/

Backend/
    src/
        routes/
        services/
        repository/
        db/
        models/
```

---

# Running Locally

## 1. Clone the repository

```bash
git clone https://github.com/RamShekade/Vertex-Support
cd Vertex-Support
```

---

## Backend Setup

Navigate to the backend folder.

```bash
cd Backend
```

Install dependencies.

```bash
npm install
```

Create a `.env` file.

```env
GEMINI_API_KEY=your_google_gemini_api_key
PORT=3000
```

Start the development server.

```bash
npm run dev
```

The backend will start on

```
http://localhost:3000
```

---

## Frontend Setup

Navigate to the frontend folder.

```bash
cd frontend
```

Install dependencies.

```bash
npm install
```

Create a `.env` file.

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

Run the application.

```bash
npm run dev
```

The frontend will start on

```
http://localhost:5173
```

---

# Database Setup

This project uses **SQLite** with **better-sqlite3**.

No manual migration or setup is required.

On application startup, the database is initialized automatically using:

---

# Environment Variables

## Backend (place env in backend folder)

please add gemini api key here :

```env
GEMINI_API_KEY=your_google_gemini_api_key
PORT=3000
```

## Frontend (place env in frontend folder)

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

---

# API

## POST `/api/message`

Creates a new conversation (if needed), stores the user's message, generates an AI response, stores the AI reply, and returns both the conversation ID and assistant response.

Request

```json
{
  "conversationId": "optional",
  "message": "Where is my order?"
}
```

Response

```json
{
  "conversationId": "conversation-id",
  "message": "Your order can be tracked from your account dashboard."
}
```

---

## GET `/api/conversation/:conversationId`

Returns the complete conversation history.

---

## GET `/api/conversations`

Returns all previous conversations ordered by most recent.

---

# Architecture

The backend follows a layered architecture to keep responsibilities separated.

```
Routes
    ↓
Services
    ↓
Repository
    ↓
SQLite Database
```

### Routes

Responsible for request validation and HTTP responses.

### Services

Contains business logic and LLM integration.

### Repository

Handles all SQLite operations including conversations and messages.

### Database

SQLite is initialized automatically during server startup.

---

# LLM Integration

Provider:

- Google Gemini

Model:

- `gemini-2.5-flash`

The LLM interaction is encapsulated inside a dedicated service.

---

# Validation & Error Handling

The application includes several safeguards:

- Empty messages are rejected.
- Maximum message length validation.
- Optimistic UI updates.
- Errors are classified with AppErrors prompting right message to users.
- Backend validation for malformed requests.

---

# Design Decisions

- SQLite was chosen for simplicity and because it satisfies the assignment requirements without requiring an external database.
- Gemini 2.5 Flash offers fast response times while keeping implementation straightforward.
- The backend is organized into layers to make future integrations easier.
- Models are kept common in both FE and BE to have consistentcy.

---

# Future Improvements

Given additional time, the following enhancements would be considered:

- caching conversation messges using redis for each conversationId
- Retry support for failed messages.
- Token usage tracking.
- PostgreSQL for production deployments.
- Authentication and user accounts.
- Rate limiting for per user usage.
- Better retrieval-augmented knowledge instead of prompt-based FAQs.

---

# Deployment

Frontend

- Cloudflare Pages

Backend

- Render

---

# Author

**Ram Shekade**
