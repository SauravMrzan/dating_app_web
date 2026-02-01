// List of API endpoints used in the application

export const API = {
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    WHOAMI: '/whoami',
    UPDATEPROFILE: '/update-profile',
  },
  ADMIN:{
    STATS: "/admin/dashboard-stats", // Add this line
    USERS: "/admin/users",
        USER:{
            CREATE: '/admin/users/',

        }
    }
};
