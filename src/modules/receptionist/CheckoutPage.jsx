import React from 'react';
import { Card, Form, Input, InputNumber, Select, Button, Row, Col, Alert } from 'antd';
import { DollarCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useReceptionistStore } from '../../stores/useReceptionistStore';
import PageHeader from '../../components/PageHeader';

const CheckoutPage = () => {
  const [form] = Form.useForm();
  const { checkoutInvoice, isSubmitting } = useReceptionistStore();

  const handleFinish = async (values) => {
    try {
      await checkoutInvoice({
        maHoSo: values.maHoSo.trim(),
        tienGiamGia: values.tienGiamGia || 0,
        hinhThucThanhToan: values.hinhThucThanhToan,
      });
      form.resetFields();
      form.setFieldsValue({
        tienGiamGia: 0,
        hinhThucThanhToan: 'Tiền mặt',
      });
    } catch {
      // Handled
    }
  };

  return (
    <div>
      <PageHeader
        title="Thanh Toán Viện Phí & Xuất Hóa Đơn"
        subtitle="Quyết toán chi phí khám bệnh, chỉ định cận lâm sàng và tiền thuốc (Stored Procedure sp_gd_thanh_toan_hoa_don)"
      />

      <Row gutter={24} justify="center">
        <Col xs={24} md={16} lg={12}>
          <Card>
            <Alert
              message="Quy trình chốt viện phí bảo mật"
              description="Hóa đơn sẽ tự động tổng hợp tiền khám, tiền thuốc và tiền dịch vụ kỹ thuật. Khi xác nhận, hệ thống tự động khóa hồ sơ khám và phát hành hóa đơn chính thức."
              type="info"
              showIcon
              style={{ marginBottom: 20 }}
            />

            <Form
              form={form}
              layout="vertical"
              onFinish={handleFinish}
              initialValues={{
                maHoSo: 'HS001',
                tienGiamGia: 0,
                hinhThucThanhToan: 'Tiền mặt',
              }}
            >
              <Form.Item
                name="maHoSo"
                label="Mã hồ sơ khám bệnh"
                rules={[{ required: true, message: 'Vui lòng nhập mã hồ sơ khám (ví dụ: HS001)!' }]}
              >
                <Input
                  placeholder="Ví dụ: HS001"
                  size="large"
                  style={{ textTransform: 'uppercase' }}
                />
              </Form.Item>

              <Form.Item
                name="tienGiamGia"
                label="Số tiền giảm giá / Miễn giảm (VND)"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  size="large"
                  min={0}
                  step={10000}
                  formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={(val) => val.replace(/\$\s?|(,*)/g, '')}
                  placeholder="0"
                />
              </Form.Item>

              <Form.Item
                name="hinhThucThanhToan"
                label="Hình thức thanh toán"
                rules={[{ required: true, message: 'Chọn hình thức thanh toán!' }]}
              >
                <Select size="large">
                  <Select.Option value="Tiền mặt">💵 Tiền mặt</Select.Option>
                  <Select.Option value="Chuyển khoản">💳 Chuyển khoản ngân hàng (QR)</Select.Option>
                  <Select.Option value="Thẻ tín dụng / Ghi nợ">🏧 Thẻ POS</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item style={{ marginTop: 24 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  icon={<DollarCircleOutlined />}
                  loading={isSubmitting}
                  style={{ backgroundColor: '#0d9488', height: 44, fontWeight: 600 }}
                >
                  Xác Nhận & Xuất Hóa Đơn
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CheckoutPage;
