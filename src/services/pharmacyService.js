import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const pharmacyService = {
  // Xem toàn bộ kho thuốc có phân trang
  getInventory: async (page = 1, size = 10) => {
    return await axiosClient.get(API_ENDPOINTS.PHARMACY.INVENTORY, {
      params: { page, size },
    });
  },

  // Xem cảnh báo thuốc cận hạn hoặc sắp hết tồn kho
  getAlerts: async () => {
    return await axiosClient.get(API_ENDPOINTS.PHARMACY.ALERTS);
  },

  // Cập nhật nhập thêm số lượng kho thuốc
  restockDrug: async (maThuoc, soLuongNhap) => {
    return await axiosClient.post(API_ENDPOINTS.PHARMACY.RESTOCK, {
      maThuoc,
      soLuongNhap,
    });
  },
};
