export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  endpoints: {
    login: "/api/login",
    signup: "/api/signup",
    logout: "/api/logout",
  },
};
