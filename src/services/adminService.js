import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const adminService = {
  // Báo cáo tổng hợp doanh thu theo ngày
  getDailyReport: async () => {
    return await axiosClient.get(API_ENDPOINTS.ADMIN.DAILY_REPORT);
  },

  // Thống kê doanh thu theo khoảng ngày
  getDateRangeRevenue: async (tuNgay, denNgay) => {
    return await axiosClient.get(API_ENDPOINTS.ADMIN.DATE_RANGE_REVENUE, {
      params: { tuNgay, denNgay },
    });
  },

  // Đánh giá năng suất bác sĩ
  getDoctorProductivity: async () => {
    return await axiosClient.get(API_ENDPOINTS.ADMIN.DOCTOR_PRODUCTIVITY);
  },
};
