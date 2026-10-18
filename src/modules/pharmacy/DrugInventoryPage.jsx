import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Modal, Form, Input, InputNumber, Tag, Space, Typography } from 'antd';
import { ReloadOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { usePharmacyStore } from '../../stores/usePharmacyStore';
import PageHeader from '../../components/PageHeader';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const DrugInventoryPage = () => {
  const [form] = Form.useForm();
  const { drugPage, fetchInventory, restockDrug, isLoading, isSubmitting } = usePharmacyStore();
  const [restockModalVisible, setRestockModalVisible] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState(null);

  useEffect(() => {
    fetchInventory(1, 10);
  }, [fetchInventory]);

  const handleOpenRestock = (record) => {
    setSelectedDrug(record);
    form.setFieldsValue({
      maThuoc: record.maThuoc,
      tenThuoc: record.tenThuoc,
      soLuongNhap: 50,
    });
    setRestockModalVisible(true);
  };

  const handleConfirmRestock = async (values) => {
    try {
      await restockDrug(values.maThuoc, values.soLuongNhap);
      setRestockModalVisible(false);
      setSelectedDrug(null);
    } catch {
      // Handled
    }
  };

  const columns = [
    {
      title: 'Mã Thuốc',
      dataIndex: 'maThuoc',
      key: 'maThuoc',
      width: 100,
      render: (t) => <strong>{t}</strong>,
    },
    {
      title: 'Tên Thuốc & Hoạt Chất',
      dataIndex: 'tenThuoc',
      key: 'tenThuoc',
    },
    {
      title: 'Đơn Vị Tính',
      dataIndex: 'donViTinh',
      key: 'donViTinh',
      width: 100,
      align: 'center',
    },
    {
      title: 'Số Lượng Tồn',
      dataIndex: 'soLuongTon',
      key: 'soLuongTon',
      width: 120,
      align: 'center',
      render: (qty) => (
        <Tag color={qty > 30 ? 'green' : qty > 0 ? 'orange' : 'red'} style={{ fontWeight: 600 }}>
          {qty}
        </Tag>
      ),
    },
    {
      title: 'Đơn Giá',
      dataIndex: 'donGia',
      key: 'donGia',
      width: 130,
      render: (price) => formatCurrency(price),
    },
    {
      title: 'Hạn Sử Dụng',
      dataIndex: 'hanSuDung',
      key: 'hanSuDung',
      width: 130,
      render: (val) => formatDate(val),
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      width: 120,
      render: (status) => (
        <Tag color={status ? 'blue' : 'default'}>
          {status ? 'Đang kinh doanh' : 'Ngừng kinh doanh'}
        </Tag>
      ),
    },
    {
      title: 'Hành Động',
      key: 'act',
      width: 110,
      align: 'center',
      render: (_, record) => (
        <Button
          size="small"
          type="primary"
          icon={<PlusCircleOutlined />}
          style={{ backgroundColor: '#0d9488' }}
          onClick={() => handleOpenRestock(record)}
        >
          Nhập Kho
        </Button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Danh Mục Kho Thuốc"
        subtitle="Quản lý tồn kho dược phẩm có phân trang (View & Table thuoc)"
        extra={
          <Button
            icon={<ReloadOutlined />}
            onClick={() => fetchInventory(drugPage.page, drugPage.size)}
            loading={isLoading}
          >
            Làm Mới
          </Button>
        }
      />

      <Card>
        <Table
          dataSource={drugPage.items}
          columns={columns}
          rowKey="maThuoc"
          loading={isLoading}
          pagination={{
            current: drugPage.page,
            pageSize: drugPage.size,
            total: drugPage.totalElements,
            showSizeChanger: true,
            onChange: (p, s) => fetchInventory(p, s),
            showTotal: (total, range) => `${range[0]}-${range[1]} trong tổng số ${total} loại thuốc`,
          }}
          locale={{ emptyText: 'Kho hiện chưa có dữ liệu thuốc.' }}
        />
      </Card>

      <Modal
        title={`Nhập Thêm Số Lượng Kho - ${selectedDrug?.tenThuoc || ''}`}
        open={restockModalVisible}
        onCancel={() => setRestockModalVisible(false)}
        onOk={() => form.submit()}
        confirmLoading={isSubmitting}
        okText="Xác Nhận Nhập Kho"
      >
        <Form form={form} layout="vertical" onFinish={handleConfirmRestock}>
          <Form.Item name="maThuoc" label="Mã thuốc" rules={[{ required: true }]}>
            <Input disabled />
          </Form.Item>
          <Form.Item name="tenThuoc" label="Tên thuốc">
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="soLuongNhap"
            label="Số lượng nhập thêm"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng!' }]}
            initialValue={50}
          >
            <InputNumber min={1} max={10000} style={{ width: '100%' }} size="large" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DrugInventoryPage;
