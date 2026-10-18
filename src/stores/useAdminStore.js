import { create } from 'zustand';
import { adminService } from '../services/adminService';

export const useAdminStore = create((set) => ({
  dailyReport: null,
  dateRangeRevenue: [],
  doctorProductivity: [],
  isLoading: false,

  // Báo cáo ngày
  fetchDailyReport: async () => {
    set({ isLoading: true });
    try {
      const data = await adminService.getDailyReport();
      set({ dailyReport: data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  // Thống kê doanh thu theo khoảng ngày
  fetchDateRangeRevenue: async (tuNgay, denNgay) => {
    set({ isLoading: true });
    try {
      const data = await adminService.getDateRangeRevenue(tuNgay, denNgay);
      set({ dateRangeRevenue: Array.isArray(data) ? data : [], isLoading: false });
    } catch {
      set({ dateRangeRevenue: [], isLoading: false });
    }
  },

  // Đánh giá năng suất bác sĩ
  fetchDoctorProductivity: async () => {
    set({ isLoading: true });
    try {
      const data = await adminService.getDoctorProductivity();
      set({ doctorProductivity: Array.isArray(data) ? data : [], isLoading: false });
    } catch {
      set({ doctorProductivity: [], isLoading: false });
    }
  },
}));
