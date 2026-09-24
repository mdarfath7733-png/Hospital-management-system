import api from './axios';

export const dashboardApi = {
  getDashboardStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
};
