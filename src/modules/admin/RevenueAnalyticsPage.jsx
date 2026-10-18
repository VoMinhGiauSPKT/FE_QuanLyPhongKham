import React, { useEffect, useState } from 'react';
import { Card, Table, DatePicker, Button, Flex, Space, Typography } from 'antd';
import { SearchOutlined, BarChartOutlined } from '@ant-design/icons';
import { useAdminStore } from '../../stores/useAdminStore';
import PageHeader from '../../components/PageHeader';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Text } = Typography;

const RevenueAnalyticsPage = () => {
  const { dateRangeRevenue, fetchDateRangeRevenue, isLoading } = useAdminStore();
  const [dates, setDates] = useState([
    dayjs().subtract(30, 'day'),
    dayjs().add(1, 'day'),
  ]);

  const loadData = (range) => {
    if (!range || range.length < 2) return;
    const [from, to] = range;
    fetchDateRangeRevenue(from.format('YYYY-MM-DD'), to.format('YYYY-MM-DD'));
  };

  useEffect(() => {
    loadData(dates);
  }, []);

  const totalSum = dateRangeRevenue.reduce(
    (acc, curr) => acc + (Number(curr.tongTienThu) || Number(curr.tongDoanhThu) || 0),
    0
  );
  const totalVisits = dateRangeRevenue.reduce(
    (acc, curr) => acc + (Number(curr.soLuotKham) || 0),
    0
  );

  const columns = [
    {
      title: 'Ngày Khám',
      dataIndex: 'ngayKham',
      key: 'ngayKham',
      render: (v) => <strong>{formatDate(v)}</strong>,
    },
    {
      title: 'Số Lượt Khám',
      dataIndex: 'soLuotKham',
      key: 'soLuotKham',
      align: 'center',
      render: (v) => <span>{v} lượt</span>,
    },
    {
      title: 'Tổng Doanh Thu',
      dataIndex: 'tongTienThu',
      key: 'tongTienThu',
      render: (v, r) => (
        <span style={{ color: '#0d9488', fontWeight: 600 }}>
          {formatCurrency(v || r.tongDoanhThu || 0)}
        </span>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Thống Kê Doanh Thu Theo Khoảng Ngày"
        subtitle="Tra cứu lưu lượng khám và doanh thu theo dải thời gian (Stored Procedure sp_thong_ke_doanh_thu_khoang_ngay)"
      />

      <Card style={{ marginBottom: 20 }}>
        <Flex gap="middle" align="center" wrap="wrap">
          <Text strong>Chọn khoảng ngày:</Text>
          <RangePicker
            size="large"
            value={dates}
            onChange={(val) => setDates(val)}
            format="DD/MM/YYYY"
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            size="large"
            style={{ backgroundColor: '#0d9488' }}
            onClick={() => loadData(dates)}
            loading={isLoading}
          >
            Tra Cứu Báo Cáo
          </Button>
        </Flex>
      </Card>

      <Card
        title={
          <Flex justify="space-between" align="center">
            <span>Bảng Kê Chi Tiết Theo Ngày</span>
            <Space size="large">
              <Text type="secondary">
                Tổng lượt khám: <strong>{totalVisits}</strong>
              </Text>
              <Text type="secondary">
                Tổng doanh thu kỳ này:{' '}
                <strong style={{ color: '#0d9488', fontSize: 16 }}>
                  {formatCurrency(totalSum)}
                </strong>
              </Text>
            </Space>
          </Flex>
        }
      >
        <Table
          dataSource={dateRangeRevenue}
          columns={columns}
          rowKey={(r) => `${r.ngayGiaoDich || r.ngayKham || 'row'}_${r.hinhThucThanhToan || ''}`}
          loading={isLoading}
          pagination={{ pageSize: 15 }}
          locale={{ emptyText: 'Không tìm thấy dữ liệu phát sinh trong khoảng ngày này.' }}
        />
      </Card>
    </div>
  );
};

export default RevenueAnalyticsPage;
