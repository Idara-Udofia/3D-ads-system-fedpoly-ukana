import {
  Programme,
  Facility,
  CampusLocation,
  VideoItem,
  Announcement,
  AdmissionInfo,
  Enquiry,
  DashboardMetrics,
  User,
} from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('fedpuka_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMsg = 'An error occurred';
    try {
      const errorData = await res.json();
      errorMsg = errorData.error || errorData.message || res.statusText;
    } catch {
      errorMsg = res.statusText;
    }
    throw new Error(errorMsg);
  }

  return res.json();
}

export const api = {
  // Auth
  login: (credentials: { email: string; password: string }) =>
    request<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  getMe: () => request<User>('/auth/me'),
  getUsers: () => request<User[]>('/users'),

  // Programmes
  getProgrammes: (params?: { search?: string; department?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return request<Programme[]>(`/programmes${query ? `?${query}` : ''}`);
  },
  getProgramme: (id: string) => request<Programme>(`/programmes/${id}`),
  createProgramme: (data: Partial<Programme>) =>
    request<Programme>('/programmes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProgramme: (id: string, data: Partial<Programme>) =>
    request<Programme>(`/programmes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteProgramme: (id: string) =>
    request<{ success: boolean }>(`/programmes/${id}`, {
      method: 'DELETE',
    }),

  // Facilities
  getFacilities: (params?: { category?: string; search?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return request<Facility[]>(`/facilities${query ? `?${query}` : ''}`);
  },
  getFacility: (id: string) => request<Facility>(`/facilities/${id}`),
  createFacility: (data: Partial<Facility>) =>
    request<Facility>('/facilities', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateFacility: (id: string, data: Partial<Facility>) =>
    request<Facility>(`/facilities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteFacility: (id: string) =>
    request<{ success: boolean }>(`/facilities/${id}`, {
      method: 'DELETE',
    }),

  // Campus 3D Locations
  getCampusLocations: () => request<CampusLocation[]>('/campus'),
  getCampusLocation: (id: string) => request<CampusLocation>(`/campus/${id}`),
  createCampusLocation: (data: Partial<CampusLocation>) =>
    request<CampusLocation>('/campus', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCampusLocation: (id: string, data: Partial<CampusLocation>) =>
    request<CampusLocation>(`/campus/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteCampusLocation: (id: string) =>
    request<{ success: boolean }>(`/campus/${id}`, {
      method: 'DELETE',
    }),

  // Videos
  getVideos: (params?: { category?: string; featured?: boolean }) => {
    const query = new URLSearchParams(params as any).toString();
    return request<VideoItem[]>(`/videos${query ? `?${query}` : ''}`);
  },
  getVideo: (id: string) => request<VideoItem>(`/videos/${id}`),
  recordVideoView: (id: string) =>
    request<{ views: number }>(`/videos/${id}/views`, { method: 'POST' }),
  recordVideoCompletion: (id: string) =>
    request<{ completions: number }>(`/videos/${id}/complete`, { method: 'POST' }),
  createVideo: (data: Partial<VideoItem>) =>
    request<VideoItem>('/videos', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateVideo: (id: string, data: Partial<VideoItem>) =>
    request<VideoItem>(`/videos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteVideo: (id: string) =>
    request<{ success: boolean }>(`/videos/${id}`, {
      method: 'DELETE',
    }),

  // Announcements
  getAnnouncements: () => request<Announcement[]>('/announcements'),
  getAnnouncement: (id: string) => request<Announcement>(`/announcements/${id}`),
  createAnnouncement: (data: Partial<Announcement>) =>
    request<Announcement>('/announcements', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateAnnouncement: (id: string, data: Partial<Announcement>) =>
    request<Announcement>(`/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteAnnouncement: (id: string) =>
    request<{ success: boolean }>(`/announcements/${id}`, {
      method: 'DELETE',
    }),

  // Admission Info
  getAdmissionInfo: () => request<AdmissionInfo[]>('/admission'),
  createAdmissionInfo: (data: Partial<AdmissionInfo>) =>
    request<AdmissionInfo>('/admission', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateAdmissionInfo: (id: string, data: Partial<AdmissionInfo>) =>
    request<AdmissionInfo>(`/admission/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteAdmissionInfo: (id: string) =>
    request<{ success: boolean }>(`/admission/${id}`, {
      method: 'DELETE',
    }),

  // Enquiries
  getEnquiries: () => request<Enquiry[]>('/enquiries'),
  submitEnquiry: (data: { name: string; email: string; phone?: string; subject?: string; message: string }) =>
    request<{ success: boolean; message: string; enquiry: Enquiry }>('/enquiries', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateEnquiryStatus: (id: string, status: Enquiry['status']) =>
    request<Enquiry>(`/enquiries/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  deleteEnquiry: (id: string) =>
    request<{ success: boolean }>(`/enquiries/${id}`, {
      method: 'DELETE',
    }),

  // Analytics
  trackEvent: (data: {
    event_type: string;
    content_type?: string;
    content_id?: string;
    session_id?: string;
    device_type?: string;
  }) =>
    request<{ id: string }>('/analytics/events', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getDashboardMetrics: () => request<DashboardMetrics>('/analytics/dashboard'),

  // Reports
  getReportUrl: (type: string, format: 'json' | 'csv' = 'csv') =>
    `${API_BASE}/reports/${type}?format=${format}`,
  getReportData: (type: string) => request<any>(`/reports/${type}?format=json`),
};

export default api;
