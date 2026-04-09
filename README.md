# Mentor-Mentee System

A complete MERN stack mentor-mentee platform with role-based dashboards for admin, mentor, and mentee users.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Auth: JWT + bcrypt
- Realtime: Socket.io
- API Client: Axios

## Folder Structure

```text
root/
  frontend/
    .env.example
    index.html
    package.json
    postcss.config.js
    tailwind.config.js
    vite.config.js
    src/
      assets/
      components/
        admin/
        chat/
        common/
        layout/
        mentee/
        mentor/
      context/
      hooks/
      pages/
        admin/
        mentee/
        mentor/
        public/
      routes/
      services/
      utils/
      App.jsx
      index.css
      main.jsx
  backend/
    .env.example
    package.json
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      seed/
      services/
      sockets/
      utils/
      app.js
      server.js
  README.md
```

## Features

- Role-based authentication for admin, mentor, and mentee
- Mentor discovery with search and category-aware profiles
- Mentorship request flow with accept/reject/cancel support
- Session booking and session tracking
- Realtime one-to-one chat with Socket.io
- Goal and progress tracking
- Reviews and ratings
- Notifications
- Admin moderation, user management, mentor approvals, and category management

## Backend Setup

1. Go to the server folder:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Copy environment variables:

```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB connection string and JWT secret.

5. Run the API:

```bash
npm run dev
```

## Frontend Setup

1. Open a new terminal and go to the client folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Copy environment variables:

```bash
cp .env.example .env
```

4. Run the frontend:

```bash
npm run dev
```

## Seed Demo Data

From the `server` folder:

```bash
npm run seed
```

Demo accounts after seeding:

- Admin: `admin@mentorapp.com` / `password123`
- Mentor: `aarav@mentorapp.com` / `password123`
- Mentor: `priya@mentorapp.com` / `password123`
- Mentee: `riya@mentorapp.com` / `password123`
- Mentee: `dev@mentorapp.com` / `password123`

## Important API Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/mentors`
- `GET /api/mentors/:id`
- `GET /api/requests`
- `POST /api/requests`
- `PATCH /api/requests/:id`
- `GET /api/sessions`
- `POST /api/sessions`
- `GET /api/messages`
- `GET /api/messages/:userId`
- `POST /api/messages`
- `GET /api/goals`
- `POST /api/goals`
- `GET /api/notifications`
- `GET /api/admin/dashboard`

## How To Run Locally

1. Start MongoDB locally or provide a MongoDB Atlas URI.
2. Run `npm install` inside both `server` and `client`.
3. Create `.env` files from both `.env.example` files.
4. Seed the backend with `npm run seed` in `server`.
5. Start the backend with `npm run dev` in `server`.
6. Start the frontend with `npm run dev` in `client`.
7. Open `http://localhost:5173`.

## How To Test

- Register a new mentor or mentee account from the UI.
- Login with a seeded mentee account and send a mentorship request.
- Login with a seeded mentor account and accept that request.
- Create a session and a goal from mentor or mentee workflows.
- Open chat pages from both accounts to verify realtime messaging.
- Login as admin to view the moderation and analytics sections.

## Notes

- The project is structured to be deployment-ready and easy to extend.
- Avatar upload and Cloudinary config are scaffolded but not deeply integrated into the current UI.
- Availability management is kept intentionally simple in this version to avoid unnecessary scheduling complexity.
