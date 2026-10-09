import api from './api';

function getSessionId(): string {
  let sid = sessionStorage.getItem('fedpuka_sid');
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).substring(2, 10);
    sessionStorage.setItem('fedpuka_sid', sid);
  }
  return sid;
}

function getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

export const analytics = {
  pageView: (pageName: string) => {
    try {
      api.trackEvent({
        event_type: 'page_view',
        content_type: 'page',
        content_id: pageName,
        session_id: getSessionId(),
        device_type: getDeviceType(),
      }).catch(() => {});
    } catch {}
  },

  campus3DInteraction: (locationId: string, locationName: string) => {
    try {
      api.trackEvent({
        event_type: '3d_interaction',
        content_type: 'campus_location',
        content_id: `${locationId}:${locationName}`,
        session_id: getSessionId(),
        device_type: getDeviceType(),
      }).catch(() => {});
    } catch {}
  },

  videoPlay: (videoId: string) => {
    try {
      api.recordVideoView(videoId).catch(() => {});
    } catch {}
  },

  videoComplete: (videoId: string) => {
    try {
      api.recordVideoCompletion(videoId).catch(() => {});
    } catch {}
  },

  programmeView: (programmeId: string) => {
    try {
      api.trackEvent({
        event_type: 'programme_view',
        content_type: 'programme',
        content_id: programmeId,
        session_id: getSessionId(),
        device_type: getDeviceType(),
      }).catch(() => {});
    } catch {}
  },

  facilityView: (facilityId: string) => {
    try {
      api.trackEvent({
        event_type: 'facility_view',
        content_type: 'facility',
        content_id: facilityId,
        session_id: getSessionId(),
        device_type: getDeviceType(),
      }).catch(() => {});
    } catch {}
  },
};

export default analytics;
