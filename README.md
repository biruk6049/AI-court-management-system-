# Astraea AI - Real-Time Court Management System

![Astraea AI System](https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200)

**Astraea AI** is a modern, real-time single-page web application (SPA) built for digital judicial administration, real-time case tracking, courtroom schedule management, document repository, and AI-assisted legal research.

Powered by **React JS**, **Vite**, **Supabase Authentication**, **PostgreSQL Database**, and **Real-Time Subscriptions**.

---

## ⚡ Key Features

- 🔒 **Supabase Authentication & Role-Based Access (RBAC):** Supports real email/password authentication or quick one-click role switching between **Judge**, **Lawyer**, **Clerk**, and **Administrator**.
- ⚖️ **Real-Time Case Management:** Create, track, and update legal cases with procedural timelines, status badges, priority levels, assigned judges, and defense counsel.
- 📅 **Interactive Judicial Schedule & Courtroom Allocations:** Manage court sessions, arraignments, preliminary hearings, and trial calendars with automated room conflict checking.
- 📁 **Case Document Repository:** Securely upload, categorize, and inspect case files (Orders, Evidence, Reports, Filings) with AI-powered document auto-summarization.
- 🤖 **Astraea AI Legal Research Assistant:** Context-aware chatbot trained on current docket records capable of drafting motions, performing case triage scoring, and checking legal precedents.
- 📊 **Court Analytics & Throughput Metrics:** Visual breakdown of active vs. resolved cases, clearance rates, judicial load distribution, and average resolution times.
- ⚡ **Dual Engine Architecture:** Works seamlessly connected to **Live Supabase Cloud** or in **Local Engine Mode** with zero configuration required.

---

## 🛠️ Modern Tech Stack

- **Frontend Core:** [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling & Aesthetics:** Custom CSS Design System with Glassmorphism, CSS Variables, and Dark/Light theme toggle
- **Database & Auth:** [Supabase JS Client](https://supabase.com/docs) (PostgreSQL, Row Level Security, Realtime `postgres_changes` channels)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 📂 Clean Project Structure

```
c:\Users\Biruk\Desktop\Ai court Managment System\
├── src/                          # Modern React Application Source
│   ├── components/               # React UI Components (Navbar, Sidebar, Modals)
│   ├── context/                  # AuthContext & CourtContext (Realtime Data State)
│   ├── lib/                      # Supabase Client Wrapper (Live & Local Fallback)
│   ├── pages/                    # Page Views (Dashboard, Cases, Schedule, Docs, AI, Analytics, Settings)
│   ├── App.jsx                   # Main React Entry & Router Layout
│   ├── main.jsx                  # React DOM Mount Point
│   └── index.css                 # Glassmorphic CSS Design System
├── index.html                    # Single Page Application Entry
├── supabase_schema.sql           # PostgreSQL Database Creation & Seed Script
├── package.json                  # React & Supabase Dependencies
├── vite.config.js                # Vite Server Configuration
└── .env.example                  # Environment Variables Template
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v16+ or higher) & npm installed.

### Installation & Local Execution

1. Clone or navigate to the project directory:
   ```bash
   cd "Ai court Managment System"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:3000`.

---

## 🗄️ Connecting to Supabase Cloud Database

1. Create a free project on [Supabase](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase Dashboard.
3. Open `supabase_schema.sql` from this project, copy its contents, and execute it in Supabase to provision all tables, policies, and initial seed data.
4. Go to your Supabase **Project Settings -> API** to copy your Project URL and Anon Public Key.
5. In the running Astraea AI app, click the **Supabase Settings** tab in the sidebar (or top right pill), paste your URL & Key, and click **Save & Connect Supabase**!

---

## 📜 License
This project is open-source for educational and judicial technology demonstration purposes.
