# MEDICARE CLINIC - FRONTEND (REACT 19 / VITE / ANT DESIGN 6)

Giao diện người dùng Web SPA (Single Page Application) cho Đồ án **Quản Lý Phòng Khám Tư Nhân (Medicare Clinic)**, được xây dựng trên nền tảng **React 19**, **Vite**, **Ant Design v6**, **Zustand** và **Axios**.

* 🔗 **Frontend Repository:** [https://github.com/VoMinhGiauSPKT/FE_QuanLyPhongKham](https://github.com/VoMinhGiauSPKT/FE_QuanLyPhongKham)
* 🔗 **Backend Repository:** [https://github.com/VoMinhGiauSPKT/BE_QuanLyPhongKham](https://github.com/VoMinhGiauSPKT/BE_QuanLyPhongKham)

---

## 📌 1. CÔNG NGHỆ SỬ DỤNG

* **Framework & Core:** React 19, Vite (Hot Module Replacement cực nhanh).
* **UI Component Library:** Ant Design v6 (`antd`), `@ant-design/icons`.
* **Quản lý State:** Zustand (nhẹ, hiệu năng cao, phân tách theo từng module).
* **Định tuyến (Routing):** React Router DOM v7 (Hỗ trợ Protected Routes bảo vệ màn hình theo vai trò).
* **HTTP Client:** Axios (Cấu hình Interceptor tự động đính kèm `Bearer Token`, tự động bắt lỗi từ chối quyền CSDL `FORBIDDEN_DB`).
* **Thời gian & Styling:** Day.js, SCSS / CSS Modules.

---

## 📂 2. CẤU TRÚC THƯ MỤC FRONTEND

```
FE_QuanLyPhongKham/
├── index.html                            # Trang HTML gốc
├── vite.config.js                        # Cấu hình Vite & plugins
├── package.json                          # Khai báo thư viện & script chạy
├── .env                                  # (Tùy chọn) Cấu hình URL Backend
└── src/
    ├── api/
    │   └── axiosClient.js                # Axios instance kèm Interceptors & bắt lỗi
    ├── assets/                           # Hình ảnh, logo, tài nguyên tĩnh
    ├── components/                       # Các component tái sử dụng (Header, StatusBadge...)
    ├── constants/                        # Khai báo hằng số hệ thống
    │   ├── apiEndpoints.js               # Danh mục toàn bộ URL API Backend
    │   ├── roleConstants.js              # Định nghĩa các vai trò (QUAN_TRI, BAC_SI...)
    │   └── routePaths.js                 # Đường dẫn các route trang
    ├── features/                         # Các màn hình nghiệp vụ chính
    │   ├── admin/                        # Quản lý người dùng, Dịch vụ, Năng suất, Doanh thu
    │   ├── auth/                         # Trang Đăng nhập (LoginPage)
    │   ├── doctor/                       # Danh sách chờ khám, Phòng khám bệnh & kê đơn
    │   ├── pharmacy/                     # Kho thuốc, Nhập kho, Lịch sử đổi giá thuốc
    │   └── receptionist/                 # Tiếp nhận bệnh nhân, Hàng chờ, Thu viện phí
    ├── layouts/                          # Bố cục giao diện chung (MainLayout, Sidebar, Navbar)
    ├── routes/                           # Cấu hình điều hướng và phân quyền URL
    │   ├── AppRoutes.jsx                 # Bộ định tuyến toàn hệ thống
    │   └── ProtectedRoute.jsx            # Chặn truy cập trái phép nếu không đúng vai trò
    ├── services/                         # Tầng gọi API qua axios (auth, admin, doctor, pharmacy...)
    ├── stores/                           # Zustand store lưu trạng thái toàn cục
    │   ├── useAuthStore.js               # Lưu thông tin phiên đăng nhập & JWT token
    │   ├── useAdminStore.js              # Quản lý state admin (người dùng, dịch vụ...)
    │   ├── useDoctorStore.js             # Quản lý state phòng khám
    │   ├── usePharmacyStore.js           # Quản lý state kho thuốc
    │   └── useReceptionistStore.js       # Quản lý state tiếp nhận & thanh toán
    └── utils/                            # Tiện ích format tiền tệ, ngày tháng, thông báo
```

---

## ⚙️ 3. YÊU CẦU MÔI TRƯỜNG (PREREQUISITES)

* **Node.js:** Phiên bản **18.x** hoặc **20.x+** trở lên. (Tải tại [nodejs.org](https://nodejs.org/)).
* **Trình quản lý gói:** `npm` (đã đi kèm sẵn với Node.js) hoặc `yarn` / `pnpm`.

Kiểm tra phiên bản trong terminal:
```bash
node -v
npm -v
```

---

## 🚀 4. HƯỚNG DẪN CÀI ĐẶT & CHẠY ỨNG DỤNG

### Bước 1: Mở terminal và di chuyển vào thư mục Frontend
```bash
cd FE_QuanLyPhongKham
```

### Bước 2: Cài đặt các thư viện phụ thuộc (Dependencies)
```bash
npm install
```

### Bước 3: Cấu hình kết nối Backend (Nếu cần)
Mặc định hệ thống kết nối tới Backend tại: `http://localhost:8080/QuanLyPhongKham/api`.  
Nếu Backend chạy ở địa chỉ hoặc cổng khác, bạn có thể tạo file `.env` tại thư mục gốc `FE_QuanLyPhongKham/`:
```properties
VITE_API_BASE_URL=http://localhost:8080/QuanLyPhongKham/api
```

### Bước 4: Khởi chạy môi trường phát triển (Development Server)
```bash
npm run dev
```

* Ứng dụng sẽ khởi chạy tại: **`http://localhost:5173/`**
* Mở trình duyệt web và truy cập địa chỉ trên để sử dụng hệ thống.

### Bước 5: Đóng gói bản Production (Khi cần triển khai)
```bash
npm run build
```
Bản build tĩnh tối ưu hóa sẽ được xuất ra thư mục `dist/`.

---

## 🔑 5. TÀI KHOẢN TRUY CẬP KIỂM THỬ (DEMO ACCOUNTS)

Mật khẩu mặc định cho toàn bộ tài khoản thử nghiệm là: **`123456`**

| Vai trò | Tên đăng nhập | Mật khẩu | Quyền hạn & Màn hình trải nghiệm |
| :--- | :---: | :---: | :--- |
| **Quản trị viên (Admin)** | `admin` | `123456` | Quản lý người dùng, danh mục dịch vụ cận lâm sàng, xem biểu đồ doanh thu & năng suất bác sĩ. |
| **Bác sĩ (Doctor)** | `bacsi1` | `123456` | Tiếp nhận ca khám, xem lịch sử bệnh án, chỉ định xét nghiệm cận lâm sàng, kê đơn nhiều thuốc. |
| **Lễ tân / Thu ngân** | `letan1` | `123456` | Đón tiếp bệnh nhân, cấp số thứ tự khám tự động, theo dõi hàng chờ, tính viện phí và thu tiền. |
| **Dược sĩ (Pharmacist)** | `duocsi1` | `123456` | Quản lý kho dược phẩm, nhập kho, cảnh báo thuốc sắp hết hạn/hết hàng, xem nhật ký biến động giá. |

---

## 💡 6. TÍNH NĂNG NỔI BẬT TRÊN GIAO DIỆN

1. **Phân quyền động (Dynamic Role-based Routing):** Menu điều hướng và các tính năng tự động hiển thị hoặc ẩn đi chính xác theo vai trò sau khi đăng nhập.
2. **Bắt lỗi bảo mật tầng CSDL (Least Privilege UI Feedback):** Khi một thao tác bị SQL Server chặn (ví dụ: Bác sĩ cố tình sửa giá thuốc hoặc Lễ tân cố tình xem chẩn đoán mật), giao diện sẽ hiển thị cảnh báo đỏ chi tiết lỗi bảo mật phân quyền thay vì lỗi hệ thống chung chung.
3. **Responsive & Trải nghiệm mượt mà:** Bảng dữ liệu có bộ lọc nhanh, tìm kiếm phân trang tức thì, popup xác nhận thao tác và thông báo Ant Design Notification trực quan.
