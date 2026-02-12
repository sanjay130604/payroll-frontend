import axiosInstance from "./axiosConfig";

export const login = (email, password) => {
  return axiosInstance.post("/api/auth/login", {
    email,
    password,
  });
};
