import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Row,
  Col,
  Descriptions,
  Table,
  Drawer,
  Modal,
  Tag,
  Space,
  Empty,
  InputNumber,
  Select,
} from 'antd';
import {
  HistoryOutlined,
  PlusOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  MedicineBoxOutlined,
  ExperimentOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDoctorStore } from '../../stores/useDoctorStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { ROUTE_PATHS } from '../../constants/routePaths';
import PageHeader from '../../components/PageHeader';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDateTime } from '../../utils/formatDate';
import { useDebounce } from '../../hooks/useDebounce';

const ExaminationPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [prescForm] = Form.useForm();
  const { user } = useAuthStore();
  const {
    activePatient,
    patientHistory,
    availableDrugsPage,
    prescriptions,
    serviceOrders,
    fetchAvailableDrugs,
    addPrescription,
    removePrescription,
    addServiceOrder,
    removeServiceOrder,
    completeExamination,
    resetConsultation,
    isSubmitting,
  } = useDoctorStore();

  const [historyDrawerVisible, setHistoryDrawerVisible] = useState(false);
  const [drugModalVisible, setDrugModalVisible] = useState(false);
  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const [drugSearch, setDrugSearch] = useState('');
  const debouncedDrugSearch = useDebounce(drugSearch, 350);

  // Trigger drug search when modal opens or debounced keyword changes
  React.useEffect(() => {
    if (drugModalVisible) {
      fetchAvailableDrugs(debouncedDrugSearch, 1, 10);
    }
  }, [drugModalVisible, debouncedDrugSearch, fetchAvailableDrugs]);

  if (!activePatient) {
    return (
      <div>
        <PageHeader title="Phòng Khám Bệnh" subtitle="Không gian hội chẩn và kê đơn" />
        <Card style={{ textAlign: 'center', padding: '60px 0' }}>
          <Empty
            description="Chưa có bệnh nhân nào được chọn vào khám!"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button
              type="primary"
              style={{ backgroundColor: '#0d9488' }}
              onClick={() => navigate(ROUTE_PATHS.DOCTOR.QUEUE)}
            >
              Xem Danh Sách Chờ Khám
            </Button>
          </Empty>
        </Card>
      </div>
    );
  }

  // Handle Complete Consultation
  const handleComplete = async (values) => {
    try {
      const payload = {
        maLichHen: activePatient.maLichHen,
        maBenhNhan: activePatient.maBenhNhan,
        maBacSi: user?.userId || 'BS001',
        trieuChung: values.trieuChung || '',
        chanDoan: values.chanDoan,
        loiDan: values.loiDan || '',
        danhSachThuoc: prescriptions.map((p) => ({
          maThuoc: p.maThuoc,
          soLuong: p.soLuong,
          cachDung: p.cachDung,
          huongDan: p.huongDan,
        })),
      };

      await completeExamination(payload);
      navigate(ROUTE_PATHS.DOCTOR.QUEUE);
    } catch {
      // Handled
    }
  };

  const handleAddDrug = (values) => {
    addPrescription({
      maThuoc: values.drug.maThuoc,
      tenThuoc: values.drug.tenThuoc,
      donViTinh: values.drug.donViTinh,
      donGia: values.drug.donGia,
      soLuong: values.soLuong,
      cachDung: values.cachDung,
      huongDan: values.huongDan || '',
    });
    prescForm.resetFields();
    setDrugModalVisible(false);
  };

  const handleAddService = (values) => {
    const serviceMap = {
      DV001: { maDichVu: 'DV001', tenDichVu: 'Khám nội tổng quát', donGia: 150000 },
      DV002: { maDichVu: 'DV002', tenDichVu: 'Xét nghiệm máu toàn phần', donGia: 200000 },
      DV003: { maDichVu: 'DV003', tenDichVu: 'Chụp X-quang lồng ngực', donGia: 250000 },
    };
    const s = serviceMap[values.maDichVu];
    if (s) {
      addServiceOrder({
        ...s,
        soLuong: values.soLuong || 1,
      });
    }
    setServiceModalVisible(false);
  };

  const drugColumns = [
    { title: 'Tên Thuốc', dataIndex: 'tenThuoc', key: 'tenThuoc' },
    { title: 'ĐVT', dataIndex: 'donViTinh', key: 'donViTinh', width: 70 },
    { title: 'Số Lượng', dataIndex: 'soLuong', key: 'soLuong', width: 90, align: 'center' },
    { title: 'Cách Dùng', dataIndex: 'cachDung', key: 'cachDung' },
    { title: 'Đơn Giá', dataIndex: 'donGia', key: 'donGia', width: 120, render: (v) => formatCurrency(v) },
    {
      title: 'Thành Tiền',
      key: 'total',
      width: 120,
      render: (_, r) => <strong>{formatCurrency(r.donGia * r.soLuong)}</strong>,
    },
    {
      title: '',
      key: 'del',
      width: 50,
      render: (_, __, idx) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removePrescription(idx)}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title={`Khám Bệnh: ${activePatient.tenBenhNhan}`}
        subtitle={`Số thứ tự: #${activePatient.soThuTu} | Mã lịch hẹn: ${activePatient.maLichHen}`}
        extra={
          <Space>
            <Button
              icon={<HistoryOutlined />}
              onClick={() => setHistoryDrawerVisible(true)}
            >
              Tiền Sử Bệnh Án
            </Button>
            <Button danger onClick={() => resetConsultation()}>
              Đổi Bệnh Nhân
            </Button>
          </Space>
        }
      />

      <Card style={{ marginBottom: 20 }}>
        <Descriptions title="Thông tin Bệnh nhân" size="small" bordered column={{ xs: 1, sm: 2, md: 4 }}>
          <Descriptions.Item label="Mã BN">
            <strong>{activePatient.maBenhNhan}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Họ Tên">{activePatient.tenBenhNhan}</Descriptions.Item>
          <Descriptions.Item label="SĐT">{activePatient.soDienThoai}</Descriptions.Item>
          <Descriptions.Item label="Phòng Khám">{activePatient.phongKham}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Form form={form} layout="vertical" onFinish={handleComplete}>
        <Row gutter={20}>
          <Col xs={24} lg={12}>
            <Card title="Hồ Sơ Chẩn Đoán Y Khoa" style={{ marginBottom: 20 }}>
              <Form.Item
                name="trieuChung"
                label="Triệu chứng lâm sàng"
                initialValue="Bệnh nhân sốt, mệt mỏi, đau đầu nhẹ"
              >
                <Input.TextArea rows={3} placeholder="Mô tả triệu chứng..." />
              </Form.Item>

              <Form.Item
                name="chanDoan"
                label="Chẩn đoán xác định"
                rules={[{ required: true, message: 'Vui lòng nhập chẩn đoán bệnh!' }]}
                initialValue="Nhiễm siêu vi đường hô hấp trên"
              >
                <Input.TextArea rows={3} placeholder="Kết luận chẩn đoán..." />
              </Form.Item>

              <Form.Item name="loiDan" label="Lời dặn bác sĩ / Chế độ ăn uống">
                <Input.TextArea rows={2} placeholder="Nghỉ ngơi, uống nhiều nước..." />
              </Form.Item>
            </Card>

            <Card
              title="Chỉ Định Cận Lâm Sàng"
              extra={
                <Button
                  size="small"
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => setServiceModalVisible(true)}
                >
                  Thêm Dịch Vụ
                </Button>
              }
            >
              <Table
                dataSource={serviceOrders}
                rowKey="maDichVu"
                pagination={false}
                size="small"
                columns={[
                  { title: 'Tên Dịch Vụ', dataIndex: 'tenDichVu', key: 'tenDichVu' },
                  { title: 'Số Lượng', dataIndex: 'soLuong', key: 'soLuong', width: 80, align: 'center' },
                  { title: 'Đơn Giá', dataIndex: 'donGia', key: 'donGia', width: 120, render: (v) => formatCurrency(v) },
                  {
                    title: '',
                    key: 'del',
                    width: 50,
                    render: (_, __, i) => (
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => removeServiceOrder(i)}
                      />
                    ),
                  },
                ]}
                locale={{ emptyText: 'Chưa có chỉ định cận lâm sàng nào.' }}
              />
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card
              title="Kê Đơn Thuốc Điều Trị"
              extra={
                <Button
                  type="primary"
                  size="small"
                  icon={<PlusOutlined />}
                  style={{ backgroundColor: '#0d9488' }}
                  onClick={() => setDrugModalVisible(true)}
                >
                  Kê Thêm Thuốc
                </Button>
              }
              style={{ marginBottom: 20 }}
            >
              <Table
                dataSource={prescriptions}
                columns={drugColumns}
                rowKey="maThuoc"
                pagination={false}
                size="small"
                locale={{ emptyText: 'Chưa có thuốc nào trong đơn.' }}
              />
            </Card>

            <Button
              type="primary"
              size="large"
              block
              htmlType="submit"
              icon={<CheckCircleOutlined />}
              loading={isSubmitting}
              style={{
                backgroundColor: '#10b981',
                height: 52,
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              Hoàn Tất Khám & Lưu Hồ Sơ
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Drawer: Medical History */}
      <Drawer
        title={`Tiền Sử Bệnh Án - ${activePatient.tenBenhNhan}`}
        placement="right"
        size="large"
        open={historyDrawerVisible}
        onClose={() => setHistoryDrawerVisible(false)}
      >
        <Table
          dataSource={patientHistory}
          rowKey="maHoSo"
          pagination={false}
          size="small"
          columns={[
            { title: 'Ngày Khám', dataIndex: 'ngayKham', key: 'ngayKham', width: 130, render: (v) => formatDateTime(v) },
            { title: 'Bác Sĩ', dataIndex: 'tenBacSi', key: 'tenBacSi' },
            { title: 'Chẩn Đoán', dataIndex: 'chanDoan', key: 'chanDoan' },
            { title: 'Tổng Tiền', dataIndex: 'tongTien', key: 'tongTien', width: 110, render: (v) => formatCurrency(v) },
          ]}
          locale={{ emptyText: 'Bệnh nhân chưa có tiền sử khám bệnh trước đây.' }}
        />
      </Drawer>

      {/* Modal: Select Medicine */}
      <Modal
        title="Tra Cứu & Kê Đơn Thuốc Khả Dụng"
        open={drugModalVisible}
        width={750}
        onCancel={() => setDrugModalVisible(false)}
        footer={null}
      >
        <Input
          prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
          placeholder="Tìm tên thuốc còn hạn & còn tồn kho..."
          value={drugSearch}
          onChange={(e) => setDrugSearch(e.target.value)}
          style={{ marginBottom: 16 }}
          allowClear
        />

        <Table
          dataSource={availableDrugsPage.items}
          rowKey="maThuoc"
          size="small"
          pagination={{
            current: availableDrugsPage.page,
            pageSize: availableDrugsPage.size,
            total: availableDrugsPage.totalElements,
            onChange: (p, s) => fetchAvailableDrugs(drugSearch, p, s),
          }}
          columns={[
            { title: 'Mã', dataIndex: 'maThuoc', key: 'maThuoc', width: 70 },
            { title: 'Tên Thuốc', dataIndex: 'tenThuoc', key: 'tenThuoc' },
            { title: 'ĐVT', dataIndex: 'donViTinh', key: 'donViTinh', width: 70 },
            {
              title: 'Tồn Kho',
              dataIndex: 'soLuongTon',
              key: 'soLuongTon',
              width: 90,
              render: (v) => <Tag color={v > 20 ? 'green' : 'orange'}>{v}</Tag>,
            },
            { title: 'Đơn Giá', dataIndex: 'donGia', key: 'donGia', width: 100, render: (v) => formatCurrency(v) },
            {
              title: 'Hành Động',
              key: 'act',
              width: 100,
              render: (_, record) => (
                <Button
                  size="small"
                  type="primary"
                  style={{ backgroundColor: '#0d9488' }}
                  onClick={() => {
                    prescForm.setFieldsValue({
                      drug: record,
                      soLuong: 1,
                      cachDung: 'Uống 1 viên sau ăn, ngày 2 lần',
                    });
                  }}
                >
                  Chọn
                </Button>
              ),
            },
          ]}
        />

        <Card title="Chi Tiết Thuốc Đã Chọn" size="small" style={{ marginTop: 16 }}>
          <Form form={prescForm} layout="vertical" onFinish={handleAddDrug}>
            <Form.Item name="drug" hidden rules={[{ required: true, message: 'Vui lòng chọn thuốc từ bảng trên!' }]}>
              <Input />
            </Form.Item>

            <Row gutter={12}>
              <Col span={8}>
                <Form.Item
                  name="soLuong"
                  label="Số lượng kê"
                  rules={[{ required: true, message: 'Nhập số lượng!' }]}
                  initialValue={1}
                >
                  <InputNumber min={1} max={100} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item
                  name="cachDung"
                  label="Liều dùng & Cách dùng"
                  rules={[{ required: true, message: 'Nhập cách dùng!' }]}
                  initialValue="Uống 1 viên sau ăn, ngày 2 lần"
                >
                  <Input placeholder="Ví dụ: Ngày 2 lần, mỗi lần 1 viên sau ăn" />
                </Form.Item>
              </Col>
            </Row>

            <Button
              type="primary"
              htmlType="submit"
              block
              style={{ backgroundColor: '#0d9488' }}
            >
              Thêm Thuốc Này Vào Đơn
            </Button>
          </Form>
        </Card>
      </Modal>

      {/* Modal: Service Order */}
      <Modal
        title="Chỉ Định Dịch Vụ Kỹ Thuật"
        open={serviceModalVisible}
        onCancel={() => setServiceModalVisible(false)}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleAddService} initialValues={{ maDichVu: 'DV002', soLuong: 1 }}>
          <Form.Item name="maDichVu" label="Chọn Dịch Vụ Cận Lâm Sàng">
            <Select size="large">
              <Select.Option value="DV001">Khám nội tổng quát - 150.000 ₫</Select.Option>
              <Select.Option value="DV002">Xét nghiệm máu toàn phần - 200.000 ₫</Select.Option>
              <Select.Option value="DV003">Chụp X-quang lồng ngực - 250.000 ₫</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="soLuong" label="Số Lượng">
            <InputNumber min={1} style={{ width: '100%' }} size="large" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large" style={{ backgroundColor: '#0d9488' }}>
            Xác Nhận Chỉ Định
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default ExaminationPage;
