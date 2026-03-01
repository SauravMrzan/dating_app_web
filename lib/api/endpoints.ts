export const API = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    WHOAMI: "/api/auth/whoami",
    UPDATEPROFILE: "/api/auth/update-profile",
  },

  ADMIN: {
    STATS: "/api/admin/dashboard-stats",
    USERS: "/api/admin/users",
    USER: {
      CREATE: "/api/admin/users",
    },
    REPORTS: {
      LIST: "/api/reports/admin",
      RESOLVE: (reportId: string) => `/api/reports/admin/${reportId}/resolve`,
    },
  },

  MATCH: {
    DISCOVERY: "/api/match/discovery",
    MATCHES: "/api/match/matches",
    SWIPE: "/api/match/swipe",
  },

  CHAT: {
    BASE: "/api/chat", // ✅ added base path
    SEND: "/api/chat/send", // ✅ send message
    MESSAGES: (conversationId: string) => `/api/chat/${conversationId}`, // ✅ fetch messages by conversationId
  },

  USER: {
    BY_ID: (userId: string) => `/api/user/${userId}`, // ✅ fetch user by ID
    ALL: "/api/user", // optional: list all users
  },

  REPORT: {
    CREATE: "/api/reports",
  },

  NOTIFICATION: {
    LIST: "/api/notifications",
    READ: (notificationId: string) => `/api/notifications/${notificationId}/read`,
    READ_ALL: "/api/notifications/read-all",
  },
};
