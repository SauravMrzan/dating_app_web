// List of API endpoints used in the application

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
  },
};
