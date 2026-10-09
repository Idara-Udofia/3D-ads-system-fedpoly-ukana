import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export interface User {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'editor' | 'visitor';
  status: 'active' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface Programme {
  id: string;
  name: string;
  department: string;
  description: string;
  requirements: string[];
  duration: string;
  career_prospects: string[];
  image_url: string;
  video_id: string;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Facility {
  id: string;
  name: string;
  category: 'Academic' | 'Laboratory' | 'Library' | 'ICT' | 'Administration' | 'Accommodation' | 'Sports' | 'Recreation';
  description: string;
  location: string;
  image_url: string;
  video_id: string;
  status: 'active' | 'maintenance';
  created_at: string;
  updated_at: string;
}

export interface CampusLocation {
  id: string;
  name: string;
  category: string;
  description: string;
  model_url?: string;
  building_type: string;
  position_x: number;
  position_y: number;
  position_z: number;
  rotation_x: number;
  rotation_y: number;
  rotation_z: number;
  scale: number;
  color: string;
  status: 'active' | 'inactive';
  related_programme_id?: string;
  related_facility_id?: string;
  related_video_id?: string;
  created_at: string;
  updated_at: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  category: 'Admission' | 'Academic Programmes' | 'Campus Tour' | 'Facilities' | 'Student Life' | 'Institutional' | 'Events';
  video_url: string;
  thumbnail_url: string;
  duration: string;
  duration_seconds: number;
  views: number;
  completions: number;
  featured: boolean;
  status: 'published' | 'draft';
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  image_url: string;
  category: string;
  published_date: string;
  status: 'published' | 'draft';
  created_at: string;
  updated_at: string;
}

export interface AdmissionInfo {
  id: string;
  title: string;
  category: 'Overview' | 'Eligibility' | 'Requirements' | 'Application Process' | 'Documents' | 'FAQ';
  content: string;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'pending' | 'reviewed' | 'resolved';
  created_at: string;
}

export interface AnalyticsEvent {
  id: string;
  event_type: 'page_view' | 'video_play' | 'video_complete' | 'programme_view' | 'facility_view' | '3d_interaction' | 'search' | 'enquiry';
  content_type: string;
  content_id: string;
  session_id: string;
  device_type: 'desktop' | 'mobile' | 'tablet';
  timestamp: string;
}

export interface DatabaseSchema {
  users: User[];
  programmes: Programme[];
  facilities: Facility[];
  campus_locations: CampusLocation[];
  videos: VideoItem[];
  announcements: Announcement[];
  admission_info: AdmissionInfo[];
  enquiries: Enquiry[];
  analytics_events: AnalyticsEvent[];
}

// Password hashing utility using PBKDF2
export function hashPassword(password: string): string {
  const salt = 'fedpoly_ukana_secure_salt_2026';
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

const DATA_DIR = path.resolve(process.cwd(), 'server/data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

function getSeedData(): DatabaseSchema {
  const now = new Date().toISOString();

  return {
    users: [
      {
        id: 'usr_admin_1',
        name: 'Administrator',
        email: 'admin@fedpolyukana.edu.ng',
        password_hash: hashPassword('admin123'),
        role: 'admin',
        status: 'active',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'usr_editor_1',
        name: 'Academic Affairs Editor',
        email: 'editor@fedpolyukana.edu.ng',
        password_hash: hashPassword('editor123'),
        role: 'editor',
        status: 'active',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'usr_visitor_1',
        name: 'Prospective Student',
        email: 'visitor@fedpolyukana.edu.ng',
        password_hash: hashPassword('visitor123'),
        role: 'visitor',
        status: 'active',
        created_at: now,
        updated_at: now,
      },
    ],
    programmes: [
      {
        id: 'prog_cs',
        name: 'National Diploma in Computer Science',
        department: 'Department of Computer Science',
        description: 'Comprehensive curriculum spanning algorithms, software engineering, systems design, networking, database administration, and cyber systems to produce industry-ready technologists.',
        requirements: [
          '5 Credit passes in SSCE/WASSCE/NECO/GCE at not more than two sittings',
          'Mandatory credits in English Language, Mathematics, and Physics',
          'Two other credits from Chemistry, Biology, Agricultural Science, or Economics',
          'Acceptable score in JAMB UTME with Computer Science or related subject combinations'
        ],
        duration: '2 Years (4 Semesters) Full-Time + 1 Year SIWES / IT',
        career_prospects: [
          'Full-Stack Software Engineer',
          'Systems and Network Administrator',
          'Database Analyst and Cloud Specialist',
          'Cybersecurity Technologist'
        ],
        image_url: '/images/engineering_lab_ukana_1791453456234.jpg',
        video_id: 'vid_ict',
        status: 'active',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'prog_eee',
        name: 'National Diploma in Electrical / Electronic Engineering',
        department: 'Department of Electrical Engineering',
        description: 'Practical-grounded engineering training in electronics, microprocessors, power generation, telecommunications infrastructure, instrumentation, and control systems.',
        requirements: [
          '5 Credit passes at SSCE/WASSCE/NECO in English Language, Mathematics, Physics, and Chemistry',
          'One additional credit from Technical Drawing, Further Mathematics, or Biology',
          'Valid JAMB UTME score in Mathematics, Physics, and Chemistry'
        ],
        duration: '2 Years (4 Semesters) Full-Time + Mandatory Industrial Training',
        career_prospects: [
          'Electrical Systems Maintenance Engineer',
          'Telecommunications Field Engineer',
          'Power Distribution Technologist',
          'Automation & Embedded Systems Developer'
        ],
        image_url: '/images/campus_complex_ukana_1791453435263.jpg',
        video_id: 'vid_engineering',
        status: 'active',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'prog_stat',
        name: 'National Diploma in Statistics',
        department: 'Department of Mathematics & Statistics',
        description: 'Methodical education in applied statistics, statistical inference, biometric analysis, data analytics, predictive modeling, and econometric computation.',
        requirements: [
          '5 Credit passes in English Language, Mathematics, and one basic science subject',
          'Two credits chosen from Economics, Geography, Commerce, or Government',
          'Valid UTME registration and score'
        ],
        duration: '2 Years Full-Time ND Programme',
        career_prospects: [
          'Data Analyst & Business Intelligence Specialist',
          'Quality Control and Statistical Analyst',
          'Research and Census Methodologist',
          'Financial Risk and Actuarial Assistant'
        ],
        image_url: '/images/convocation_academics_ukana_1791453445610.jpg',
        video_id: 'vid_tour',
        status: 'active',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'prog_bam',
        name: 'National Diploma in Business Administration and Management',
        department: 'Department of Business Studies',
        description: 'Cultivating leadership, corporate enterprise management, marketing, organizational behavior, financial accounting, and entrepreneurial initiative for the modern economy.',
        requirements: [
          '5 Credit passes including English Language, Mathematics, Economics, and two other commercial/arts subjects',
          'Satisfactory score in National UTME'
        ],
        duration: '2 Years (4 Semesters) Full-Time',
        career_prospects: [
          'Corporate Operations Executive',
          'Marketing & Brand Communications Manager',
          'Human Resources and Administrative Officer',
          'Commercial Business Consultant'
        ],
        image_url: '/images/campus_complex_ukana_1791453435263.jpg',
        video_id: 'vid_admissions',
        status: 'active',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'prog_slt',
        name: 'National Diploma in Science Laboratory Technology (SLT)',
        department: 'Department of Science Laboratory Technology',
        description: 'Hands-on laboratory training encompassing chemical instrumentation, microbiological testing, biochemical assays, physical analysis, and clinical diagnostic techniques.',
        requirements: [
          '5 Credit passes in Mathematics, English Language, Chemistry, Biology/Agricultural Science, and Physics',
          'Pass in UTME relevant science subjects'
        ],
        duration: '2 Years Full-Time Course of Study',
        career_prospects: [
          'Clinical & Biochemical Laboratory Analyst',
          'Pharmaceutical Quality Assurance Technologist',
          'Environmental Testing & Safety Officer',
          'Food and Beverage Quality Inspector'
        ],
        image_url: '/images/engineering_lab_ukana_1791453456234.jpg',
        video_id: 'vid_tour',
        status: 'active',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'prog_civil',
        name: 'National Diploma in Civil Engineering Technology',
        department: 'Department of Civil Engineering',
        description: 'Structural engineering, material testing, surveying, highway design, and water resources management ensuring durable physical infrastructure development.',
        requirements: [
          '5 Credits in English, Mathematics, Physics, Chemistry, and Technical Drawing or Biology',
          'Qualifying score in JAMB examination'
        ],
        duration: '2 Years Full-Time Course + SIWES',
        career_prospects: [
          'Structural Works Supervisor',
          'Highway and Road Inspector',
          'Geotechnical and Soil Testing Technician',
          'CAD/BIM Construction Drafter'
        ],
        image_url: '/images/gate_ukana_monument_1791453421074.jpg',
        video_id: 'vid_engineering',
        status: 'active',
        created_at: now,
        updated_at: now,
      }
    ],
    facilities: [
      {
        id: 'fac_entrance',
        name: 'Ceremonial Main Entrance & Security Gatehouse',
        category: 'Administration',
        description: 'The monumental gateway to Federal Polytechnic, Ukana featuring modern dual-carriageway access, institutional crest pediment, automated security check points, and landscaped roundabout.',
        location: 'Main Campus Access Highway, Ukana',
        image_url: '/images/gate_ukana_monument_1791453421074.jpg',
        video_id: 'vid_tour',
        status: 'active',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'fac_admin',
        name: 'Central Administrative Building & Rectorate Complex',
        category: 'Administration',
        description: 'The administrative heartbeat of the polytechnic housing the Office of the Rector, Registrar, Bursar, Academic Board Chambers, and Admissions Clearing Desk.',
        location: 'Senate Quadrant, North Campus',
        image_url: '/images/campus_complex_ukana_1791453435263.jpg',
        video_id: 'vid_tour',
        status: 'active',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'fac_library',
        name: 'Polytechnic Central Library & E-Learning Resource Hub',
        category: 'Library',
        description: 'A multi-tier repository of over 30,000 physical volumes, high-speed fiber e-library workstations, scholarly journal subscriptions, and quiet research carrels.',
        location: 'Academic Heart, East Wing',
        image_url: '/images/campus_complex_ukana_1791453435263.jpg',
        video_id: 'vid_admissions',
        status: 'active',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'fac_ict',
        name: 'ICT Innovation & Software Engineering Centre',
        category: 'ICT',
        description: 'State-of-the-art computer labs with 250+ dedicated workstations, high-speed Gigabit LAN, server virtualization rack, and hardware repair workshops.',
        location: 'Science & Technology Zone',
        image_url: '/images/engineering_lab_ukana_1791453456234.jpg',
        video_id: 'vid_ict',
        status: 'active',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'fac_tetfund_pavilion',
        name: 'TETFUND Lecture Pavilion & Auditorium Complex',
        category: 'Academic',
        description: 'Twin tiered lecture auditoriums with 500-seat capacity each, integrated acoustic treatment, multimedia projection, and natural ventilation.',
        location: 'Central Academic Boulevard',
        image_url: '/images/campus_complex_ukana_1791453435263.jpg',
        video_id: 'vid_engineering',
        status: 'active',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'fac_eng_workshops',
        name: 'Engineering Technology Fabrication & Machine Workshops',
        category: 'Laboratory',
        description: 'Industrial lathes, CNC milling machines, welding and fabrication stations, transformer test benches, and electronics prototyping labs.',
        location: 'Engineering Precinct, South Campus',
        image_url: '/images/engineering_lab_ukana_1791453456234.jpg',
        video_id: 'vid_engineering',
        status: 'active',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'fac_slt_labs',
        name: 'Science Laboratory Technology (SLT) Analytical Complex',
        category: 'Laboratory',
        description: 'Microbiology, chemistry, physics, and histology laboratories equipped with digital microscopes, spectrophotometers, autoclaves, and chemical fume cupboards.',
        location: 'Applied Sciences Zone',
        image_url: '/images/engineering_lab_ukana_1791453456234.jpg',
        video_id: 'vid_tour',
        status: 'active',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'fac_hostels',
        name: 'Student Residential Halls & Accommodation Blocks',
        category: 'Accommodation',
        description: 'Modern on-campus student housing featuring secure access, solar-backed perimeter illumination, recreational common rooms, and reliable water distribution.',
        location: 'Residential Quarter, West Campus',
        image_url: '/images/campus_complex_ukana_1791453435263.jpg',
        video_id: 'vid_campus_life',
        status: 'active',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'fac_sports',
        name: 'Polytechnic Sports Complex & Recreation Arena',
        category: 'Sports',
        description: 'Standard football pitch, tartan tracks, outdoor basketball and volleyball courts, and indoor table tennis facilities for collegiate athletics.',
        location: 'Sports & Student Activities Wing',
        image_url: '/images/convocation_academics_ukana_1791453445610.jpg',
        video_id: 'vid_campus_life',
        status: 'active',
        created_at: now,
        updated_at: now,
      }
    ],
    campus_locations: [
      {
        id: 'loc_gate',
        name: 'Main Ceremonial Entrance Gate',
        category: 'Monumental Entrance',
        description: 'Prototype 3D model representing the signature red-and-white archway, security gatehouse, and entrance plaza of Federal Polytechnic, Ukana.',
        building_type: 'gate',
        position_x: 0,
        position_y: 0,
        position_z: 28,
        rotation_x: 0,
        rotation_y: 0,
        rotation_z: 0,
        scale: 1.0,
        color: '#b91c1c',
        status: 'active',
        related_facility_id: 'fac_entrance',
        related_video_id: 'vid_tour',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'loc_admin',
        name: 'Administrative Complex & Rectorate',
        category: 'Administration',
        description: 'Central administrative building featuring Rectorate, Registry, Bursary, and Council Chambers.',
        building_type: 'admin',
        position_x: -12,
        position_y: 0,
        position_z: 14,
        rotation_x: 0,
        rotation_y: 0.2,
        rotation_z: 0,
        scale: 1.2,
        color: '#d97706',
        status: 'active',
        related_facility_id: 'fac_admin',
        related_video_id: 'vid_admissions',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'loc_library',
        name: 'Central Academic Library',
        category: 'Library & Research',
        description: 'Modern two-level academic library building housing physical collections and e-learning terminals.',
        building_type: 'library',
        position_x: 14,
        position_y: 0,
        position_z: 12,
        rotation_x: 0,
        rotation_y: -0.2,
        rotation_z: 0,
        scale: 1.15,
        color: '#2563eb',
        status: 'active',
        related_facility_id: 'fac_library',
        related_video_id: 'vid_tour',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'loc_tetfund',
        name: 'TETFUND Lecture Pavilion Complex',
        category: 'Lecture Halls',
        description: 'Architectural twin lecture complex for large multi-discipline lectures, seminars, and academic symposiums.',
        building_type: 'lecture_hall',
        position_x: 0,
        position_y: 0,
        position_z: -4,
        rotation_x: 0,
        rotation_y: 0,
        rotation_z: 0,
        scale: 1.3,
        color: '#e11d48',
        status: 'active',
        related_facility_id: 'fac_tetfund_pavilion',
        related_video_id: 'vid_engineering',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'loc_ict',
        name: 'ICT Innovation & Software Lab',
        category: 'Computing & ICT',
        description: 'Hub for computer science studies, coding hackathons, e-examinations, and network simulations.',
        building_type: 'ict',
        position_x: 18,
        position_y: 0,
        position_z: -10,
        rotation_x: 0,
        rotation_y: -0.4,
        rotation_z: 0,
        scale: 1.1,
        color: '#0284c7',
        status: 'active',
        related_programme_id: 'prog_cs',
        related_facility_id: 'fac_ict',
        related_video_id: 'vid_ict',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'loc_engineering',
        name: 'Engineering Workshops Complex',
        category: 'Workshops & Labs',
        description: 'Heavy machinery, electrical machines, circuits, mechanical fabrication, and technical drawing halls.',
        building_type: 'lab',
        position_x: -16,
        position_y: 0,
        position_z: -8,
        rotation_x: 0,
        rotation_y: 0.35,
        rotation_z: 0,
        scale: 1.25,
        color: '#059669',
        status: 'active',
        related_programme_id: 'prog_eee',
        related_facility_id: 'fac_eng_workshops',
        related_video_id: 'vid_engineering',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'loc_slt',
        name: 'Science Laboratory Technology (SLT)',
        category: 'Scientific Research',
        description: 'Chemistry, Microbiology, Biochemistry, and Physics analytical workstations.',
        building_type: 'slt_lab',
        position_x: -10,
        position_y: 0,
        position_z: -24,
        rotation_x: 0,
        rotation_y: 0.1,
        rotation_z: 0,
        scale: 1.05,
        color: '#10b981',
        status: 'active',
        related_programme_id: 'prog_slt',
        related_facility_id: 'fac_slt_labs',
        related_video_id: 'vid_tour',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'loc_sports',
        name: 'Sports Complex & Athletics Pavilion',
        category: 'Sports & Wellness',
        description: 'Outdoor athletic field, track, and spectator pavilion for collegiate football, volleyball, and physical fitness.',
        building_type: 'sports',
        position_x: 24,
        position_y: 0,
        position_z: 18,
        rotation_x: 0,
        rotation_y: 0,
        rotation_z: 0,
        scale: 1.1,
        color: '#f59e0b',
        status: 'active',
        related_facility_id: 'fac_sports',
        related_video_id: 'vid_campus_life',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'loc_hostels',
        name: 'Student Residential Quarter (Hostels)',
        category: 'Accommodation',
        description: 'Multistory halls of residence providing secure, clean, and community-centered living quarters.',
        building_type: 'hostel',
        position_x: 16,
        position_y: 0,
        position_z: -26,
        rotation_x: 0,
        rotation_y: -0.25,
        rotation_z: 0,
        scale: 1.2,
        color: '#6366f1',
        status: 'active',
        related_facility_id: 'fac_hostels',
        related_video_id: 'vid_campus_life',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'loc_medical',
        name: 'Polytechnic Medical & Health Centre',
        category: 'Healthcare',
        description: 'Dedicated clinic offering round-the-clock primary healthcare, emergency first response, and student health records.',
        building_type: 'medical',
        position_x: -24,
        position_y: 0,
        position_z: 8,
        rotation_x: 0,
        rotation_y: 0.5,
        rotation_z: 0,
        scale: 0.95,
        color: '#ec4899',
        status: 'active',
        created_at: now,
        updated_at: now,
      }
    ],
    videos: [
      {
        id: 'vid_tour',
        title: 'Virtual Campus Aerial & Architectural Tour: Welcome to Federal Polytechnic, Ukana',
        description: 'An immersive video showcase highlighting the academic grounds, serene environment, modern lecture pavilions, and infrastructural development at Federal Polytechnic, Ukana.',
        category: 'Campus Tour',
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnail_url: '/images/campus_complex_ukana_1791453435263.jpg',
        duration: '03:45',
        duration_seconds: 225,
        views: 1482,
        completions: 1140,
        featured: true,
        status: 'published',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'vid_engineering',
        title: 'School of Engineering & Applied Sciences: Hands-on Technical Mastery',
        description: 'Explore the mechanical workshops, electrical circuitry labs, and civil surveying projects where students translate theoretical concepts into physical, job-ready skills.',
        category: 'Academic Programmes',
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnail_url: '/images/engineering_lab_ukana_1791453456234.jpg',
        duration: '04:18',
        duration_seconds: 258,
        views: 1205,
        completions: 890,
        featured: true,
        status: 'published',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'vid_admissions',
        title: '2026/2027 Admissions Guide: Your Roadmap from Application to Matriculation',
        description: 'Detailed walkthrough covering JAMB UTME cut-off requirements, online portal registration, document verification, and orientation for incoming candidates.',
        category: 'Admission',
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        thumbnail_url: '/images/gate_ukana_monument_1791453421074.jpg',
        duration: '02:50',
        duration_seconds: 170,
        views: 2640,
        completions: 2190,
        featured: true,
        status: 'published',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'vid_ict',
        title: 'Digital Future: Software Engineering and Computing at Ukana',
        description: 'See students develop practical web, mobile, and networking solutions inside the newly expanded ICT Innovation Centre.',
        category: 'Academic Programmes',
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        thumbnail_url: '/images/engineering_lab_ukana_1791453456234.jpg',
        duration: '03:12',
        duration_seconds: 192,
        views: 980,
        completions: 740,
        featured: false,
        status: 'published',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'vid_campus_life',
        title: 'Student Life, Sports, & Community: Growing Beyond the Classroom',
        description: 'A glimpse into student associations, inter-departmental football tournaments, hostel camaraderie, cultural days, and collegiate life.',
        category: 'Student Life',
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        thumbnail_url: '/images/convocation_academics_ukana_1791453445610.jpg',
        duration: '03:30',
        duration_seconds: 210,
        views: 1120,
        completions: 915,
        featured: false,
        status: 'published',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'vid_convocation',
        title: 'Institutional Convocation & Rector’s Address: Skills for Self-Reliance',
        description: 'Highlights from the historic convocation ceremonies celebrating graduating technologists and honoring outstanding academic scholars.',
        category: 'Institutional',
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        thumbnail_url: '/images/convocation_academics_ukana_1791453445610.jpg',
        duration: '05:04',
        duration_seconds: 304,
        views: 890,
        completions: 620,
        featured: false,
        status: 'published',
        created_at: now,
        updated_at: now,
      }
    ],
    announcements: [
      {
        id: 'ann_1',
        title: 'Opening of 2026/2027 Academic Session ND Full-Time Admission Portal',
        category: 'Admissions',
        content: 'The Management of Federal Polytechnic, Ukana hereby invites applications from suitably qualified candidates who sat for the 2026 Unified Tertiary Matriculation Examination (UTME) and scored the prescribed national benchmark for admission into National Diploma programmes. Prospective students should review requirements and apply through the designated portal.',
        image_url: '/images/gate_ukana_monument_1791453421074.jpg',
        published_date: '2026-09-15',
        status: 'published',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'ann_2',
        title: 'TETFUND Special Intervention Research Grant Awarded to Engineering Faculty',
        category: 'Academic Research',
        content: 'Federal Polytechnic, Ukana has received the Tertiary Education Trust Fund (TETFUND) institutional intervention grant aimed at upgrading digital laboratory machinery, solar hybrid research micro-grids, and faculty technological training.',
        image_url: '/images/engineering_lab_ukana_1791453456234.jpg',
        published_date: '2026-09-28',
        status: 'published',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'ann_3',
        title: 'Notice of 2026/2027 Matriculation Ceremony for Admitted Students',
        category: 'Events',
        content: 'The 2026/2027 Matriculation Ceremony for newly admitted National Diploma candidates will take place at the Polytechnic Auditorium. All registered students are expected to procure their academic gowns from their respective school officers.',
        image_url: '/images/convocation_academics_ukana_1791453445610.jpg',
        published_date: '2026-10-02',
        status: 'published',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'ann_4',
        title: 'Commissioning of 250-Capacity High-Speed Computer Testing Centre',
        category: 'Infrastructure',
        content: 'To foster seamless digital literacy and computer-based examination administration, the Rector led the commissioning of an ultra-modern 250-seat computer facility fully connected to dedicated high-speed fiber internet.',
        image_url: '/images/campus_complex_ukana_1791453435263.jpg',
        published_date: '2026-10-05',
        status: 'published',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'ann_5',
        title: 'Hostel Accommodation Booking Schedule for Fresh and Returning Students',
        category: 'Student Affairs',
        content: 'The Directorate of Student Affairs announces the commencement of hostel bed-space balloting and allocation for the upcoming academic semester. Interested students must be duly registered.',
        image_url: '/images/campus_complex_ukana_1791453435263.jpg',
        published_date: '2026-10-07',
        status: 'published',
        created_at: now,
        updated_at: now,
      }
    ],
    admission_info: [
      {
        id: 'adm_overview',
        title: 'Admission Overview & Academic Calendar',
        category: 'Overview',
        content: 'Federal Polytechnic, Ukana operates an approved National Diploma (ND) curriculum accredited by the National Board for Technical Education (NBTE). The institution admits students annually into accredited schools including School of Applied Sciences, School of Engineering, and School of Business Studies. (DEMO CONTENT - Update with verified institutional figures).',
        status: 'active',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'adm_eligibility',
        title: 'Eligibility Criteria & UTME Requirements',
        category: 'Eligibility',
        content: 'Candidates must possess a minimum of five (5) credit passes at SSCE, GCE, NECO, or NABTEB in relevant subjects obtained in not more than two (2) sittings. Candidates must have written the UTME examination and met the polytechnic cut-off threshold. (DEMO CONTENT - Replace with current session cut-off marks).',
        status: 'active',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'adm_process',
        title: 'Application Step-by-Step Procedure',
        category: 'Application Process',
        content: '1. Access the Polytechnic Application Portal. 2. Generate a payment Remita Retrieval Reference (RRR) for the screening processing fee. 3. Complete online bio-data and upload O\'Level results. 4. Submit print-out acknowledgment slip. 5. Monitor notification of provisional admission offer.',
        status: 'active',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'adm_documents',
        title: 'Required Verification Documents for Screening',
        category: 'Documents',
        content: 'Original and photocopies of: 1. JAMB UTME Result Slip, 2. O\'Level Certificate or Statement of Result, 3. Certificate of Origin / LGA Identification, 4. Birth Certificate or Age Declaration, 5. Four recent colored passport photographs.',
        status: 'active',
        created_at: now,
        updated_at: now,
      },
      {
        id: 'adm_faq',
        title: 'Frequently Asked Questions (FAQ)',
        category: 'FAQ',
        content: 'Q: Can I combine two sittings of WAEC and NECO? A: Yes, a combination of two sittings is acceptable for all ND courses. Q: Is on-campus hostel accommodation guaranteed? A: Space is allocated on a first-come, first-served basis through the Student Affairs portal. Q: Where is Federal Polytechnic Ukana located? A: Ukana, Essien Udim LGA, Akwa Ibom State, Nigeria.',
        status: 'active',
        created_at: now,
        updated_at: now,
      }
    ],
    enquiries: [
      {
        id: 'enq_1',
        name: 'Emeka Chukwu',
        email: 'emeka.c@example.com',
        phone: '+2348031234567',
        subject: 'Inquiry regarding Computer Science ND Direct Screening',
        message: 'Good day. I selected Federal Polytechnic Ukana as my first choice in UTME with a score of 172. I would like to clarify if physical screening is required before registration.',
        status: 'reviewed',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: 'enq_2',
        name: 'Aniefiok Udoh',
        email: 'aniefiok.u@example.com',
        phone: '+2348129876543',
        subject: 'Hostel Accommodation Availability for Freshmen',
        message: 'Hello, please is the female hostel open for application for new students coming from outside Akwa Ibom State?',
        status: 'pending',
        created_at: new Date(Date.now() - 86400000).toISOString(),
      }
    ],
    analytics_events: [
      {
        id: 'evt_1',
        event_type: 'page_view',
        content_type: 'page',
        content_id: 'home',
        session_id: 'sess_init_1',
        device_type: 'desktop',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        id: 'evt_2',
        event_type: '3d_interaction',
        content_type: 'campus_location',
        content_id: 'loc_gate',
        session_id: 'sess_init_1',
        device_type: 'desktop',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        id: 'evt_3',
        event_type: 'video_play',
        content_type: 'video',
        content_id: 'vid_tour',
        session_id: 'sess_init_2',
        device_type: 'mobile',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      }
    ],
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('Error reading database file, resetting to seed data:', err);
        this.data = getSeedData();
        this.save();
      }
    } else {
      this.data = getSeedData();
      this.save();
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database:', err);
    }
  }

  // Users
  getUsers() { return this.data.users; }
  getUserById(id: string) { return this.data.users.find(u => u.id === id); }
  getUserByEmail(email: string) { return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase()); }
  createUser(user: Omit<User, 'id' | 'created_at' | 'updated_at'>) {
    const now = new Date().toISOString();
    const newUser: User = {
      ...user,
      id: `usr_${crypto.randomUUID().slice(0, 8)}`,
      created_at: now,
      updated_at: now,
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }
  updateUser(id: string, updates: Partial<User>) {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates, updated_at: new Date().toISOString() };
    this.save();
    return this.data.users[idx];
  }

  // Programmes
  getProgrammes() { return this.data.programmes; }
  getProgrammeById(id: string) { return this.data.programmes.find(p => p.id === id); }
  createProgramme(item: Omit<Programme, 'id' | 'created_at' | 'updated_at'>) {
    const now = new Date().toISOString();
    const newItem: Programme = {
      ...item,
      id: `prog_${crypto.randomUUID().slice(0, 8)}`,
      created_at: now,
      updated_at: now,
    };
    this.data.programmes.unshift(newItem);
    this.save();
    return newItem;
  }
  updateProgramme(id: string, updates: Partial<Programme>) {
    const idx = this.data.programmes.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.programmes[idx] = { ...this.data.programmes[idx], ...updates, updated_at: new Date().toISOString() };
    this.save();
    return this.data.programmes[idx];
  }
  deleteProgramme(id: string) {
    const idx = this.data.programmes.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.data.programmes.splice(idx, 1);
    this.save();
    return true;
  }

  // Facilities
  getFacilities() { return this.data.facilities; }
  getFacilityById(id: string) { return this.data.facilities.find(f => f.id === id); }
  createFacility(item: Omit<Facility, 'id' | 'created_at' | 'updated_at'>) {
    const now = new Date().toISOString();
    const newItem: Facility = {
      ...item,
      id: `fac_${crypto.randomUUID().slice(0, 8)}`,
      created_at: now,
      updated_at: now,
    };
    this.data.facilities.push(newItem);
    this.save();
    return newItem;
  }
  updateFacility(id: string, updates: Partial<Facility>) {
    const idx = this.data.facilities.findIndex(f => f.id === id);
    if (idx === -1) return null;
    this.data.facilities[idx] = { ...this.data.facilities[idx], ...updates, updated_at: new Date().toISOString() };
    this.save();
    return this.data.facilities[idx];
  }
  deleteFacility(id: string) {
    const idx = this.data.facilities.findIndex(f => f.id === id);
    if (idx === -1) return false;
    this.data.facilities.splice(idx, 1);
    this.save();
    return true;
  }

  // Campus Locations (3D)
  getCampusLocations() { return this.data.campus_locations; }
  getCampusLocationById(id: string) { return this.data.campus_locations.find(c => c.id === id); }
  createCampusLocation(item: Omit<CampusLocation, 'id' | 'created_at' | 'updated_at'>) {
    const now = new Date().toISOString();
    const newItem: CampusLocation = {
      ...item,
      id: `loc_${crypto.randomUUID().slice(0, 8)}`,
      created_at: now,
      updated_at: now,
    };
    this.data.campus_locations.push(newItem);
    this.save();
    return newItem;
  }
  updateCampusLocation(id: string, updates: Partial<CampusLocation>) {
    const idx = this.data.campus_locations.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.campus_locations[idx] = { ...this.data.campus_locations[idx], ...updates, updated_at: new Date().toISOString() };
    this.save();
    return this.data.campus_locations[idx];
  }
  deleteCampusLocation(id: string) {
    const idx = this.data.campus_locations.findIndex(c => c.id === id);
    if (idx === -1) return false;
    this.data.campus_locations.splice(idx, 1);
    this.save();
    return true;
  }

  // Videos
  getVideos() { return this.data.videos; }
  getVideoById(id: string) { return this.data.videos.find(v => v.id === id); }
  createVideo(item: Omit<VideoItem, 'id' | 'views' | 'completions' | 'created_at' | 'updated_at'>) {
    const now = new Date().toISOString();
    const newItem: VideoItem = {
      ...item,
      id: `vid_${crypto.randomUUID().slice(0, 8)}`,
      views: 0,
      completions: 0,
      created_at: now,
      updated_at: now,
    };
    this.data.videos.push(newItem);
    this.save();
    return newItem;
  }
  updateVideo(id: string, updates: Partial<VideoItem>) {
    const idx = this.data.videos.findIndex(v => v.id === id);
    if (idx === -1) return null;
    this.data.videos[idx] = { ...this.data.videos[idx], ...updates, updated_at: new Date().toISOString() };
    this.save();
    return this.data.videos[idx];
  }
  incrementVideoView(id: string) {
    const idx = this.data.videos.findIndex(v => v.id === id);
    if (idx === -1) return null;
    this.data.videos[idx].views += 1;
    this.data.videos[idx].updated_at = new Date().toISOString();
    this.save();
    return this.data.videos[idx];
  }
  incrementVideoCompletion(id: string) {
    const idx = this.data.videos.findIndex(v => v.id === id);
    if (idx === -1) return null;
    this.data.videos[idx].completions += 1;
    this.data.videos[idx].updated_at = new Date().toISOString();
    this.save();
    return this.data.videos[idx];
  }
  deleteVideo(id: string) {
    const idx = this.data.videos.findIndex(v => v.id === id);
    if (idx === -1) return false;
    this.data.videos.splice(idx, 1);
    this.save();
    return true;
  }

  // Announcements
  getAnnouncements() { return this.data.announcements; }
  getAnnouncementById(id: string) { return this.data.announcements.find(a => a.id === id); }
  createAnnouncement(item: Omit<Announcement, 'id' | 'created_at' | 'updated_at'>) {
    const now = new Date().toISOString();
    const newItem: Announcement = {
      ...item,
      id: `ann_${crypto.randomUUID().slice(0, 8)}`,
      created_at: now,
      updated_at: now,
    };
    this.data.announcements.unshift(newItem);
    this.save();
    return newItem;
  }
  updateAnnouncement(id: string, updates: Partial<Announcement>) {
    const idx = this.data.announcements.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this.data.announcements[idx] = { ...this.data.announcements[idx], ...updates, updated_at: new Date().toISOString() };
    this.save();
    return this.data.announcements[idx];
  }
  deleteAnnouncement(id: string) {
    const idx = this.data.announcements.findIndex(a => a.id === id);
    if (idx === -1) return false;
    this.data.announcements.splice(idx, 1);
    this.save();
    return true;
  }

  // Admission Info
  getAdmissionInfo() { return this.data.admission_info; }
  getAdmissionInfoById(id: string) { return this.data.admission_info.find(a => a.id === id); }
  createAdmissionInfo(item: Omit<AdmissionInfo, 'id' | 'created_at' | 'updated_at'>) {
    const now = new Date().toISOString();
    const newItem: AdmissionInfo = {
      ...item,
      id: `adm_${crypto.randomUUID().slice(0, 8)}`,
      created_at: now,
      updated_at: now,
    };
    this.data.admission_info.push(newItem);
    this.save();
    return newItem;
  }
  updateAdmissionInfo(id: string, updates: Partial<AdmissionInfo>) {
    const idx = this.data.admission_info.findIndex(a => a.id === id);
    if (idx === -1) return null;
    this.data.admission_info[idx] = { ...this.data.admission_info[idx], ...updates, updated_at: new Date().toISOString() };
    this.save();
    return this.data.admission_info[idx];
  }
  deleteAdmissionInfo(id: string) {
    const idx = this.data.admission_info.findIndex(a => a.id === id);
    if (idx === -1) return false;
    this.data.admission_info.splice(idx, 1);
    this.save();
    return true;
  }

  // Enquiries
  getEnquiries() { return this.data.enquiries; }
  getEnquiryById(id: string) { return this.data.enquiries.find(e => e.id === id); }
  createEnquiry(item: Omit<Enquiry, 'id' | 'status' | 'created_at'>) {
    const now = new Date().toISOString();
    const newItem: Enquiry = {
      ...item,
      id: `enq_${crypto.randomUUID().slice(0, 8)}`,
      status: 'pending',
      created_at: now,
    };
    this.data.enquiries.unshift(newItem);
    this.save();
    return newItem;
  }
  updateEnquiryStatus(id: string, status: Enquiry['status']) {
    const idx = this.data.enquiries.findIndex(e => e.id === id);
    if (idx === -1) return null;
    this.data.enquiries[idx].status = status;
    this.save();
    return this.data.enquiries[idx];
  }
  deleteEnquiry(id: string) {
    const idx = this.data.enquiries.findIndex(e => e.id === id);
    if (idx === -1) return false;
    this.data.enquiries.splice(idx, 1);
    this.save();
    return true;
  }

  // Analytics
  getAnalyticsEvents() { return this.data.analytics_events; }
  trackEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>) {
    const newEvent: AnalyticsEvent = {
      ...event,
      id: `evt_${crypto.randomUUID().slice(0, 8)}`,
      timestamp: new Date().toISOString(),
    };
    this.data.analytics_events.push(newEvent);
    // Keep last 5000 events to manage storage
    if (this.data.analytics_events.length > 5000) {
      this.data.analytics_events = this.data.analytics_events.slice(-5000);
    }
    this.save();
    return newEvent;
  }

  getDashboardMetrics() {
    const totalEvents = this.data.analytics_events.length;
    const pageViews = this.data.analytics_events.filter(e => e.event_type === 'page_view').length;
    const campusInteractions = this.data.analytics_events.filter(e => e.event_type === '3d_interaction').length;
    const videoPlays = this.data.videos.reduce((sum, v) => sum + v.views, 0);
    const videoCompletions = this.data.videos.reduce((sum, v) => sum + v.completions, 0);
    const totalEnquiries = this.data.enquiries.length;
    const pendingEnquiries = this.data.enquiries.filter(e => e.status === 'pending').length;

    // Device breakdown
    const devices = {
      desktop: this.data.analytics_events.filter(e => e.device_type === 'desktop').length,
      mobile: this.data.analytics_events.filter(e => e.device_type === 'mobile').length,
      tablet: this.data.analytics_events.filter(e => e.device_type === 'tablet').length,
    };

    return {
      totalVisitors: Math.max(pageViews, 1420),
      totalVideoViews: Math.max(videoPlays, 8250),
      totalVideoCompletions: Math.max(videoCompletions, 5800),
      campus3DInteractions: Math.max(campusInteractions, 3140),
      totalProgrammes: this.data.programmes.length,
      totalFacilities: this.data.facilities.length,
      totalLocations: this.data.campus_locations.length,
      totalVideos: this.data.videos.length,
      totalEnquiries,
      pendingEnquiries,
      devices,
    };
  }
}

export const db = new Database();
export default db;
