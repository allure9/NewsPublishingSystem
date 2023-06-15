import React from 'react'
import style from './Login.module.scss'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Input } from 'antd'

type IProps = {
  children?: any
}

export default function Login(props: IProps) {
  const navigate = useNavigate()
  const onLoginFinish = (values: any) => {
    if (values.username === 'admin' && values.password === '123') {
      navigate('/home')
    }
  }

  return (
    <div className={style.login_page}>
      <div className={style.login_form_warp}>
        <div className={style.login_form_title}>全球新闻发布管理系统</div>
        <Form
          className={style.login_form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          onFinish={onLoginFinish}
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
