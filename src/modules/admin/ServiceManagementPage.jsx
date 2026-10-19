import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Tag,
  Switch,
  Space,
  Modal,
  Form,
  InputNumber,
  Popconfirm,
  Row,
  Col,
  Typography,
  Tooltip,
  Badge,
} from 'antd';
import {
  MedicineBoxOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
  FileDoneOutlined,
} from '@ant-design/icons';
import { useAdminStore } from '../../stores/useAdminStore';
import './ServiceManagementPage.scss';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ServiceManagementPage = () => {
  const {
    serviceList,
    loadingServices,
    isSubmitting,
    fetchServices,
    createService,
    updateService,
    toggleServiceStatus,
    deleteService,
  } = useAdminStore();

  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [form] = Form.useForm();

  // Load services on mount
  useEffect(() => {
    fetchServices({ keyword, status: statusFilter });
  }, []);

  const handleSearch = () => {
    fetchServices({ keyword, status: statusFilter });
  };

  const handleResetFilter = () => {
    setKeyword('');
    setStatusFilter('ALL');
    fetchServices({ keyword: '', status: 'ALL' });
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingService(null);
    form.resetFields();
    form.setFieldsValue({
      donGia: 100000,
      trangThai: true,
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (record) => {
    setEditingService(record);
    form.setFieldsValue({
      tenDichVu: record.tenDichVu,
      donGia: record.donGia,
      moTa: record.moTa || '',
      trangThai: record.trangThai,
    });
    setIsModalOpen(true);
  };

  // Submit Modal Form (Create / Update)
  const handleSubmitForm = async () => {
    try {
      const values = await form.validateFields();
      if (editingService) {
        // Update
        await updateService({
          maDichVu: editingService.maDichVu,
          tenDichVu: values.tenDichVu,
          donGia: values.donGia,
          moTa: values.moTa,
          trangThai: values.trangThai,
        });
      } else {
        // Create
        await createService({
          tenDichVu: values.tenDichVu,
          donGia: values.donGia,
          moTa: values.moTa,
        });
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch {
      // Form validation error
    }
  };

  // Toggle status
  const handleToggleStatus = async (record, checked) => {
    await toggleServiceStatus(record.maDichVu, checked);
  };

  // Delete service
  const handleDeleteService = async (record) => {
    await deleteService(record.maDichVu);
  };

  // Table Columns
  const columns = [
    {
      title: 'Mã Dịch Vụ',
      dataIndex: 'maDichVu',
      key: 'maDichVu',
      width: 130,
      render: (code) => (
        <Tag color="geekblue" style={{ fontWeight: 600, fontSize: 13, padding: '2px 8px' }}>
          {code}
        </Tag>
      ),
    },
    {
      title: 'Tên Dịch Vụ Khám / Kỹ Thuật',
      dataIndex: 'tenDichVu',
      key: 'tenDichVu',
      render: (text) => (
        <Text strong style={{ fontSize: 14, color: '#1f1f1f' }}>
          {text}
        </Text>
      ),
    },
    {
      title: 'Đơn Giá Viện Phí',
      dataIndex: 'donGia',
      key: 'donGia',
      width: 170,
      align: 'right',
      sorter: (a, b) => (Number(a.donGia) || 0) - (Number(b.donGia) || 0),
      render: (price) => (
        <Text strong style={{ color: '#0958d9', fontSize: 14 }}>
          {Number(price).toLocaleString('vi-VN')} ₫
        </Text>
      ),
    },
    {
      title: 'Mô Tả Chuyên Môn',
      dataIndex: 'moTa',
      key: 'moTa',
      ellipsis: true,
      render: (desc) =>
        desc ? (
          <Tooltip title={desc}>
            <Text type="secondary">{desc}</Text>
          </Tooltip>
        ) : (
          <Text type="secondary" italic>
            Chưa có ghi chú
          </Text>
        ),
    },
    {
      title: 'Lượt Chỉ Định',
      dataIndex: 'soLuotChiDinh',
      key: 'soLuotChiDinh',
      width: 130,
      align: 'center',
      sorter: (a, b) => (a.soLuotChiDinh || 0) - (b.soLuotChiDinh || 0),
      render: (count) => (
        <Badge
          count={count || 0}
          showZero
          overflowCount={9999}
          style={{
            backgroundColor: count > 0 ? '#13c2c2' : '#d9d9d9',
            fontWeight: 600,
          }}
        />
      ),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 150,
      align: 'center',
      render: (trangThai, record) => (
        <Switch
          checked={trangThai}
          onChange={(checked) => handleToggleStatus(record, checked)}
          checkedChildren="Áp dụng"
          unCheckedChildren="Tạm ngưng"
          style={{
            backgroundColor: trangThai ? '#52c41a' : '#bfbfbf',
          }}
        />
      ),
    },
    {
      title: 'Thao Tác',
      key: 'actions',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa dịch vụ">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: '#1677ff', fontSize: 16 }} />}
              onClick={() => handleOpenEditModal(record)}
            />
          </Tooltip>

          <Tooltip title="Xóa dịch vụ">
            <Popconfirm
              title="Xác nhận xóa dịch vụ"
              description={
                <div style={{ maxWidth: 280 }}>
                  Bạn có chắc chắn muốn xóa dịch vụ <strong>{record.maDichVu}</strong>?
                  <br />
                  <span style={{ fontSize: 12, color: '#8c8c8c' }}>
                    * Nếu dịch vụ đã có trong lịch sử bệnh án, hệ thống sẽ tự động chuyển sang trạng thái "Tạm ngưng" để đảm bảo toàn vẹn dữ liệu.
                  </span>
                </div>
              }
              onConfirm={() => handleDeleteService(record)}
              okText="Đồng ý"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined style={{ fontSize: 16 }} />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="service-management-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
            Quản Lý Danh Mục Dịch Vụ Khám & Cận Lâm Sàng
          </Title>
          <Paragraph type="secondary" style={{ margin: '4px 0 0 0' }}>
            Thiết lập bảng giá dịch vụ kỹ thuật, xét nghiệm, chẩn đoán hình ảnh và phân quyền áp dụng trong phòng khám.
          </Paragraph>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleOpenCreateModal}
          style={{
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(22, 119, 255, 0.25)',
          }}
        >
          Thêm Dịch Vụ Mới
        </Button>
      </div>

      {/* Main Table Card */}
      <Card bordered={false} className="table-card">
        {/* Filter Toolbar */}
        <div className="filter-toolbar">
          <Space wrap size="middle">
            <Input
              placeholder="Tìm theo mã, tên hoặc mô tả dịch vụ..."
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onPressEnter={handleSearch}
              allowClear
              style={{ width: 320 }}
            />

            <Select
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val);
                fetchServices({ keyword, status: val });
              }}
              style={{ width: 180 }}
            >
              <Option value="ALL">Tất cả trạng thái</Option>
              <Option value="ACTIVE">Đang áp dụng</Option>
              <Option value="INACTIVE">Tạm ngưng</Option>
            </Select>

            <Button type="primary" onClick={handleSearch} icon={<SearchOutlined />}>
              Tìm kiếm
            </Button>

            <Button onClick={handleResetFilter} icon={<ReloadOutlined />}>
              Làm mới
            </Button>
          </Space>
        </div>

        {/* Data Table */}
        <Table
          columns={columns}
          dataSource={serviceList}
          rowKey="maDichVu"
          loading={loadingServices}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50'],
            showTotal: (total) => `Tổng cộng ${total} dịch vụ`,
          }}
          locale={{ emptyText: 'Chưa có dịch vụ nào trong danh mục' }}
        />
      </Card>

      {/* Modal Thêm mới / Chỉnh sửa dịch vụ */}
      <Modal
        title={
          <Space>
            <MedicineBoxOutlined style={{ color: '#1677ff' }} />
            <span>
              {editingService
                ? `Chỉnh Sửa Dịch Vụ (${editingService.maDichVu})`
                : 'Thêm Dịch Vụ Khám & Kỹ Thuật Mới'}
            </span>
          </Space>
        }
        open={isModalOpen}
        onOk={handleSubmitForm}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isSubmitting}
        okText={editingService ? 'Lưu Thay Đổi' : 'Thêm Mới'}
        cancelText="Hủy Bỏ"
        width={560}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            label="Tên Dịch Vụ"
            name="tenDichVu"
            rules={[
              { required: true, message: 'Vui lòng nhập tên dịch vụ!' },
              { max: 150, message: 'Tên dịch vụ không được vượt quá 150 ký tự!' },
            ]}
          >
            <Input placeholder="Ví dụ: Siêu âm ổ bụng tổng quát, Nội soi dạ dày..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={14}>
              <Form.Item
                label="Đơn Giá Viện Phí (VND)"
                name="donGia"
                rules={[
                  { required: true, message: 'Vui lòng nhập đơn giá!' },
                  {
                    type: 'number',
                    min: 1000,
                    message: 'Đơn giá dịch vụ phải lớn hơn 0 (tối thiểu 1.000 ₫)!',
                  },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  min={1000}
                  step={10000}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                  addonAfter="₫"
                  placeholder="Ví dụ: 150,000"
                />
              </Form.Item>
            </Col>

            {editingService && (
              <Col span={10}>
                <Form.Item
                  label="Trạng Thái Áp Dụng"
                  name="trangThai"
                  valuePropName="checked"
                >
                  <Switch
                    checkedChildren="Áp dụng"
                    unCheckedChildren="Tạm ngưng"
                  />
                </Form.Item>
              </Col>
            )}
          </Row>

          <Form.Item
            label="Mô Tả / Chỉ Định Kỹ Thuật"
            name="moTa"
            rules={[{ max: 255, message: 'Mô tả không được vượt quá 255 ký tự!' }]}
          >
            <TextArea
              rows={3}
              placeholder="Ghi chú thêm về quy trình, điều kiện thực hiện dịch vụ..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ServiceManagementPage;
