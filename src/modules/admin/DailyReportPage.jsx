import React, { useEffect } from 'react';
import { Card, Row, Col, Statistic, Button, Descriptions, Empty } from 'antd';
import {
  ReloadOutlined,
  DollarCircleOutlined,
  UsergroupAddOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { useAdminStore } from '../../stores/useAdminStore';
import PageHeader from '../../components/PageHeader';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

const DailyReportPage = () => {
  const { dailyReport, fetchDailyReport, isLoading } = useAdminStore();

  useEffect(() => {
    fetchDailyReport();
  }, [fetchDailyReport]);

  return (
    <div>
      <PageHeader
        title="Báo Cáo Hoạt Động & Doanh Thu Hôm Nay"
        subtitle="Tổng hợp số lượt khám và viện phí theo ngày thực tế (View v_doanh_thu_theo_ngay)"
        extra={
          <Button icon={<ReloadOutlined />} onClick={() => fetchDailyReport()} loading={isLoading}>
            Làm Mới
          </Button>
        }
      />

      {dailyReport ? (
        <>
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Tổng Doanh Thu Trong Ngày"
                  value={dailyReport.tongDoanhThu || 0}
                  precision={0}
                  styles={{ content: { color: '#0d9488', fontWeight: 700 } }}
                  prefix={<DollarCircleOutlined />}
                  formatter={(val) => formatCurrency(val)}
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Tổng Số Lượt Bệnh Nhân Đã Khám"
                  value={dailyReport.soLuotKham || 0}
                  styles={{ content: { color: '#0284c7', fontWeight: 700 } }}
                  prefix={<UsergroupAddOutlined />}
                  suffix="ca"
                />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic
                  title="Ngày Lập Báo Cáo"
                  value={formatDate(dailyReport.ngayKham || new Date())}
                  styles={{ content: { color: '#475569', fontWeight: 600 } }}
                  prefix={<CalendarOutlined />}
                />
              </Card>
            </Col>
          </Row>

          <Card title="Chi Tiết Thống Kê">
            <Descriptions bordered column={{ xs: 1, sm: 2 }}>
              <Descriptions.Item label="Ngày hạch toán">
                {formatDate(dailyReport.ngayKham)}
              </Descriptions.Item>
              <Descriptions.Item label="Lưu lượng khám thành công">
                <strong>{dailyReport.soLuotKham} lượt</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Doanh thu thực thu">
                <strong style={{ color: '#0d9488', fontSize: 16 }}>
                  {formatCurrency(dailyReport.tongDoanhThu)}
                </strong>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái chốt sổ">
                <span style={{ color: '#10b981', fontWeight: 600 }}>Đã cân đối tự động</span>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </>
      ) : (
        <Card style={{ textAlign: 'center', padding: '60px 0' }}>
          <Empty description="Hôm nay chưa có dữ liệu doanh thu phát sinh." />
        </Card>
      )}
    </div>
  );
};

export default DailyReportPage;
