import React, { useCallback } from 'react'
import style from './Login.module.scss'
import { useNavigate } from 'react-router-dom'
import { Button, Form, Input, message } from 'antd'
import type { Container, Engine } from 'tsparticles-engine'
import Particles from 'react-particles'
import { loadFull } from 'tsparticles'
import userService from '../../apis/user'
import { store } from '../../redux/store'

type IProps = {
  children?: any
}

export default function Login(props: IProps) {
  const navigate = useNavigate()

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine)
  }, [])

  const particlesLoaded = useCallback(
    async (container: Container | undefined) => {
      await console.log(container)
    },
    []
  )

  const onLoginFinish = (values: any) => {
    const params = {
      username: values.username,
      password: values.password,
      roleState: true,
      _expand: 'role',
    }
    userService.toLogin(params).then((res: any) => {
      if (res.data.length === 0) {
        message.info('用户名或密码错误')
      } else {
        localStorage.setItem('token', JSON.stringify(res.data[0]))
        store.dispatch({
          type: 'change_userInfo',
          userInfo: res.data[0],
        })
        navigate('/')
      }
    })
  }

  return (
    <div className={style.login_page}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: 'rgb(35, 39, 65)',
            },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: 'push',
              },
              onHover: {
                enable: true,
                mode: 'repulse',
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: '#ffffff',
            },
            links: {
              color: '#ffffff',
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: 'none',
              enable: true,
              outModes: {
                default: 'bounce',
              },
              random: false,
              speed: 6,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: 'circle',
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }}
      />
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
