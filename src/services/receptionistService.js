import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../constants/apiEndpoints';

export const receptionistService = {
  // Lấy hàng chờ khám hôm nay
  getWaitingQueue: async () => {
    return await axiosClient.get(API_ENDPOINTS.RECEPTIONIST.QUEUE);
  },

  // Tìm kiếm bệnh nhân có phân trang
  searchPatients: async (keyword = '', page = 1, size = 10) => {
    return await axiosClient.get(API_ENDPOINTS.RECEPTIONIST.PATIENTS_SEARCH, {
      params: { keyword, page, size },
    });
  },

  // Tiếp nhận bệnh nhân mới
  checkInPatient: async (data) => {
    return await axiosClient.post(API_ENDPOINTS.RECEPTIONIST.CHECK_IN, data);
  },

  // Thanh toán hóa đơn viện phí
  checkoutInvoice: async (data) => {
    return await axiosClient.post(API_ENDPOINTS.RECEPTIONIST.PAYMENT, data);
  },

  // Hủy lịch hẹn
  cancelAppointment: async (data) => {
    return await axiosClient.put(API_ENDPOINTS.RECEPTIONIST.CANCEL_APPOINTMENT, data);
  },
};
