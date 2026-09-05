/**
 * @file config.js
 * @description Centralized configuration for API base URLs and environment variables.
 */

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8082";
export const API_URL = `${API_BASE_URL}/api`;
export const WS_URL = `${API_BASE_URL}/ws`;
export const UPLOADS_URL = `${API_BASE_URL}/uploads/`;

export default {
  API_BASE_URL,
  API_URL,
  WS_URL,
  UPLOADS_URL,
};
