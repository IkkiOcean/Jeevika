import axios from "axios";

let axiosInstance = null;

async function createAxiosInstance() {
  if (axiosInstance) return axiosInstance;

  let backend = null;

  try {
    const res = await fetch("https://gist.githubusercontent.com/IkkiOcean/49ae49feb5b086f64cf6f7f7e8752c3e/raw/jeevika-api-config.json");
    const data = await res.json();
    console.log(data)
    backend = data.apiUrl;
  } catch (e) {
    console.error("Failed to load backend from gist, using fallback.");
    backend = "http://localhost:8030";
  }
console.log("Using backend URL:", backend);
  axiosInstance = axios.create({
    baseURL: backend,
    timeout: 10000,
  });

  // ------------------------------
  //       ERROR INTERCEPTOR
  // ------------------------------
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Already on error page -> don't redirect again
      if (window.location.pathname === "/error") {
        return Promise.reject(error);
      }

      // Network Error
      if (!error.response) {
        console.error("Backend Connection Error:", error.message);
        sessionStorage.setItem("connectionError", "true");
        sessionStorage.setItem("errorMessage", "Drug Dispenser Not Connected");
        sessionStorage.setItem("errorType", "connection");
        window.location.href = "/error";
        return Promise.reject(error);
      }

      // 4xx
      if (error.response.status >= 400 && error.response.status < 500) {
        console.error(`Client Error [${error.response.status}]`, error.response.data);

        if (error.response.status === 404) {
          sessionStorage.setItem("errorMessage", "Resource Not Found");
          sessionStorage.setItem("errorType", "not-found");
        } else if (error.response.status === 401) {
          sessionStorage.setItem("errorMessage", "Unauthorized Access");
          sessionStorage.setItem("errorType", "unauthorized");
        }

        window.location.href = "/error";
        return Promise.reject(error);
      }

      // 5xx
      if (error.response.status >= 500) {
        console.error(`Server Error [${error.response.status}]`, error.response.data);
        sessionStorage.setItem("connectionError", "true");
        sessionStorage.setItem("errorMessage", "Backend Server Error");
        sessionStorage.setItem("errorType", "server");
        window.location.href = "/error";
        return Promise.reject(error);
      }

      // Timeout
      if (error.code === "ECONNABORTED") {
        console.error("Request Timeout:", error.message);
        sessionStorage.setItem("errorMessage", "Request Timeout - Device Not Responding");
        sessionStorage.setItem("errorType", "timeout");
        window.location.href = "/error";
        return Promise.reject(error);
      }

      return Promise.reject(error);
    }
  );

  return axiosInstance;
}

// ------------------------------
//      PUBLIC API FUNCTIONS
// ------------------------------

export async function apiGet(url) {
  const instance = await createAxiosInstance();
  return instance.get(url);
}

export async function apiPost(url, body) {
  const instance = await createAxiosInstance();
  return instance.post(url, body);
}

export async function apiPut(url, body) {
  const instance = await createAxiosInstance();
  return instance.put(url, body);
}

export async function apiDelete(url) {
  const instance = await createAxiosInstance();
  return instance.delete(url);
}