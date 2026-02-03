// List of API endpoints used in the application

export const API = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    WHOAMI: "/api/whoami",
    UPDATEPROFILE: "/api/update-profile",
  },
  ADMIN: {
    STATS: "/api/admin/dashboard-stats", // Add this line
    USERS: "/api/admin/users",
    USER: {
      CREATE: "/api/admin/users/",
    },
  },
};
