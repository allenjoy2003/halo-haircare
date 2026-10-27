/**
 * Halo API Client
 * Seamlessly interfaces with Django REST Framework backend
 * Supports optional JWT authentication and silent token refresh.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export function getStoredTokens() {
  try {
    const raw = localStorage.getItem('halo_tokens');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredTokens(tokens) {
  if (tokens) {
    localStorage.setItem('halo_tokens', JSON.stringify(tokens));
  } else {
    localStorage.removeItem('halo_tokens');
  }
}

async function refreshTokenIfNeeded() {
  const tokens = getStoredTokens();
  if (!tokens || !tokens.refresh) return null;

  try {
    const res = await fetch(`${BASE_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: tokens.refresh }),
    });
    if (res.ok) {
      const data = await res.json();
      const updatedTokens = { ...tokens, access: data.access, ...(data.refresh ? { refresh: data.refresh } : {}) };
      setStoredTokens(updatedTokens);
      return updatedTokens.access;
    }
  } catch (err) {
    console.warn('Silent token refresh failed:', err);
  }
  return null;
}

async function request(endpoint, options = {}, retryOn401 = true) {
  const url = `${BASE_URL}${endpoint}`;
  const tokens = getStoredTokens();

  const headers = {
    'Content-Type': 'application/json',
    ...(tokens?.access ? { Authorization: `Bearer ${tokens.access}` } : {}),
    ...(options.headers || {}),
  };

  try {
    let res = await fetch(url, { ...options, headers });

    // Handle expired token with silent refresh & single retry
    if (res.status === 401 && retryOn401 && tokens?.refresh) {
      const newAccess = await refreshTokenIfNeeded();
      if (newAccess) {
        headers.Authorization = `Bearer ${newAccess}`;
        res = await fetch(url, { ...options, headers });
      }
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.error || `HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Auth & Profile
  register: (data) => request('/auth/register/', { method: 'POST', body: JSON.stringify(data) }, false),
  login: (data) => request('/auth/login/', { method: 'POST', body: JSON.stringify(data) }, false),
  getMe: () => request('/auth/me/'),
  getMyOrders: () => request('/orders/my-orders/'),

  // Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams();
    if (params.concern) query.set('concern', params.concern);
    if (params.hair_type) query.set('hair_type', params.hair_type);
    if (params.category) query.set('category', params.category);
    if (params.routine_step) query.set('routine_step', params.routine_step);
    if (params.search) query.set('search', params.search);
    if (params.ordering) query.set('ordering', params.ordering);

    const queryString = query.toString();
    return request(`/products/${queryString ? `?${queryString}` : ''}`);
  },

  getProductBySlug: (slug) => request(`/products/${slug}/`),
  getBestsellers: () => request('/products/bestsellers/'),

  // Routine Bundles
  getRoutines: (params = {}) => {
    const query = new URLSearchParams();
    if (params.concern) query.set('concern', params.concern);
    if (params.hair_type) query.set('hair_type', params.hair_type);

    const queryString = query.toString();
    return request(`/routines/${queryString ? `?${queryString}` : ''}`);
  },

  getRoutineBySlug: (slug) => request(`/routines/${slug}/`),

  // Meta taxonomies
  getCategories: () => request('/categories/'),
  getConcerns: () => request('/concerns/'),
  getHairTypes: () => request('/hair-types/'),
  getReviews: () => request('/reviews/'),

  // Aria AI Hair Guide (Supports optional user authentication)
  sendHairConsultation: (data) => {
    return request('/chat/hair-consultation/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getChatSession: (sessionId) => request(`/chat/session/${sessionId}/`),

  // Twilio OTP SMS
  sendOtp: (phoneNumber) => {
    return request('/auth/send-otp/', {
      method: 'POST',
      body: JSON.stringify({ phone_number: phoneNumber }),
    });
  },

  verifyOtp: (phoneNumber, code, orderId = null) => {
    return request('/auth/verify-otp/', {
      method: 'POST',
      body: JSON.stringify({ phone_number: phoneNumber, code, order_id: orderId }),
    });
  },

  // Razorpay Payment
  createRazorpayOrder: (orderData) => {
    return request('/payment/create-order/', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  verifyRazorpayPayment: (paymentData) => {
    return request('/payment/verify-payment/', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },
};

export default api;
