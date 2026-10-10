# SmartCampus UI Recon Audit (Phase 0)

**Date:** October 10, 2026  
**Git Branch:** `ui-upgrade`  
**Application Stack:** MERN (React 19 + Vite 7 + Tailwind CSS v4 + Recharts + Lucide React + Socket.io)  
**Deployment Target:** Cloudflare Workers / Vercel  

---

## 1. Stack Detection & Configuration

| Category | Detected Library / Tool | Version | Notes |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React + React DOM | `^19.2.0` | Modern React 19 architecture |
| **Build Tool** | Vite | `^7.3.1` | Ultra-fast HMR & rollup bundling |
| **Styling Stack** | Tailwind CSS (v4) + PostCSS | `@tailwindcss/vite ^4.1.18` | `@import "tailwindcss";` in `src/index.css` |
| **Icon Library** | Lucide React | `^0.563.0` | Crisp SVG iconography |
| **Chart Library** | Recharts | `^3.7.0` | Responsive SVG area, line & pie charts |
| **Routing** | React Router DOM | `^7.13.1` | Declarative role-based protected routes |
| **Real-Time Layer** | Socket.io Client | `^4.8.3` | Live broadcasts, incident alerts, chat sync |
| **QR & Utilities** | html5-qrcode, qrcode.react, jspdf, html2canvas, canvas-confetti, moment | Various | Camera scanner, PDF export, celebration VFX |

---

## 2. Complete Route Catalog & Role Matrix

### 2.1 Public Routes (Unauthenticated)

| Route Path | Component File | Purpose & Key Interactions |
| :--- | :--- | :--- |
| `/` | `client/src/pages/Landing.jsx` | Marketing homepage with Hero, interactive video demo player, real-time feature showcases, trust badges, and portal entry points. |
| `/login` | `client/src/pages/Login.jsx` | Authentication portal with split credentials, password toggle, quick demo role chips (Admin, Student, Staff, Security), and login redirection. |
| `/signup` | `client/src/pages/Signup.jsx` | Registration for students/staff with validation, role selection, hostel assignment, and pending admin approval workflow. |
| `/scan-seat` | `client/src/pages/ScanSeat.jsx` | QR Code scanner for real-time seat reservation verification and attendance check-in. |

---

### 2.2 Student Portal (Role: `Student`)

| Route Path | Component File | Purpose & Key Interactions |
| :--- | :--- | :--- |
| `/student` | `client/src/pages/student/Dashboard.jsx` | Main Student Hub with tabbed views: Home (streak, badges, video walkthrough, library seat quick card, emergency SOS), Complaints/Issues logging with photo evidence, Campus Broadcasts, and Profile. |
| `/student/events` | `client/src/pages/student/StudentEvents.jsx` | Campus events feed, event registration, QR digital gate pass generation, and downloadable PDF ticket. |
| `/student/library` | `client/src/pages/student/StudentLibrary.jsx` | Real-time seat grid selector, slot booking, live occupancy indicators, and QR check-in status. |
| `/student/social` | `client/src/pages/student/SocialFeed.jsx` | Community social feed with post creation, image uploads, AI auto-moderation tags, and peer reactions. |
| `/student/chat` | `client/src/pages/student/ChatApp.jsx` | Real-time campus discussion channels with instant socket messaging and authorized deletion. |

---

### 2.3 Admin Portal (Role: `Admin`, `Employee`)

| Route Path | Component File | Purpose & Key Interactions |
| :--- | :--- | :--- |
| `/admin` | `client/src/pages/admin/Dashboard.jsx` | Executive control room with 5 tabs: **Overview** (live KPIs, AI insights, system video player), **Broadcasts** (full CRUD management), **Analytics** (water/elec/waste graphs & Excel export), **Operations** (zone management & live complaint triage), and **User Mgmt** (pending approvals & suspensions). |
| `/admin/events` | `client/src/pages/admin/AdminEvents.jsx` | Event creation, schedule management, participant tracking, and QR gate pass auditing. |
| `/admin/library` | `client/src/pages/admin/AdminLibrary.jsx` | Library layout configuration, seat capacity controls, and printable QR sheet generation. |
| `/admin/reports` | `client/src/pages/admin/AdminReports.jsx` | Incident & complaint resolution reports with status auditing and filtering. |
| `/admin/environment` | `client/src/pages/admin/AdminEnvironment.jsx` | AI Observer & eco-anomaly detection dashboard with telemetry feeds. |
| `/admin/timetable` | `client/src/pages/admin/AdminTimetable.jsx` | Class timetable management with bulk Excel drag-and-drop ingestion. |
| `/admin/social-moderation` | `client/src/pages/admin/AdminModeration.jsx` | Social feed content moderation console with flagged post inspection & removal. |
| `/admin/attendance-reports` | `client/src/pages/admin/SectionAttendanceReports.jsx` | Departmental & section attendance analytics with Excel export. |

---

### 2.4 Employee / Staff Portal (Role: `Employee`, `Admin`)

| Route Path | Component File | Purpose & Key Interactions |
| :--- | :--- | :--- |
| `/employee` | `client/src/pages/employee/Dashboard.jsx` | Staff Operations Console for triaging assigned campus maintenance tickets, updating task statuses, and monitoring zone alarms. |
| `/employee/infra-news` | `client/src/pages/employee/InfraNews.jsx` | Infrastructure updates, campus maintenance alerts, and engineering circulars. |

---

### 2.5 Security Guard Portal (Role: `Security`, `Admin`)

| Route Path | Component File | Purpose & Key Interactions |
| :--- | :--- | :--- |
| `/security` | `client/src/pages/security/Dashboard.jsx` | Gatehouse Security Portal with live camera QR scanner, gate pass verification, entry/exit logs, and emergency dispatch alerts. |

---

### 2.6 Fallback & Modals

| Route Path / Element | Component File | Purpose |
| :--- | :--- | :--- |
| `*` | React Router Navigate | Redirects unhandled routes to `/login` |
| Global Component | `client/src/components/EmergencyModal.jsx` | Global high-priority emergency alarm modal overlay responding to real-time socket events across all portals. |
| Global Component | `client/src/components/ChatbotWidget.jsx` | Floating AI Campus Assistant widget providing intelligent contextual help. |

---

## 3. Production Build & Performance Baseline

- **Vite Build Status:** `SUCCESS` (Zero compile errors)
- **Transformed Modules:** `2,497`
- **Output Asset Sizes:**
  - `dist/index.html`: `0.45 kB` (gzip: `0.29 kB`)
  - `dist/assets/index.css`: `119.50 kB` (gzip: `16.69 kB`)
  - `dist/assets/index.js`: `1,410.63 kB` (gzip: `411.63 kB`)
- **Build Execution Time:** `~9.8s`
- **Test Suite:** No test runner script present in `client/package.json` (`npm test` returns missing script).

---

## 4. Visual & Structural Inconsistencies Identified

1. **Theme Discrepancy:**
   - Landing page is currently light mode with subtle gradients.
   - Login page is predominantly deep slate/dark mode.
   - Dashboards mix white cards with slate backgrounds and different shade variations.
2. **Branding Variations:**
   - Inconsistent title text: "SmartCampus", "SmartCampusManagement", "Smart Campus", "CampusHub".
3. **Form Input Icon Alignment:**
   - In `Login.jsx` and `Signup.jsx`, leading icons can crowd placeholder and input text on smaller screens.
4. **Mobile & Viewport Responsiveness:**
   - Sidebar layouts on smaller viewports need standardized backdrop drawer behaviors and 44px minimum tap targets.
5. **Footer Details:**
   - Landing page footer currently lists "© 2024 SmartCampusManagement Inc." which needs updating to dynamic year and "Final-year project, Parul University".
