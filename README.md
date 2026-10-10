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

## 3. Staff Authentication

The staff login at `/admin/login` accepts institutional email and password. Demo accounts and quick-fill credentials are not provided. The first administrator must be provisioned using `INITIAL_ADMIN_EMAIL` and `INITIAL_ADMIN_PASSWORD` in the server environment; use a unique password of at least 12 characters. These values are used only when the user store has no active administrator. After signing in, administrators can create Admin and Editor accounts in User Management.

Authenticated sessions are held in a signed, eight-hour `HttpOnly`, `SameSite=Strict` cookie (and use the `Secure` flag in production); the browser does not store session tokens in local storage. Administrators are directed to `/admin/dashboard`, while Editors are directed to `/editor/dashboard` and can manage video advertisements only.

---

## 4. Environment Variables

Create `.env` using `.env.example`. Development can start without a `.env`; the server generates a temporary random session key, so sessions end when the server restarts. For production, generate a signing secret with Node.js, for example `node -p "require('node:crypto').randomBytes(48).toString('base64url')"`, and set a unique initial administrator password. `JWT_SECRET` must contain at least 32 bytes of random data:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=<generated-random-secret>
INITIAL_ADMIN_EMAIL=admin@fedpolyukana.edu.ng
INITIAL_ADMIN_PASSWORD=<unique-password-at-least-12-characters>
```

Never use the example placeholders as production secrets. Existing seeded demo accounts are removed on database load; provision the first administrator before signing in.

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
