import React, { useEffect } from 'react';
import { Card, Table, Button, Alert } from 'antd';
import { ReloadOutlined, AlertOutlined } from '@ant-design/icons';
import { usePharmacyStore } from '../../stores/usePharmacyStore';
import PageHeader from '../../components/PageHeader';
import StatusTag from '../../components/StatusTag';
import { formatDate } from '../../utils/formatDate';

const DrugAlertPage = () => {
  const { alertList, fetchAlerts, isLoading } = usePharmacyStore();

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const columns = [
    {
      title: 'Mã Thuốc',
      dataIndex: 'maThuoc',
      key: 'maThuoc',
      width: 100,
      render: (t) => <strong>{t}</strong>,
    },
    {
      title: 'Tên Thuốc',
      dataIndex: 'tenThuoc',
      key: 'tenThuoc',
    },
    {
      title: 'ĐVT',
      dataIndex: 'donViTinh',
      key: 'donViTinh',
      width: 80,
      align: 'center',
    },
    {
      title: 'Số Lượng Tồn',
      dataIndex: 'soLuongTon',
      key: 'soLuongTon',
      width: 120,
      align: 'center',
      render: (qty) => (
        <span style={{ color: qty < 20 ? '#ef4444' : '#0f172a', fontWeight: 700 }}>
          {qty}
        </span>
      ),
    },
    {
      title: 'Hạn Sử Dụng',
      dataIndex: 'hanSuDung',
      key: 'hanSuDung',
      width: 130,
      render: (val) => formatDate(val),
    },
    {
      title: 'Số Ngày Còn Hạn',
      dataIndex: 'soNgayConHan',
      key: 'soNgayConHan',
      width: 140,
      align: 'center',
      render: (days) => (
        <span style={{ fontWeight: 600, color: days < 30 ? '#ef4444' : '#f59e0b' }}>
          {days !== null ? `${days} ngày` : 'N/A'}
        </span>
      ),
    },
    {
      title: 'Cảnh Báo Rủi Ro',
      dataIndex: 'trangThaiCanhBao',
      key: 'trangThaiCanhBao',
      width: 180,
      render: (status) => <StatusTag status={status} />,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Cảnh Báo Tồn Kho & Cận Hạn"
        subtitle="Danh sách thuốc sắp hết hạn sử dụng (< 30 ngày) hoặc tồn kho ở mức báo động (< 20) (View v_canh_bao_ton_kho_thuoc)"
        extra={
          <Button icon={<ReloadOutlined />} onClick={() => fetchAlerts()} loading={isLoading}>
            Làm Mới
          </Button>
        }
      />

      <Alert
        title="Hệ thống giám sát chất lượng dược phẩm"
        description="Thuốc quá hạn hoặc hết hàng sẽ tự động bị SQL Server chặn kê đơn thông qua Trigger trg_kiem_tra_han_thuoc. Vui lòng kịp thời liên hệ nhà cung ứng để nhập hàng hoặc hủy thuốc hỏng."
        type="warning"
        showIcon
        style={{ marginBottom: 20 }}
      />

      <Card>
        <Table
          dataSource={alertList}
          columns={columns}
          rowKey="maThuoc"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: 'Hiện không có loại thuốc nào trong diện cảnh báo.' }}
        />
      </Card>
    </div>
  );
};

export default DrugAlertPage;
