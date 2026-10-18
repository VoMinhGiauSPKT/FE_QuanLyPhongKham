import React, { useEffect } from 'react';
import { Card, Table, Button, Tag } from 'antd';
import { ReloadOutlined, TrophyOutlined } from '@ant-design/icons';
import { useAdminStore } from '../../stores/useAdminStore';
import PageHeader from '../../components/PageHeader';
import { formatCurrency } from '../../utils/formatCurrency';

const DoctorProductivityPage = () => {
  const { doctorProductivity, fetchDoctorProductivity, isLoading } = useAdminStore();

  useEffect(() => {
    fetchDoctorProductivity();
  }, [fetchDoctorProductivity]);

  const columns = [
    {
      title: 'Hạng',
      key: 'rank',
      width: 80,
      align: 'center',
      render: (_, __, index) => (
        <Tag
          color={index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : 'default'}
          style={{ fontWeight: 700 }}
        >
          {index === 0 ? '🥇 #1' : index === 1 ? '🥈 #2' : index === 2 ? '🥉 #3' : `#${index + 1}`}
        </Tag>
      ),
    },
    {
      title: 'Mã Bác Sĩ',
      dataIndex: 'maBacSi',
      key: 'maBacSi',
      width: 120,
      render: (t) => <strong>{t}</strong>,
    },
    {
      title: 'Họ Tên Bác Sĩ',
      dataIndex: 'tenBacSi',
      key: 'tenBacSi',
    },
    {
      title: 'Chuyên Khoa',
      dataIndex: 'chuyenKhoa',
      key: 'chuyenKhoa',
      render: (v) => <Tag color="blue">{v || 'Nội tổng quát'}</Tag>,
    },
    {
      title: 'Phòng Khám',
      dataIndex: 'phongKham',
      key: 'phongKham',
      width: 120,
    },
    {
      title: 'Số Ca Khám Đã Hoàn Tất',
      dataIndex: 'soCaKham',
      key: 'soCaKham',
      align: 'center',
      width: 180,
      render: (count) => (
        <span style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
          {count || 0} ca
        </span>
      ),
    },
    {
      title: 'Tổng Giá Trị Khám & Kê Đơn',
      dataIndex: 'tongTienKham',
      key: 'tongTienKham',
      width: 200,
      render: (val, r) => (
        <strong style={{ color: '#0d9488' }}>
          {formatCurrency(val || r.tongDoanhThu || 0)}
        </strong>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Báo Cáo Năng Suất Bác Sĩ"
        subtitle="Đánh giá hiệu suất và số lượt bệnh nhân hoàn tất của từng bác sĩ điều trị"
        extra={
          <Button
            icon={<ReloadOutlined />}
            onClick={() => fetchDoctorProductivity()}
            loading={isLoading}
          >
            Làm Mới
          </Button>
        }
      />

      <Card>
        <Table
          dataSource={doctorProductivity}
          columns={columns}
          rowKey="maBacSi"
          loading={isLoading}
          pagination={false}
          locale={{ emptyText: 'Chưa có dữ liệu thống kê năng suất bác sĩ.' }}
        />
      </Card>
    </div>
  );
};

export default DoctorProductivityPage;
