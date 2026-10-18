export const BASE_API_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/QuanLyPhongKham/api';

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
  },

  // Receptionist (Lễ tân / Thu ngân)
  RECEPTIONIST: {
    CHECK_IN: '/le-tan/tiep-nhan',
    QUEUE: '/le-tan/hang-cho',
    PATIENTS_SEARCH: '/le-tan/tim-benh-nhan',
    PAYMENT: '/le-tan/thanh-toan',
    CANCEL_APPOINTMENT: '/le-tan/huy-lich',
  },

  // Doctor (Bác sĩ)
  DOCTOR: {
    QUEUE: '/bac-si/danh-sach-cho',
    PATIENT_HISTORY: '/bac-si/lich-su',
    AVAILABLE_DRUGS: '/bac-si/thuoc-kha-dung',
    ORDER_SERVICE: '/bac-si/chi-dinh-dich-vu',
    COMPLETE_EXAMINATION: '/bac-si/hoan-tat-kham',
  },

  // Pharmacy (Dược sĩ / Kho dược)
  PHARMACY: {
    INVENTORY: '/duoc-si/kho',
    RESTOCK: '/duoc-si/nhap-kho',
    ALERTS: '/duoc-si/canh-bao',
  },

  // Admin (Quản trị viên)
  ADMIN: {
    DAILY_REPORT: '/admin/bao-cao-ngay',
    DATE_RANGE_REVENUE: '/admin/thong-ke-khoang-ngay',
    DOCTOR_PRODUCTIVITY: '/admin/nang-suat-bac-si',
  },
};
