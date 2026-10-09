export type UserRole = 'admin' | 'editor' | 'visitor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: 'active' | 'suspended';
  created_at?: string;
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

export interface DashboardMetrics {
  totalVisitors: number;
  totalVideoViews: number;
  totalVideoCompletions: number;
  campus3DInteractions: number;
  totalProgrammes: number;
  totalFacilities: number;
  totalLocations: number;
  totalVideos: number;
  totalEnquiries: number;
  pendingEnquiries: number;
  devices: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
}

export interface SearchResultItem {
  id: string;
  title: string;
  category: string;
  description: string;
  url: string;
  type: 'programme' | 'facility' | 'video' | 'campus' | 'announcement' | 'admission';
}
