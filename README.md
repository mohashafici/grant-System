# Grant System

A full-stack web application for managing research grants, proposals, reviews, reports, announcements, and community discussions. The project consists of a backend (Node.js/Express/MongoDB) and a frontend (Next.js/React/Tailwind CSS).

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Setup Instructions](#setup-instructions)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Usage](#usage)
  - [Announcements](#announcements)
  - [Community Forum](#community-forum)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

The Grant System streamlines the process of managing research grants, including proposal submission, review, reporting, user management, announcements, and community discussions. It supports multiple user roles (admin, researcher, reviewer) and provides a modern, responsive UI.

## Features
- User authentication and role-based access
- Grant creation and management
- Proposal submission and tracking
- Review process for proposals
- Reporting and report uploads
- Announcements system (admin and public UI)
- Community forum (threads, replies, login-required modal, redirect after login)
- Admin dashboard for managing users, grants, announcements, resources, and notifications
- Responsive frontend UI

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
  backend/      # Node.js/Express API
    controllers/
    middleware/
    models/
    routes/
    config/
    uploads/
    app.js
    server.js
    package.json
  my-app/       # Next.js frontend
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
- MongoDB (local or cloud instance)

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
   - Create a `.env` file (if required) for DB connection and JWT secret.
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
- Access the frontend at [http://localhost:3000](http://localhost:3000)
- The frontend communicates with the backend API for authentication, grant management, proposals, reviews, reports, announcements, and community forum.
- Use different user roles to access admin, researcher, and reviewer features.

### Announcements
- **Public Page:** `/announcements` displays all announcements. Filter and search are available.
- **Admin UI:** `/admin/announcements` allows admins to add and delete announcements. Requires admin login.
- **Backend Endpoints:**
  - `GET /api/announcements` — List all announcements
  - `POST /api/announcements` — Create announcement (admin only)
  - `DELETE /api/announcements/:id` — Delete announcement (admin only)

### Community Forum
- **Public Threads Page:** `/community` lists all threads. Anyone can view threads and their replies.
- **Thread Details:** `/community/[id]` shows a thread and all replies. Anyone can view.
- **Posting:**
  - Only logged-in users can start a new thread or reply to a thread.
  - If not logged in, clicking "Reply" or "Start a New Thread" opens a modal prompting login or registration.
  - After login/register, users are redirected back to the community page or thread to continue their action.
- **Backend Endpoints:**
  - `GET /api/community` — List all threads
  - `GET /api/community/:id` — Get thread by ID
  - `POST /api/community` — Create thread (login required)
  - `POST /api/community/:id/reply` — Add reply to thread (login required)

### Researcher Grants
- The "My Proposals" card has been removed from the browse grants page for a cleaner experience.

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
