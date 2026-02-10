// API Service - All backend API calls

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function to get headers
const getHeaders = (includeAuth = false) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Handle API response
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  
  return data;
};

// ==================== AUTH APIs ====================

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });

    const data = await handleResponse(response);

    if (data.success && data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });

    const data = await handleResponse(response);

    if (data.success && data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: getHeaders(true),
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const updateProfile = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(userData),
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

// ==================== SCHEME APIs ====================

export const getSchemes = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams ? `${API_URL}/schemes?${queryParams}` : `${API_URL}/schemes`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const getSchemeById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/schemes/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const getSchemeCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/schemes/categories/all`, {
      method: 'GET',
      headers: getHeaders(),
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const getSchemeStats = async () => {
  try {
    const response = await fetch(`${API_URL}/schemes/stats/overview`, {
      method: 'GET',
      headers: getHeaders(),
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

// ==================== APPLICATION APIs ====================

export const submitApplication = async (applicationData) => {
  try {
    const response = await fetch(`${API_URL}/applications`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(applicationData),
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const getMyApplications = async () => {
  try {
    const response = await fetch(`${API_URL}/applications/my-applications`, {
      method: 'GET',
      headers: getHeaders(true),
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const getApplicationById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/applications/${id}`, {
      method: 'GET',
      headers: getHeaders(true),
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const trackApplication = async (applicationId) => {
  try {
    const response = await fetch(`${API_URL}/applications/track/${applicationId}`, {
      method: 'GET',
      headers: getHeaders(true),
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const uploadApplicationDocuments = async (applicationId, files) => {
  try {
    const formData = new FormData();
    
    // Append multiple files
    for (let i = 0; i < files.length; i++) {
      formData.append('documents', files[i]);
    }

    const response = await fetch(`${API_URL}/applications/${applicationId}/documents`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        // Don't set Content-Type for FormData - browser will set it with boundary
      },
      body: formData,
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

// ==================== GRIEVANCE APIs ====================

export const submitGrievance = async (grievanceData) => {
  try {
    const response = await fetch(`${API_URL}/grievances`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(grievanceData),
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const getMyGrievances = async () => {
  try {
    const response = await fetch(`${API_URL}/grievances/my-grievances`, {
      method: 'GET',
      headers: getHeaders(true),
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const trackGrievance = async (trackingId) => {
  try {
    const response = await fetch(`${API_URL}/grievances/track/${trackingId}`, {
      method: 'GET',
      headers: getHeaders(true),
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const getGrievanceById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/grievances/${id}`, {
      method: 'GET',
      headers: getHeaders(true),
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const uploadGrievanceAttachments = async (grievanceId, files) => {
  try {
    const formData = new FormData();
    
    // Append multiple files
    for (let i = 0; i < files.length; i++) {
      formData.append('attachments', files[i]);
    }

    const response = await fetch(`${API_URL}/grievances/${grievanceId}/attachments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
      body: formData,
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const submitGrievanceFeedback = async (grievanceId, rating, comment) => {
  try {
    const response = await fetch(`${API_URL}/grievances/${grievanceId}/feedback`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ rating, comment }),
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

// ==================== ADMIN APIs (Optional) ====================

export const getAllApplications = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams ? `${API_URL}/applications?${queryParams}` : `${API_URL}/applications`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(true),
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const updateApplicationStatus = async (applicationId, status, remarks) => {
  try {
    const response = await fetch(`${API_URL}/applications/${applicationId}/status`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify({ status, remarks }),
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const getAllGrievances = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const url = queryParams ? `${API_URL}/grievances?${queryParams}` : `${API_URL}/grievances`;

    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(true),
    });

    return await handleResponse(response);
  } catch (error) {
    throw error;
  }
};

export const updateGrievanceStatus = async (grievanceId, status, response) => {
  try {
    const res = await fetch(`${API_URL}/grievances/${grievanceId}/status`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify({ status, response }),
    });

    return await handleResponse(res);
  } catch (error) {
    throw error;
  }
};