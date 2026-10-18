import React from 'react';
import { Card, Form, Input, DatePicker, Select, Button, Row, Col, Typography } from 'antd';
import { UserAddOutlined, SaveOutlined } from '@ant-design/icons';
import { useReceptionistStore } from '../../stores/useReceptionistStore';
import PageHeader from '../../components/PageHeader';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const AdmissionPage = () => {
  const [form] = Form.useForm();
  const { admitPatient, isSubmitting } = useReceptionistStore();

  const handleFinish = async (values) => {
    try {
      const payload = {
        hoTen: values.hoTen.trim(),
        ngaySinh: values.ngaySinh.format('YYYY-MM-DD'),
        gioiTinh: values.gioiTinh,
        soDienThoai: values.soDienThoai.trim(),
        maBacSi: values.maBacSi,
        thoiGianHen: values.thoiGianHen.format('YYYY-MM-DD HH:mm:ss'),
      };
      await admitPatient(payload);
      form.resetFields();
      form.setFieldsValue({
        gioiTinh: 'Nam',
        maBacSi: 'BS001',
        thoiGianHen: dayjs(),
      });
    } catch {
      // Handled in store/axios
    }
  };

  return (
    <div>
      <PageHeader
        title="Tiếp Nhận Ca Khám Bệnh Mới"
        subtitle="Đăng ký hồ sơ bệnh nhân, phát số thứ tự tự động và điều phối phòng khám"
      />

      <Card style={{ maxWidth: 800, margin: '0 auto' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            gioiTinh: 'Nam',
            maBacSi: 'BS001',
            thoiGianHen: dayjs(),
          }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={16}>
              <Form.Item
                name="hoTen"
                label="Họ và Tên bệnh nhân"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên bệnh nhân!' }]}
              >
                <Input placeholder="Ví dụ: Nguyễn Văn An" size="large" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item
                name="gioiTinh"
                label="Giới tính"
                rules={[{ required: true, message: 'Chọn giới tính!' }]}
              >
                <Select size="large">
                  <Select.Option value="Nam">Nam</Select.Option>
                  <Select.Option value="Nữ">Nữ</Select.Option>
                  <Select.Option value="Khác">Khác</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="ngaySinh"
                label="Ngày tháng năm sinh"
                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  size="large"
                  format="DD/MM/YYYY"
                  placeholder="Chọn ngày sinh"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="soDienThoai"
                label="Số điện thoại liên hệ"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại!' },
                  { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải gồm 10 chữ số!' },
                ]}
              >
                <Input placeholder="Ví dụ: 0912345678" size="large" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="maBacSi"
                label="Bác sĩ phụ trách / Phòng khám"
                rules={[{ required: true, message: 'Vui lòng chọn bác sĩ phụ trách!' }]}
              >
                <Select size="large">
                  <Select.Option value="BS001">BS. Nguyễn Văn A (Phòng 101 - Nội tổng quát)</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="thoiGianHen"
                label="Thời gian đăng ký khám"
                rules={[{ required: true, message: 'Chọn thời gian khám!' }]}
              >
                <DatePicker
                  showTime
                  style={{ width: '100%' }}
                  size="large"
                  format="DD/MM/YYYY HH:mm"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: 20 }}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              size="large"
              loading={isSubmitting}
              style={{ backgroundColor: '#0d9488', minWidth: 160 }}
            >
              Tiếp Nhận & Cấp STT
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdmissionPage;
