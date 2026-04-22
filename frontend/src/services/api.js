import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

export async function analyzeProfile(username) {
  const { data } = await api.get(`/analyze/${encodeURIComponent(username)}`);
  return data;
}

export default api;
