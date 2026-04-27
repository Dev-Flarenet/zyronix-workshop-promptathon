# Promptathon

An AI-Powered Prompt Evaluation Portal for School Workshops.

## Quick Start

### Frontend
```bash
cd client
npm install
npm run dev
```

## Environment Variables

Local development uses `client/.env`:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_GEMINI_API_KEY`
- `VITE_GEMINI_MODEL`

Vercel import file:
- Use `client/vercel.env.example` as the tracked template
- Use `client/.env.vercel` as your local import-ready file

Vercel runtime variables:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`

## Firestore Security Rules

Use open rules during the workshop (see `firestore.rules`). Lock down after the event.

## Deployment Notes

Deploy only the `client` folder to Vercel.

The client fetches Gemini config from `client/api/runtime-config.js`, which reads Vercel environment variables at runtime.
