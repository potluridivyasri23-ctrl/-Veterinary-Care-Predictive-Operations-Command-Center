# Deployment Guide

This project is split into two deployable parts:

- `frontend/` — React frontend
- `backend/` — Node/Express backend

## Recommended deployment stack

- Frontend: Netlify
- Backend: Render (or Railway, Heroku)
- Database: PostgreSQL

---

## Frontend deployment (Netlify)

1. Connect your Git repository to Netlify.
2. Set the deploy path to the `frontend/` folder.
3. Use these settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Keep `frontend/netlify.toml` in the repo.
5. In `frontend/netlify.toml`, replace:
   - `https://your-render-backend-url.com/api/:splat`
   with your backend URL, for example:
   - `https://my-vetops-backend.onrender.com/api/:splat`
6. After deploy, set the backend env var `FRONTEND_URL` in your backend host to your Netlify site URL.

### Why this works

Netlify redirects all `/api/*` requests to your backend URL. The frontend then uses the same domain for browser requests and avoids CORS issues.

---

## Backend deployment (Render)

1. Create a new Web Service on Render.
2. Connect the same repository.
3. Choose the `backend/` folder as the root.
4. Use these settings:
   - Environment: `Node 18` or newer
   - Build command: `npm install`
   - Start command: `npm start`
   - `PORT`: `5000` (optional; Render usually sets this automatically)
5. Add environment variables from `backend/.env.example`:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `GOOGLE_GEMINI_API_KEY`
   - `FRONTEND_URL` = `https://your-netlify-site.netlify.app`

### Database setup

1. Provision a PostgreSQL database on Render or another host.
2. Copy the database URL into `DATABASE_URL`.
3. Once the backend is deployed, run the seed command:
   - `cd backend && npm run seed`

If Render supports one-off shell commands, use that feature. Otherwise, seed locally against production database credentials and then deploy.

---

## Alternative backend hosts

You can also deploy the backend to Railway, Heroku, Fly.io, or any host that supports Node.js and PostgreSQL.

### Key requirements for any backend host

- `npm install` runs successfully
- `npm start` launches the server
- `DATABASE_URL` points to a PostgreSQL database
- `JWT_SECRET` is set to a secure value
- `FRONTEND_URL` points to your deployed frontend site
- Your backend exposes `/api/auth/login` for login

---

## Testing after deploy

Use these seeded credentials after deploy:

- Email: `opsadmin@vetcenter.com`
- Password: `VetPass123`

If login succeeds, the app is connected properly.

---

## Notes

- `backend/Procfile` is included for hosts that require it.
- The frontend proxy redirect is defined in `frontend/netlify.toml`.
- If you want a single-host production setup, you can also serve the built frontend from the backend, but this repo is currently structured for separate frontend and backend deployments.
