import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '@/stores/auth'
import { isApiError } from '@/services/request'
import { App, Button, Card, Form, Input, Space, Typography } from 'antd'

export function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const { t } = useTranslation()
  const { message } = App.useApp()
  const [submitting, setSubmitting] = useState(false)

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e6f4ff 0%, #f5f5f5 100%)',
        padding: 16,
      }}
    >
      <Card style={{ width: 360 }} variant="outlined">
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Typography.Title level={3} style={{ margin: 0 }}>
            {t('login.title')}
          </Typography.Title>
          <Typography.Text type="secondary">{t('login.tip')}</Typography.Text>
        </Space>

        <Form
          layout="vertical"
          style={{ marginTop: 16 }}
          initialValues={{ username: 'admin', password: '123456' }}
          onFinish={async (values) => {
            try {
              setSubmitting(true)
              await login(values)
              message.success('登录成功')
              navigate('/dashboard', { replace: true })
            } catch (e) {
              const apiErr = isApiError(e) ? e : null
              if (apiErr?.code === 'invalid_credentials') {
                message.error('用户名或密码错误')
              } else {
                message.error(apiErr?.message || '登录失败')
              }
            } finally {
              setSubmitting(false)
            }
          }}
        >
          <Form.Item name="username" label={t('login.username')} rules={[{ required: true }]}>
            <Input autoComplete="username" />
          </Form.Item>
          <Form.Item name="password" label={t('login.password')} rules={[{ required: true }]}>
            <Input.Password autoComplete="current-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block loading={submitting}>
            {t('login.submit')}
          </Button>
        </Form>
      </Card>
    </div>
  )
}


