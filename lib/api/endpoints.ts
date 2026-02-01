// List of API endpoints used in the application

export const API = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    WHOAMI: '/auth/whoami',
    UPDATEPROFILE: '/auth/update-profile',
  },
  ADMIN: {
    STATS: "/admin/dashboard-stats", 
    USERS: "/admin/users",
    USER: {
      CREATE: '/admin/users',
      DELETE: (id: string) => `/admin/users/${id}`,
      UPDATE: (id: string) => `/admin/users/${id}`,
    }
  }
};