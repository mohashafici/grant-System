# Grant System

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Grant%20System-blue)](https://grant-system.vercel.app/)

## Live Demo

Access the deployed system here: [https://grant-system.vercel.app/](https://grant-system.vercel.app/)

---

## Overview

The Grant System is a full-stack web application for managing research grants, proposals, reviews, reports, announcements, and community discussions. It streamlines the process of grant discovery, application, review, and administration for researchers, reviewers, and administrators. The system features a modern, responsive UI and supports multiple user roles (admin, researcher, reviewer).

---

## Key Features
- User authentication and role-based access (admin, researcher, reviewer)
- Grant search, creation, and management
- Proposal submission, tracking, and document upload
- Reviewer assignment and review process (manual and AI/GPT-based)
- Dynamic reporting (monthly, per-user, per-grant, exportable)
- Announcements system (admin and public UI)
- Community forum (threads, replies, login-required posting)
- Admin dashboard for managing users, grants, announcements, resources, and notifications
- Contact form with database storage and admin review
- Responsive frontend UI (mobile-friendly)
- File storage via Supabase
- Emergency and specialized support sections

---

## How It Works

1. **Researchers** register, search for grants, submit proposals, and track their status.
2. **Reviewers** are assigned proposals, submit evaluations, and view their review history.
3. **Admins** manage users, grants, proposals, announcements, resources, and generate/export reports.
4. **All users** can access support, community forums, and announcements.
5. **Contact form** submissions are stored in the database for admin review.

---

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (via Mongoose)
- JWT Authentication

### Frontend
- Next.js (React)
- Tailwind CSS
- TypeScript

---

## Folder Structure

```
grant-system/
  backend/         # Node.js/Express API
    controllers/
    middleware/
    models/
    routes/
    config/
    uploads/
    app.js
    server.js
    package.json
  my-app/          # Next.js frontend
    app/
    components/
    hooks/
    lib/
    public/
    styles/
    package.json
    README.md
```

---

## Setup Instructions

### Prerequisites
- Node.js (v16+ recommended)
- npm or pnpm
- MongoDB (cloud instance)

### Backend
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   pnpm install
   ```
3. Configure environment variables:
   - Create a `.env` file for DB connection and JWT secret.
4. Start the backend server:
   ```sh
   npm start
   # or
   node server.js
   ```
   The backend will run on `http://localhost:5000` by default.

### Frontend
1. Navigate to the frontend folder:
   ```sh
   cd my-app
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   pnpm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
   The frontend will run on `http://localhost:3000` by default.

---

## Usage
- Access the frontend at [http://localhost:3000](http://localhost:3000) or the [Live Demo](https://grant-system.vercel.app/)
- The frontend communicates with the backend API for authentication, grant management, proposals, reviews, reports, announcements, and community forum.
- Use different user roles to access admin, researcher, and reviewer features.

---

## Main Modules & Endpoints

### Announcements
- **Public Page:** `/announcements` displays all announcements. Filter and search available.
- **Admin UI:** `/admin/announcements` allows admins to add and delete announcements (admin login required).
- **Backend Endpoints:**
  - `GET /api/announcements` – List all announcements
  - `POST /api/announcements` – Create announcement (admin only)
  - `DELETE /api/announcements/:id` – Delete announcement (admin only)

### Community Forum
- **Public Threads Page:** `/community` lists all threads. Anyone can view threads and their replies.
- **Thread Details:** `/community/[id]` shows a thread and all replies. Anyone can view.
- **Posting:**
  - Only logged-in users can start a new thread or reply.
  - If not logged in, clicking "Reply" or "Start a New Thread" opens a modal prompting login or registration.
  - After login/register, users are redirected back to the community page or thread to continue their action.
- **Backend Endpoints:**
  - `GET /api/community` – List all threads
  - `GET /api/community/:id` – Get thread by ID
  - `POST /api/community` – Create thread (login required)
  - `POST /api/community/:id/reply` – Add reply to thread (login required)

### Contact & Support
- **Contact Form:** `/contact` allows users to submit inquiries, which are stored in the database for admin review.
- **Specialized Support:** Users can reach out to specific support teams (application, technical, reviewer, general).
- **Emergency Support:** 24/7 hotline for urgent issues.

### Reporting
- **Admin Reports:** `/admin/reports` provides dynamic, interactive reports (monthly, per-user, per-grant, exportable as CSV).
- **Backend Endpoints:**
  - `GET /api/reports/analytics`, `GET /api/reports/user-stats`, `GET /api/reports/grant-stats`, etc.

---

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

1. Fork the repo
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

---

## License

This project is licensed under the MIT License.
