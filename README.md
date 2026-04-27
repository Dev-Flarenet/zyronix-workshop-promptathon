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

The frontend uses Vite env variables from `client/.env`:
- `VITE_FIREBASE_*` - Firebase project config
- `VITE_GEMINI_API_KEY` - Google Gemini API key
- `VITE_GEMINI_MODEL` - Gemini model name (default: `gemini-2.5-flash`)

## Firestore Security Rules

Use open rules during the workshop (see `firestore.rules`). Lock down after the event.

## Deployment Notes

Deploy only the `client` folder to Vercel for a client-side setup.

This setup exposes the Gemini API key to the browser. Only use it if you accept that tradeoff.
