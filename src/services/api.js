// API Client für Kommunikation mit dem Boulder Backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Token management
const TOKEN_KEY = 'boulder_auth_token';

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Helper function für API requests
const apiCall = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearToken();
    window.location.href = '/login';
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API error: ${response.status}`);
  }

  return response.json();
};

// ─── Auth Endpoints ───────────────────────────────────────────────────

export const authLogin = async (email, password) => {
  const data = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data.token) {
    setToken(data.token);
  }
  return data;
};

export const authRegister = async (email, password, name) => {
  const data = await apiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });
  if (data.token) {
    setToken(data.token);
  }
  return data;
};

export const authLogout = () => {
  clearToken();
};

// ─── Routes Endpoints ─────────────────────────────────────────────────

export const getRoutes = async () => {
  return apiCall('/routes');
};

export const getRouteById = async (id) => {
  return apiCall(`/routes/${id}`);
};

export const getRouteByQR = async (qrCode) => {
  return apiCall(`/routes/qr/${qrCode}`);
};

export const createRoute = async (routeData) => {
  return apiCall('/routes', {
    method: 'POST',
    body: JSON.stringify(routeData),
  });
};

export const updateRoute = async (id, routeData) => {
  return apiCall(`/routes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(routeData),
  });
};

export const deleteRoute = async (id) => {
  return apiCall(`/routes/${id}`, {
    method: 'DELETE',
  });
};

export const archiveRoute = async (id) => {
  return updateRoute(id, { status: 'ARCHIVED' });
};

// ─── Users Endpoints ──────────────────────────────────────────────────

export const getUsers = async () => {
  return apiCall('/users');
};

export const getUserById = async (id) => {
  return apiCall(`/users/${id}`);
};

export const updateUser = async (id, userData) => {
  return apiCall(`/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(userData),
  });
};

// ─── Health Check ─────────────────────────────────────────────────────

export const healthCheck = async () => {
  try {
    return await fetch(`${API_BASE_URL}/health`).then(r => r.json());
  } catch {
    return null;
  }
};
