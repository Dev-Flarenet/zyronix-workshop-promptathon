# Promptathon

An AI-Powered Prompt Evaluation Portal for School Workshops.

## Quick Start

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## Environment Variables

Copy `.env` to `server/.env` and fill in your keys:
- `GEMINI_API_KEY` - Google Gemini API key
- `GEMINI_MODEL` - Gemini model name (default: `gemini-2.5-flash`)
- `PORT` - Backend server port (default: 3001)

The frontend uses Vite env variables from `client/.env`:
- `VITE_FIREBASE_*` - Firebase project config
- `VITE_API_BASE_URL` - Backend URL

## Firestore Security Rules

Use open rules during the workshop (see `firestore.rules`). Lock down after the event.

## Deployment Notes

Deploy this repo to Vercel as two separate projects from the same GitHub repository:

- `client` as the frontend Vite project
- `server` as the backend Express project

Set `VITE_API_BASE_URL` in the frontend project to the deployed backend URL.
