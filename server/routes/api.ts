import { Router, Request, Response } from 'express';
import crypto from 'node:crypto';
import db, { hashPassword, isLegacyPasswordHash, verifyPassword } from '../db/database.js';
import { authenticate, requireRole, signToken, AuthenticatedRequest, SESSION_COOKIE } from '../middleware/auth.js';

const apiRouter = Router();
const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 10;
const SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000;
const DUMMY_PASSWORD_HASH = hashPassword(crypto.randomBytes(32).toString('hex'));

// ==========================================
// 1. AUTHENTICATION & USERS
// ==========================================
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};
  if (
    typeof email !== 'string' ||
    !email.trim() ||
    email.trim().length > 254 ||
    typeof password !== 'string' ||
    !password ||
    password.length > 128
  ) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const now = Date.now();
  const key = req.ip || req.socket.remoteAddress || 'unknown';
  let attempt = loginAttempts.get(key);
  if (!attempt || attempt.resetAt <= now) {
    attempt = { count: 0, resetAt: now + LOGIN_WINDOW_MS };
    loginAttempts.set(key, attempt);
  }
  if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
    res.setHeader('Retry-After', Math.ceil((attempt.resetAt - now) / 1000));
    return res.status(429).json({ error: 'Too many sign-in attempts. Try again later.' });
  }

  const user = db.getUserByEmail(email.trim().toLowerCase());
  const validPassword = verifyPassword(password, user?.password_hash ?? DUMMY_PASSWORD_HASH);
  if (!user || !validPassword || user.status !== 'active' || !['admin', 'editor'].includes(user.role)) {
    attempt.count += 1;
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  if (isLegacyPasswordHash(user.password_hash)) {
    db.updateUser(user.id, { password_hash: hashPassword(password) });
  }

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });
  loginAttempts.delete(key);
  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SESSION_MAX_AGE_MS,
    path: '/',
  });
  res.setHeader('Cache-Control', 'no-store');

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

apiRouter.post('/auth/logout', (_req: Request, res: Response) => {
  res.clearCookie(SESSION_COOKIE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
  res.setHeader('Cache-Control', 'no-store');
  return res.status(204).end();
});

apiRouter.get('/auth/me', authenticate, (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const user = db.getUserById(req.user.userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.setHeader('Cache-Control', 'no-store');

  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});

apiRouter.get('/users', authenticate, requireRole(['admin']), (_req: Request, res: Response) => {
  const users = db.getUsers().map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    status: u.status,
    created_at: u.created_at,
  }));
  res.json(users);
});

apiRouter.post('/users', authenticate, requireRole(['admin']), (req: Request, res: Response) => {
  const { name, email, password, role } = req.body ?? {};
  if (
    typeof name !== 'string' ||
    !name.trim() ||
    name.trim().length > 100 ||
    typeof email !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    email.trim().length > 254 ||
    typeof password !== 'string' ||
    password.length < 12 ||
    password.length > 128 ||
    !['admin', 'editor'].includes(role)
  ) {
    return res.status(400).json({
      error: 'Provide a name, valid email, password of 12-128 characters, and ADMIN or EDITOR role.',
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (db.getUserByEmail(normalizedEmail)) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const user = db.createUser({
    name: name.trim(),
    email: normalizedEmail,
    password_hash: hashPassword(password),
    role,
    status: 'active',
  });
  return res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    created_at: user.created_at,
  });
});

// ==========================================
// 2. ACADEMIC PROGRAMMES
// ==========================================
apiRouter.get('/programmes', (req: Request, res: Response) => {
  const { search, department } = req.query;
  let items = db.getProgrammes();

  if (department && typeof department === 'string') {
    items = items.filter(p => p.department.toLowerCase().includes(department.toLowerCase()));
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    items = items.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.department.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  res.json(items);
});

apiRouter.get('/programmes/:id', (req: Request, res: Response) => {
  const item = db.getProgrammeById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Programme not found' });
  res.json(item);
});

apiRouter.post('/programmes', authenticate, requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const { name, department, description, requirements, duration, career_prospects, image_url, video_id, status } = req.body;
  if (!name || !department || !description) {
    return res.status(400).json({ error: 'Name, department, and description are required' });
  }

  const created = db.createProgramme({
    name,
    department,
    description,
    requirements: Array.isArray(requirements) ? requirements : [requirements || ''],
    duration: duration || '2 Years Full-Time',
    career_prospects: Array.isArray(career_prospects) ? career_prospects : [career_prospects || ''],
    image_url: image_url || '/images/campus_complex_ukana_1791453435263.jpg',
    video_id: video_id || 'vid_tour',
    status: status || 'active',
  });

  res.status(201).json(created);
});

apiRouter.put('/programmes/:id', authenticate, requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateProgramme(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Programme not found' });
  res.json(updated);
});

apiRouter.delete('/programmes/:id', authenticate, requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const ok = db.deleteProgramme(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Programme not found' });
  res.json({ success: true, message: 'Programme deleted successfully' });
});

// ==========================================
// 3. CAMPUS FACILITIES
// ==========================================
apiRouter.get('/facilities', (req: Request, res: Response) => {
  const { category, search } = req.query;
  let items = db.getFacilities();

  if (category && typeof category === 'string' && category !== 'All') {
    items = items.filter(f => f.category.toLowerCase() === category.toLowerCase());
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    items = items.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q) ||
      f.location.toLowerCase().includes(q)
    );
  }

  res.json(items);
});

apiRouter.get('/facilities/:id', (req: Request, res: Response) => {
  const item = db.getFacilityById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Facility not found' });
  res.json(item);
});

apiRouter.post('/facilities', authenticate, requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const { name, category, description, location, image_url, video_id, status } = req.body;
  if (!name || !category || !description) {
    return res.status(400).json({ error: 'Name, category, and description are required' });
  }

  const created = db.createFacility({
    name,
    category,
    description,
    location: location || 'Main Campus, Ukana',
    image_url: image_url || '/images/campus_complex_ukana_1791453435263.jpg',
    video_id: video_id || 'vid_tour',
    status: status || 'active',
  });

  res.status(201).json(created);
});

apiRouter.put('/facilities/:id', authenticate, requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateFacility(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Facility not found' });
  res.json(updated);
});

apiRouter.delete('/facilities/:id', authenticate, requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const ok = db.deleteFacility(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Facility not found' });
  res.json({ success: true, message: 'Facility deleted successfully' });
});

// ==========================================
// 4. 3D CAMPUS LOCATIONS
// ==========================================
apiRouter.get('/campus', (_req: Request, res: Response) => {
  res.json(db.getCampusLocations());
});

apiRouter.get('/campus/:id', (req: Request, res: Response) => {
  const item = db.getCampusLocationById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Campus location not found' });
  res.json(item);
});

apiRouter.post('/campus', authenticate, requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const { name, category, description, building_type, position_x, position_y, position_z, rotation_x, rotation_y, rotation_z, scale, color, status, related_programme_id, related_facility_id, related_video_id } = req.body;
  if (!name || !category) {
    return res.status(400).json({ error: 'Name and category are required' });
  }

  const created = db.createCampusLocation({
    name,
    category,
    description: description || 'Prototype Campus Model location at Federal Polytechnic, Ukana.',
    building_type: building_type || 'academic',
    position_x: Number(position_x) || 0,
    position_y: Number(position_y) || 0,
    position_z: Number(position_z) || 0,
    rotation_x: Number(rotation_x) || 0,
    rotation_y: Number(rotation_y) || 0,
    rotation_z: Number(rotation_z) || 0,
    scale: Number(scale) || 1.0,
    color: color || '#059669',
    status: status || 'active',
    related_programme_id,
    related_facility_id,
    related_video_id,
  });

  res.status(201).json(created);
});

apiRouter.put('/campus/:id', authenticate, requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateCampusLocation(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Campus location not found' });
  res.json(updated);
});

apiRouter.delete('/campus/:id', authenticate, requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const ok = db.deleteCampusLocation(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Campus location not found' });
  res.json({ success: true, message: 'Campus location deleted successfully' });
});

// ==========================================
// 5. VIDEOS & MULTIMEDIA
// ==========================================
apiRouter.get('/videos', (req: Request, res: Response) => {
  const { category, featured } = req.query;
  let items = db.getVideos();

  if (category && typeof category === 'string' && category !== 'All') {
    items = items.filter(v => v.category.toLowerCase() === category.toLowerCase());
  }

  if (featured === 'true') {
    items = items.filter(v => v.featured);
  }

  res.json(items);
});

apiRouter.get('/videos/:id', (req: Request, res: Response) => {
  const item = db.getVideoById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Video not found' });
  res.json(item);
});

apiRouter.post('/videos/:id/views', (req: Request, res: Response) => {
  const updated = db.incrementVideoView(req.params.id);
  if (!updated) return res.status(404).json({ error: 'Video not found' });
  
  db.trackEvent({
    event_type: 'video_play',
    content_type: 'video',
    content_id: req.params.id,
    session_id: (req.headers['x-session-id'] as string) || 'anon_session',
    device_type: (req.headers['x-device-type'] as any) || 'desktop',
  });

  res.json({ views: updated.views });
});

apiRouter.post('/videos/:id/complete', (req: Request, res: Response) => {
  const updated = db.incrementVideoCompletion(req.params.id);
  if (!updated) return res.status(404).json({ error: 'Video not found' });

  db.trackEvent({
    event_type: 'video_complete',
    content_type: 'video',
    content_id: req.params.id,
    session_id: (req.headers['x-session-id'] as string) || 'anon_session',
    device_type: (req.headers['x-device-type'] as any) || 'desktop',
  });

  res.json({ completions: updated.completions });
});

apiRouter.post('/videos', authenticate, requireRole(['admin', 'editor']), (req: AuthenticatedRequest, res: Response) => {
  const { title, description, category, video_url, thumbnail_url, duration, duration_seconds, featured, status } = req.body;
  if (!title || !category || !video_url) {
    return res.status(400).json({ error: 'Title, category, and video_url are required' });
  }

  const created = db.createVideo({
    title,
    description: description || '',
    category,
    video_url,
    thumbnail_url: thumbnail_url || '/images/campus_complex_ukana_1791453435263.jpg',
    duration: duration || '03:00',
    duration_seconds: Number(duration_seconds) || 180,
    featured: Boolean(featured),
    status: status || 'published',
  });

  res.status(201).json(created);
});

apiRouter.put('/videos/:id', authenticate, requireRole(['admin', 'editor']), (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateVideo(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Video not found' });
  res.json(updated);
});

apiRouter.delete('/videos/:id', authenticate, requireRole(['admin', 'editor']), (req: AuthenticatedRequest, res: Response) => {
  const ok = db.deleteVideo(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Video not found' });
  res.json({ success: true, message: 'Video deleted successfully' });
});

// ==========================================
// 6. ANNOUNCEMENTS
// ==========================================
apiRouter.get('/announcements', (_req: Request, res: Response) => {
  res.json(db.getAnnouncements());
});

apiRouter.get('/announcements/:id', (req: Request, res: Response) => {
  const item = db.getAnnouncementById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Announcement not found' });
  res.json(item);
});

apiRouter.post('/announcements', authenticate, requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const { title, content, image_url, category, published_date, status } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const created = db.createAnnouncement({
    title,
    content,
    image_url: image_url || '/images/gate_ukana_monument_1791453421074.jpg',
    category: category || 'General',
    published_date: published_date || new Date().toISOString().slice(0, 10),
    status: status || 'published',
  });

  res.status(201).json(created);
});

apiRouter.put('/announcements/:id', authenticate, requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateAnnouncement(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Announcement not found' });
  res.json(updated);
});

apiRouter.delete('/announcements/:id', authenticate, requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const ok = db.deleteAnnouncement(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Announcement not found' });
  res.json({ success: true, message: 'Announcement deleted successfully' });
});

// ==========================================
// 7. ADMISSION INFORMATION
// ==========================================
apiRouter.get('/admission', (_req: Request, res: Response) => {
  res.json(db.getAdmissionInfo());
});

apiRouter.get('/admission/:id', (req: Request, res: Response) => {
  const item = db.getAdmissionInfoById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Admission info not found' });
  res.json(item);
});

apiRouter.post('/admission', authenticate, requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const { title, category, content, status } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const created = db.createAdmissionInfo({
    title,
    category: category || 'Overview',
    content,
    status: status || 'active',
  });

  res.status(201).json(created);
});

apiRouter.put('/admission/:id', authenticate, requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateAdmissionInfo(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Admission info not found' });
  res.json(updated);
});

apiRouter.delete('/admission/:id', authenticate, requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const ok = db.deleteAdmissionInfo(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Admission info not found' });
  res.json({ success: true, message: 'Admission entry deleted successfully' });
});

// ==========================================
// 8. ENQUIRIES
// ==========================================
apiRouter.get('/enquiries', authenticate, requireRole(['admin']), (_req: Request, res: Response) => {
  res.json(db.getEnquiries());
});

apiRouter.post('/enquiries', (req: Request, res: Response) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }

  const created = db.createEnquiry({
    name,
    email,
    phone: phone || '',
    subject: subject || 'Admission Inquiry',
    message,
  });

  db.trackEvent({
    event_type: 'enquiry',
    content_type: 'enquiry',
    content_id: created.id,
    session_id: (req.headers['x-session-id'] as string) || 'anon_session',
    device_type: (req.headers['x-device-type'] as any) || 'desktop',
  });

  res.status(201).json({ success: true, message: 'Enquiry received successfully. Our admissions team will get in touch.', enquiry: created });
});

apiRouter.patch('/enquiries/:id/status', authenticate, requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const { status } = req.body;
  if (!['pending', 'reviewed', 'resolved'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const updated = db.updateEnquiryStatus(req.params.id, status);
  if (!updated) return res.status(404).json({ error: 'Enquiry not found' });
  res.json(updated);
});

apiRouter.delete('/enquiries/:id', authenticate, requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const ok = db.deleteEnquiry(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Enquiry not found' });
  res.json({ success: true, message: 'Enquiry removed successfully' });
});

// ==========================================
// 9. ANALYTICS & EVENTS
// ==========================================
apiRouter.post('/analytics/events', (req: Request, res: Response) => {
  const { event_type, content_type, content_id, session_id, device_type } = req.body;
  if (!event_type) return res.status(400).json({ error: 'event_type is required' });

  const event = db.trackEvent({
    event_type,
    content_type: content_type || 'general',
    content_id: content_id || '',
    session_id: session_id || 'guest_sess',
    device_type: device_type || 'desktop',
  });

  res.status(201).json(event);
});

apiRouter.get('/analytics/dashboard', authenticate, requireRole(['admin']), (_req: Request, res: Response) => {
  res.json(db.getDashboardMetrics());
});

apiRouter.get('/analytics/events', authenticate, requireRole(['admin']), (_req: Request, res: Response) => {
  res.json(db.getAnalyticsEvents().slice(-100));
});

// ==========================================
// 10. REPORTS & CSV EXPORT
// ==========================================
apiRouter.get('/reports/:type', authenticate, requireRole(['admin']), (req: AuthenticatedRequest, res: Response) => {
  const { type } = req.params;
  const { format } = req.query;

  let headers: string[] = [];
  let rows: Array<string[]> = [];

  switch (type) {
    case 'visitors':
      headers = ['ID', 'Event Type', 'Content Type', 'Content ID', 'Device', 'Timestamp'];
      rows = db.getAnalyticsEvents().map(e => [e.id, e.event_type, e.content_type, e.content_id, e.device_type, e.timestamp]);
      break;
    case 'videos':
      headers = ['ID', 'Title', 'Category', 'Duration', 'Views', 'Completions', 'Featured'];
      rows = db.getVideos().map(v => [v.id, `"${v.title.replace(/"/g, '""')}"`, v.category, v.duration, String(v.views), String(v.completions), String(v.featured)]);
      break;
    case 'programmes':
      headers = ['ID', 'Programme Name', 'Department', 'Duration', 'Status'];
      rows = db.getProgrammes().map(p => [p.id, `"${p.name.replace(/"/g, '""')}"`, `"${p.department.replace(/"/g, '""')}"`, p.duration, p.status]);
      break;
    case 'facilities':
      headers = ['ID', 'Facility Name', 'Category', 'Location', 'Status'];
      rows = db.getFacilities().map(f => [f.id, `"${f.name.replace(/"/g, '""')}"`, f.category, `"${f.location.replace(/"/g, '""')}"`, f.status]);
      break;
    case 'campus':
      headers = ['ID', 'Location Name', 'Category', 'X', 'Y', 'Z', 'Scale', 'Status'];
      rows = db.getCampusLocations().map(c => [c.id, `"${c.name.replace(/"/g, '""')}"`, c.category, String(c.position_x), String(c.position_y), String(c.position_z), String(c.scale), c.status]);
      break;
    case 'enquiries':
      headers = ['ID', 'Candidate Name', 'Email', 'Phone', 'Subject', 'Status', 'Date'];
      rows = db.getEnquiries().map(e => [e.id, `"${e.name.replace(/"/g, '""')}"`, e.email, e.phone, `"${e.subject.replace(/"/g, '""')}"`, e.status, e.created_at]);
      break;
    default:
      return res.status(400).json({ error: 'Unknown report type. Supported: visitors, videos, programmes, facilities, campus, enquiries' });
  }

  if (format === 'csv') {
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=fedpoly_ukana_${type}_report_${Date.now()}.csv`);
    return res.send(csvContent);
  }

  return res.json({
    reportType: type,
    generatedAt: new Date().toISOString(),
    totalRecords: rows.length,
    headers,
    data: rows,
  });
});

export default apiRouter;
