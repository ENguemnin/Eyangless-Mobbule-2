// src/app/config/api.config.ts

export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080/api',
  ENDPOINTS: {
    CITES: '/cites',
    AUTH: '/auth'
  },
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

export const API_URLS = {
  // Cités
  GET_ALL_CITES: (pageNo: number, pageSize: number) =>
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CITES}/${pageNo}/${pageSize}`,

  GET_CITE_BY_ID: (id: string) =>
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CITES}/${id}`,

  CREATE_CITE: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CITES}`,

  UPDATE_CITE: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CITES}`,

  DELETE_CITE: (id: string) =>
    `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CITES}/${id}`
};
