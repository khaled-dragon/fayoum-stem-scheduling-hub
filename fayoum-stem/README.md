# Fayoum STEM Scheduling Hub

A production-ready, role-based academic scheduling platform for STEM High School Fayoum.

---

## Tech Stack

**Backend:** Node.js · Express.js · PostgreSQL · JWT · bcrypt · Multer · Helmet · express-rate-limit

**Frontend:** Next.js 14 (App Router) · Tailwind CSS · Framer Motion · Axios · React Hot Toast

---

## Project Structure

```
fayoum-stem/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── scheduleController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   └── db.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── schedules.js
│   ├── scripts/
│   │   └── seed.js
│   ├── uploads/          ← Auto-created
│   ├── .env
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── app/
    │   ├── auth/
    │   │   ├── signin/page.js
    │   │   └── signup/page.js
    │   ├── class/[className]/page.js
    │   ├── dashboard/page.js
    │   ├── globals.css
    │   ├── layout.js
    │   └── page.js
    ├── components/
    │   ├── ClassCard.js
    │   ├── LoadingSpinner.js
    │   ├── Navbar.js
    │   └── ParticleBackground.js
    ├── lib/
    │   └── auth.js
    ├── services/
    │   └── api.js
    ├── styles/
    │   └── globals.css
    ├── .env.local
    ├── next.config.js
    ├── package.json
    ├── postcss.config.js
    └── tailwind.config.js
```

---

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

---

## Setup Instructions

### 1. Clone / Extract the project

### 2. Setup PostgreSQL

Create a database:
```sql
CREATE DATABASE fayoum_stem;
```

### 3. Configure Backend Environment

Edit `backend/.env`:
```
PORT=5000
DATABASE_URL=postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/fayoum_stem
JWT_SECRET=your_super_secret_key_here_change_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### 4. Install Backend Dependencies

```bash
cd backend
npm install
```

### 5. Seed the Admin Account

```bash
cd backend
npm run seed
```

This creates the admin account:
- **Email:** kwael6774@gmail.com
- **Password:** 612009KH-e

### 6. Start the Backend

```bash
cd backend
npm run dev     # Development (with nodemon)
# or
npm start       # Production
```

Backend runs on: http://localhost:5000

### 7. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 8. Configure Frontend Environment

Edit `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 9. Start the Frontend

```bash
cd frontend
npm run dev     # Development
# or
npm run build && npm start  # Production
```

Frontend runs on: http://localhost:3000

---

## Features

### Authentication
- Student signup with name, email, phone, class, password
- Role-based login (admin vs student) — auto-detected from database
- JWT token authentication
- Brute-force protection via rate limiting

### Dashboard
- All 8 class sections displayed in grouped glassmorphism cards
- Live schedule status indicators
- Smooth hover animations and transitions

### Class Page
- View current schedule image
- Admin: drag-and-drop or click-to-upload new schedule
- Animated success feedback
- Empty state for classes with no schedule

### Security
- Helmet security headers
- Rate limiting on auth routes (10 req/15min for sign in, 5 req/hr for signup)
- File type validation (images only)
- File size limit (10MB)
- Passwords hashed with bcrypt (12 rounds)
- JWT expiry
- Role middleware on upload routes
- Never exposes password hashes in responses
- CORS configured to frontend origin only

---

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/signup | No | Register student |
| POST | /api/auth/signin | No | Login |
| GET | /api/auth/me | Bearer Token | Get current user |

### Schedules
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /api/schedules | Bearer Token | Get all schedules |
| GET | /api/schedules/:className | Bearer Token | Get class schedule |
| POST | /api/schedules/upload | Admin Token | Upload schedule image |

### Static
| URL | Description |
|-----|-------------|
| GET /uploads/:filename | Serve uploaded images |
| GET /api/health | Health check |

---

## Classes

| Grade | Sections |
|-------|----------|
| Grade 10 | G10 A, G10 B, G10 C |
| Grade 11 | G11 A, G11 B, G11 C |
| Grade 12 | G12 A, G12 B |

---

## Production Deployment

### Backend
- Set `NODE_ENV=production`
- Use a strong random `JWT_SECRET`
- Set `DATABASE_URL` to your production PostgreSQL
- Set `FRONTEND_URL` to your deployed frontend domain
- Consider using PM2 or a Docker container

### Frontend
- Set `NEXT_PUBLIC_API_URL` to your production API URL
- Run `npm run build` then `npm start`
- Or deploy to Vercel (zero config with Next.js)

---

## Design

- Deep navy dark theme (#03060f background)
- Accent blue glow effects
- Glassmorphism cards with hover lift
- Animated particle background with constellation connections
- Playfair Display + DM Sans typography
- Framer Motion page and component animations
- React Hot Toast notifications

---

Built for STEM High School Fayoum · Egypt
