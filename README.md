# To-Do Flow

A full-stack task management application featuring responsive mobile and desktop dashboard views with weekly organization, real-time progress tracking, and interactive scheduling.

Built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **MongoDB / Mongoose** (with built-in local persistence fallback).

---

## Features

- **Dual Viewport Interface**:
  - **Mobile App View**: Minimal mobile UI featuring an onboarding screen, calendar day strip, weekly progress tracker, swipe-to-delete gestures, and modal task management.
  - **Desktop View**: Widescreen productivity dashboard with 7-day schedule grid, priority filtering, and expandable weekly summaries.
  - **Side-by-Side Mode**: View mobile and desktop layouts concurrently with real-time shared state.
- **Weekly Task Organization (Mon – Sun)**:
  - Tasks grouped automatically by ISO week (Monday to Sunday).
  - Weekly cards tracking open vs. completed items with dynamic progress bars.
- **Task Management**:
  - Mandatory title, date, and start/end time.
  - Priority levels (`Low`, `Medium`, `High`) and optional descriptions.
  - Quick inline status toggling with optimistic UI updates.
  - Real-time keyword search.
- **Full-Stack Next.js API**:
  - RESTful endpoints for tasks, weekly stats, and demo data management.
  - Automatically connects to MongoDB when `MONGODB_URI` is configured, or seamlessly falls back to local file storage for zero-config execution.

---

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Database**: MongoDB / Mongoose (with offline fallback engine)

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. (Optional) Configure MongoDB
If you wish to use MongoDB, specify `MONGODB_URI` in `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/todo-flow
```
*(If omitted, the app automatically runs using the persistent local file store with zero configuration.)*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | Fetch tasks with query filters (`search`, `date`, `weekStart`, `status`, `priority`) |
| `POST` | `/api/tasks` | Create a new task |
| `GET` | `/api/tasks/:id` | Get single task details |
| `PUT` | `/api/tasks/:id` | Update task fields or toggle status |
| `DELETE` | `/api/tasks/:id` | Delete a task |
| `GET` | `/api/weeks` | Retrieve weekly statistics (open and completed counts) |
| `POST` | `/api/seed` | Reset and re-seed sample tasks |
