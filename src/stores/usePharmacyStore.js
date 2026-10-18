import { create } from 'zustand';
import { pharmacyService } from '../services/pharmacyService';
import { showSuccess } from '../utils/notificationUtil';

export const usePharmacyStore = create((set, get) => ({
  drugPage: {
    items: [],
    page: 1,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  },
  alertList: [],
  isLoading: false,
  isSubmitting: false,

  // Lấy danh mục kho thuốc có phân trang
  fetchInventory: async (page = 1, size = 10) => {
    set({ isLoading: true });
    try {
      const data = await pharmacyService.getInventory(page, size);
      set({
        drugPage: {
          items: data?.items || [],
          page: data?.page || 1,
          size: data?.size || 10,
          totalElements: data?.totalElements || 0,
          totalPages: data?.totalPages || 0,
        },
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  // Lấy danh sách thuốc cận hạn / tồn kho thấp
  fetchAlerts: async () => {
    set({ isLoading: true });
    try {
      const data = await pharmacyService.getAlerts();
      set({ alertList: Array.isArray(data) ? data : [], isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  // Nhập thêm hàng vào kho
  restockDrug: async (maThuoc, soLuongNhap) => {
    set({ isSubmitting: true });
    try {
      await pharmacyService.restockDrug(maThuoc, soLuongNhap);
      showSuccess(`Nhập thêm ${soLuongNhap} đơn vị thuốc vào kho thành công!`);
      const current = get().drugPage;
      get().fetchInventory(current.page, current.size);
      get().fetchAlerts();
      set({ isSubmitting: false });
    } catch (err) {
      set({ isSubmitting: false });
      throw err;
    }
  },
}));
