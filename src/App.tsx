import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import GlobalSearchModal from './components/common/GlobalSearchModal';
import EnquiryModal from './components/common/EnquiryModal';
import VideoPlayerModal from './components/videos/VideoPlayerModal';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import CampusPage from './pages/public/CampusPage';
import ProgrammesPage from './pages/public/ProgrammesPage';
import ProgrammeDetailPage from './pages/public/ProgrammeDetailPage';
import FacilitiesPage from './pages/public/FacilitiesPage';
import VideosPage from './pages/public/VideosPage';
import AdmissionPage from './pages/public/AdmissionPage';
import StudentLifePage from './pages/public/StudentLifePage';
import AboutPage from './pages/public/AboutPage';
import AnnouncementsPage from './pages/public/AnnouncementsPage';
import ContactPage from './pages/public/ContactPage';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProgrammesPage from './pages/admin/AdminProgrammesPage';
import AdminFacilitiesPage from './pages/admin/AdminFacilitiesPage';
import AdminCampusPage from './pages/admin/AdminCampusPage';
import AdminVideosPage from './pages/admin/AdminVideosPage';
import AdminAdmissionPage from './pages/admin/AdminAdmissionPage';
import AdminAnnouncementsPage from './pages/admin/AdminAnnouncementsPage';
import AdminEnquiriesPage from './pages/admin/AdminEnquiriesPage';
import AdminAnalyticsPage from './pages/admin/AdminAnalyticsPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import EditorDashboardPage from './pages/editor/EditorDashboardPage';

// Types & Services
import {
  Programme,
  Facility,
  CampusLocation,
  VideoItem,
  Announcement,
  AdmissionInfo,
  Enquiry,
} from './types';
import api from './services/api';
import analytics from './services/analytics';

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  // Core Data States
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [campusLocations, setCampusLocations] = useState<CampusLocation[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [admissionInfo, setAdmissionInfo] = useState<AdmissionInfo[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);

  // Modals & Overlay States
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState<boolean>(false);
  const [enquirySubject, setEnquirySubject] = useState<string>('Admission Inquiry');
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  // Load all initial data from backend
  const refreshData = async () => {
    try {
      const [
        progs,
        facs,
        locs,
        vids,
        anns,
        adms,
        enqs,
      ] = await Promise.all([
        api.getProgrammes().catch(() => []),
        api.getFacilities().catch(() => []),
        api.getCampusLocations().catch(() => []),
        api.getVideos().catch(() => []),
        api.getAnnouncements().catch(() => []),
        api.getAdmissionInfo().catch(() => []),
        api.getEnquiries().catch(() => []),
      ]);

      setProgrammes(progs);
      setFacilities(facs);
      setCampusLocations(locs);
      setVideos(vids);
      setAnnouncements(anns);
      setAdmissionInfo(adms);
      setEnquiries(enqs);
      setDataLoaded(true);
    } catch (err) {
      console.error('Error fetching institutional records:', err);
      setDataLoaded(true);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Track page views on route change
  useEffect(() => {
    analytics.pageView(location.pathname);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  const activeVideo = videos.find((v) => v.id === activeVideoId) || null;
  const isManagementRoute =
    location.pathname.startsWith('/admin') || location.pathname.startsWith('/editor');

  const handleOpenEnquiryWithSubject = (subject = 'Admission Inquiry') => {
    setEnquirySubject(subject);
    setIsEnquiryOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Public Navbar (Hidden on Admin routes) */}
      {!isManagementRoute && (
        <Navbar
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenEnquiry={() => handleOpenEnquiryWithSubject('Admission Inquiry')}
        />
      )}

      {/* Main Viewport Router */}
      <div className="flex-1 flex flex-col">
        <Routes>
          {/* ==============================================================
              PUBLIC ACCESS ROUTES
             ============================================================== */}
          <Route
            path="/"
            element={
              <HomePage
                programmes={programmes}
                facilities={facilities}
                campusLocations={campusLocations}
                videos={videos}
                announcements={announcements}
                admissionInfo={admissionInfo}
                onSelectVideo={(id) => setActiveVideoId(id)}
                onOpenEnquiry={() => handleOpenEnquiryWithSubject('Admission Inquiry')}
              />
            }
          />
          <Route
            path="/campus"
            element={
              <CampusPage
                locations={campusLocations}
                programmes={programmes}
                facilities={facilities}
                videos={videos}
                onSelectVideo={(id) => setActiveVideoId(id)}
              />
            }
          />
          <Route
            path="/programmes"
            element={
              <ProgrammesPage
                programmes={programmes}
                onSelectVideo={(id) => setActiveVideoId(id)}
              />
            }
          />
          <Route
            path="/programmes/:id"
            element={
              <ProgrammeDetailPage
                programmes={programmes}
                facilities={facilities}
                videos={videos}
                onSelectVideo={(id) => setActiveVideoId(id)}
                onOpenEnquiry={() => handleOpenEnquiryWithSubject('Programme Information')}
              />
            }
          />
          <Route
            path="/facilities"
            element={
              <FacilitiesPage
                facilities={facilities}
                onSelectVideo={(id) => setActiveVideoId(id)}
              />
            }
          />
          <Route
            path="/facilities/:id"
            element={
              <FacilitiesPage
                facilities={facilities}
                onSelectVideo={(id) => setActiveVideoId(id)}
              />
            }
          />
          <Route
            path="/videos"
            element={
              <VideosPage
                videos={videos}
                onSelectVideo={(id) => setActiveVideoId(id)}
              />
            }
          />
          <Route
            path="/videos/:id"
            element={
              <VideosPage
                videos={videos}
                onSelectVideo={(id) => setActiveVideoId(id)}
              />
            }
          />
          <Route
            path="/admission"
            element={
              <AdmissionPage
                admissionInfo={admissionInfo}
                onOpenEnquiry={() => handleOpenEnquiryWithSubject('Admission Inquiry')}
              />
            }
          />
          <Route
            path="/student-life"
            element={<StudentLifePage />}
          />
          <Route
            path="/about"
            element={<AboutPage />}
          />
          <Route
            path="/announcements"
            element={<AnnouncementsPage announcements={announcements} />}
          />
          <Route
            path="/announcements/:id"
            element={<AnnouncementsPage announcements={announcements} />}
          />
          <Route
            path="/contact"
            element={<ContactPage />}
          />

          {/* ==============================================================
              ADMINISTRATION & MANAGEMENT CONSOLE ROUTES
             ============================================================== */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <AdminDashboardPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/editor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['editor']}>
                <AdminLayout>
                  <EditorDashboardPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/programmes"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <AdminProgrammesPage
                    programmes={programmes}
                    onRefresh={refreshData}
                  />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/facilities"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <AdminFacilitiesPage
                    facilities={facilities}
                    onRefresh={refreshData}
                  />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/campus"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <AdminCampusPage
                    locations={campusLocations}
                    programmes={programmes}
                    facilities={facilities}
                    videos={videos}
                    onRefresh={refreshData}
                  />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/videos"
            element={
              <ProtectedRoute allowedRoles={['admin', 'editor']}>
                <AdminLayout>
                  <AdminVideosPage
                    videos={videos}
                    onRefresh={refreshData}
                    onPreviewVideo={(id) => setActiveVideoId(id)}
                  />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/admission"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <AdminAdmissionPage
                    admissionInfo={admissionInfo}
                    onRefresh={refreshData}
                  />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/announcements"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <AdminAnnouncementsPage
                    announcements={announcements}
                    onRefresh={refreshData}
                  />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/enquiries"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <AdminEnquiriesPage
                    enquiries={enquiries}
                    onRefresh={refreshData}
                  />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <AdminAnalyticsPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <AdminReportsPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <AdminUsersPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout>
                  <AdminSettingsPage />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      {/* Public Footer */}
      {!isManagementRoute && <Footer />}

      {/* Global Interactive Video Player Modal */}
      <VideoPlayerModal
        video={activeVideo}
        onClose={() => setActiveVideoId(null)}
        onExploreCampus={() => navigate('/campus')}
        onExploreProgrammes={() => navigate('/programmes')}
        onExploreAdmission={() => navigate('/admission')}
        onOpenEnquiry={() => handleOpenEnquiryWithSubject('Admission Inquiry')}
      />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        programmes={programmes}
        facilities={facilities}
        campusLocations={campusLocations}
        videos={videos}
        announcements={announcements}
        admissionInfo={admissionInfo}
        onSelectVideo={(id) => setActiveVideoId(id)}
      />

      {/* Global Enquiry Submission Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        defaultSubject={enquirySubject}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
