import axios from "axios";

// --- Utility: decode JWT (no crypto validation, for debug only) ---
function decodeJwtRaw(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(payload);
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

const client = axios.create({
  baseURL: "https://project-beta-backend-library-manage.vercel.app/api",
});

client.interceptors.request.use((config) => {
  // Emergency bypass - if you set bypassAuth=true on config, skip auth entirely
  if (config.bypassAuth) {
    console.debug(
      "[API] → BYPASS AUTH",
      config.method?.toUpperCase(),
      config.url
    );
    return config;
  }

  let stored =
    localStorage.getItem("token") ||
    localStorage.getItem("jwt") ||
    localStorage.getItem("authToken") ||
    "";
  stored = stored.trim().replace(/^"|"$/g, "");

  // More aggressive cleaning - remove ALL Bearer prefixes and whitespace
  let raw = stored.replace(/Bearer\s*/gi, "").trim();

  // If still empty, try without any prefix manipulation
  if (!raw && stored) {
    raw = stored;
  }

  const payload = raw ? decodeJwtRaw(raw) : null;
  let expired = false;
  if (payload && payload.exp) {
    const nowSec = Math.floor(Date.now() / 1000);
    expired = payload.exp < nowSec;
    if (expired) {
      console.warn(
        "JWT expired at",
        new Date(payload.exp * 1000).toISOString()
      );
    }
  }

  if (expired) {
    localStorage.removeItem("token");
  }
  const bearer = expired ? "" : raw ? `Bearer ${raw}` : "";
  config.headers.Authorization = bearer;

  console.debug(
    "[API] →",
    config.method?.toUpperCase(),
    config.url,
    "authPresent=",
    !!bearer,
    "tokenLength=",
    raw?.length || 0,
    payload ? `role=${payload.role || payload.userRole || "?"}` : "no-payload",
    payload && payload.exp
      ? `expInSec=${payload.exp - Math.floor(Date.now() / 1000)}`
      : ""
  );
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response) {
      const {status, data, config} = error.response;
      console.error("[API ERROR]", status, config?.url, data);
      if (status === 401) {
        const t = localStorage.getItem("token") || "";
        console.warn(
          "401 received. storedTokenPreview=",
          t.slice(0, 40) + "...",
          "length=",
          t.length
        );
        if (/^Bearer\s+Bearer/i.test(t))
          console.warn(
            "Double Bearer found in storage (now normalized before send)"
          );
      }
    } else {
      console.error("[API NETWORK]", error.message);
    }
    return Promise.reject(error);
  }
);

// Export utility functions for manual testing
window.testAPI = {
  testFetch: async () => {
    const token = localStorage.getItem("token");
    console.log("Testing with token:", token?.slice(0, 30) + "...");
    try {
      const res = await fetch(
        "https://project-beta-backend-library-manage.vercel.app/api/admin/users",
        {
          headers: {Authorization: token},
        }
      );
      console.log("Direct fetch status:", res.status);
      if (res.ok) {
        const data = await res.json();
        console.log("Direct fetch data:", data);
        return data;
      } else {
        const err = await res.text();
        console.log("Direct fetch error:", err);
      }
    } catch (e) {
      console.error("Direct fetch failed:", e);
    }
  },

  resetToken: (newToken) => {
    localStorage.removeItem("token");
    if (newToken) {
      localStorage.setItem("token", newToken);
      console.log("Token set to:", newToken.slice(0, 30) + "...");
    }
    console.log("Token reset. Reload page to test.");
  },

  testNoAuth: async () => {
    try {
      const res = await client.get("/admin/users", {bypassAuth: true});
      console.log("No auth test result:", res.data);
    } catch (e) {
      console.log("No auth test failed:", e.response?.status, e.response?.data);
    }
  },
};

export default client;
