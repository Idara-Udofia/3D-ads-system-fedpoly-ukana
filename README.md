# WEB-BASED 3D VIDEO ANIMATION ADVERTISEMENT SYSTEM
## A Case Study of Federal Polytechnic, Ukana, Akwa Ibom State, Nigeria

An academic full-stack software development system that combines interactive 3D virtual campus exploration, multimedia video advertisement modules, academic programme curricula, admission guidance, and administrative content management.

---

## 1. Project Description

This web-based system serves as an interactive digital gateway for prospective students, parents, researchers, and visitors seeking admission and institutional information about **Federal Polytechnic, Ukana**.

### Key Research Objectives:
1. **3D Virtual Campus Environment:** Interactive WebGL exploration of campus landmarks, buildings, spatial layout, day/night lighting modes, and 2D map fallback.
2. **Interactive Video Advertisement Modules:** Categorized promotional video tours connected with direct call-to-action flows (Explore Campus &rarr; Curriculum &rarr; Entry Requirements &rarr; Enquire).
3. **Administrative Content Management & Analytics:** Full CRUD dashboard for programmes, facilities, 3D XYZ coordinates, videos, admission guidelines, announcements, and CSV analytics reporting.

---

## 2. Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, React Router DOM, Lucide Icons
- **3D Graphics:** Three.js (WebGL), OrbitControls, Raycasting, Soft Shadows, Procedural Architecture
- **Backend:** Node.js, Express.js
- **Persistence:** Atomic JSON Document Storage (`server/data/store.json`) with PostgreSQL / Cloud SQL schema readiness
- **Security:** HMAC-SHA256 Signed Bearer Tokens, Role-Based Access Control (Admin, Editor, Visitor)

---

## 3. Demo Login Credentials

For testing administrative and editorial capabilities:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@fedpolyukana.edu.ng` | `admin123` | Full CRUD, User Oversight, System Reports |
| **Editor** | `editor@fedpolyukana.edu.ng` | `editor123` | Content CRUD (Programmes, Facilities, Videos) |
| **Visitor** | `visitor@fedpolyukana.edu.ng` | `visitor123` | Public access |

*Note: One-click test login buttons are also provided directly on the `/admin/login` page.*

---

## 4. Environment Variables

Create `.env` using `.env.example`:

```bash
PORT=3000
NODE_ENV=development
JWT_SECRET=fedpolyukana_academic_secret_key_2026
```

---

## 5. Development & Running

### Install Dependencies:
```bash
npm install
```

### Run Dev Server (Frontend + Express API):
```bash
npm run dev
```
The server will boot on `http://localhost:3000`.

### Production Build:
```bash
npm run build
npm start
```

---

## 6. System Architecture & Features

### Public Portal:
- `/` - Admissions-focused homepage with 3D preview, featured videos, and notices.
- `/campus` - 3D Virtual Campus Studio with camera presets, daylight/sunset/night modes, and 2D map.
- `/programmes` - National Diploma directory with department filters and entry requirements.
- `/programmes/:id` - Detailed curriculum view and related promo tour videos.
- `/facilities` - Directory of campus buildings, laboratories, and workshops.
- `/videos` - Categorized video advertisement system with watch-count tracking.
- `/admission` - Official admission requirements, eligibility, and FAQ.
- `/student-life` - Student hostels, athletics, ICT clubs, and convocation gallery.
- `/announcements` - Institutional bulletins and notices.
- `/contact` - Official contacts and direct admissions enquiry form.

### Administrative Console (`/admin/*`):
- `/admin/dashboard` - Executive KPI summary, visitor volume charts, and device breakdown.
- `/admin/campus` - Real-time 3D spatial XYZ coordinates and landmark configuration.
- `/admin/programmes` - Manage academic curricula and career pathways.
- `/admin/facilities` - Manage facilities and photo assets.
- `/admin/videos` - Upload video URLs, set thumbnails, and track viewer metrics.
- `/admin/admission` - Update admission requirements dynamically.
- `/admin/enquiries` - Triage prospective student queries (Pending, Reviewed, Resolved).
- `/admin/reports` - Generate and download CSV reports.

---

## 7. Demonstration Content Policy

In accordance with institutional guidelines, all prototype 3D models and sample figures are clearly identified as **DEMO CONTENT** and can be replaced with official institutional data through the administrator dashboard.
