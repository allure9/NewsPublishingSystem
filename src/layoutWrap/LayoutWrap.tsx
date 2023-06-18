import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import menuService from '../apis/menu'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
  UserOutlined,
} from '@ant-design/icons'
import {
  Layout,
  Menu,
  Button,
  theme,
  Dropdown,
  Space,
  Avatar,
  Spin,
} from 'antd'
import type { MenuProps } from 'antd'
import style from './LayoutWrap.module.scss'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { connect } from 'react-redux'

const { Header, Sider, Content } = Layout

type MenuItem = Required<MenuProps>['items'][number]

type IProps = {
  children?: any
  isCollapsed: boolean
  isLoading: boolean
  userInfo?: any
  changeCollapsed: () => any
}

type anyProps = {
  [propName: string]: any
}

function LayoutWrap(props: IProps) {
  const [menuList, setMenuList] = useState([])

  // 渲染开始
  NProgress.start()
  // 渲染结束开始发送请求时
  useEffect(() => {
    NProgress.done()
  })

  // 获取用户登录信息
  const userInfo: anyProps = JSON.parse(localStorage.getItem('token') as any)

  const dropdownMenu: MenuProps['items'] = [
    {
      label: userInfo.role.roleName,
      key: 'role',
    },
    {
      label: '退出登录',
      key: 'loginOut',
    },
  ]

  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const navigate = useNavigate()
  const location = useLocation()
  const selectKey = [location.pathname]
  const openKey = ['/' + location.pathname.split('/')[1]]

  const changeIsCollapsed = () => {
    props.changeCollapsed()
  }

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group'
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as MenuItem
  }

  function renderItem(arr: any) {
    return arr.map((s: any) => {
      if (
        s.children &&
        s.children.length > 0 &&
        s.pagepermisson &&
        userInfo.role.rights.includes(s.key)
      ) {
        return (
          s.pagepermisson === 1 &&
          getItem(s.title, s.key, s.icon, renderItem(s.children))
        )
      } else {
        return (
          userInfo.role.rights.includes(s.key) &&
          s.pagepermisson === 1 &&
          getItem(s.title, s.key, s.icon)
        )
      }
    })
  }
  // 获取路由列表
  useEffect(() => {
    const params = {
      _embed: 'children',
    }
    menuService.getMenus(params).then((res) => {
      res.data.forEach((s: any) => {
        if (s.children && s.children.length > 0) {
          s.children.forEach((c: any) => {
            c.icon = <AppstoreOutlined />
          })
        }
      })
      setMenuList(renderItem(res.data))
    })
  }, [])

  // 菜单项选中
  const onMenuSelect = (e: any) => {
    navigate(e.key)
  }
  // 下拉菜单选中
  const onDrodownClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'loginOut') {
      navigate('/login')
      localStorage.removeItem('token')
    }
  }

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
        <div className={style.nav_title}>新闻管理系统</div>
        <Menu
          defaultSelectedKeys={selectKey}
          defaultOpenKeys={openKey}
          mode="inline"
          theme="dark"
          onSelect={(e) => {
            onMenuSelect(e)
          }}
          items={menuList}
        />
      </Sider>
      <Layout>
        <Header
          className={style.header_wrap}
          style={{ padding: 0, background: colorBgContainer }}
        >
          <Button
            type="text"
            icon={
              props.isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
            }
            onClick={() => changeIsCollapsed()}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <Dropdown
            className={style.login_wrap}
            menu={{ items: dropdownMenu, onClick: onDrodownClick }}
          >
            <Space>
              <div>
                <span>欢迎</span>
                <span style={{ color: 'green' }}>
                  {userInfo.username as string}
                </span>
                <span>回来</span>
              </div>
              <Avatar size={32} icon={<UserOutlined />} />
            </Space>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            overflow: 'auto',
          }}
        >
          <Spin size="large" spinning={props.isLoading}>
            {props.children}
          </Spin>
        </Content>
      </Layout>
    </Layout>
  )
}

const mapStateToProps = (state: any) => {
  return {
    isCollapsed: state.collaspesdReducer.isCollapsed,
    isLoading: state.loadingReducer.isLoading,
    userInfo: state.userInfoReducer.userInfo,
  }
}

const mapDispatchToProps = {
  changeCollapsed() {
    return {
      type: 'change_collasped',
    }
  },
}

export default connect(mapStateToProps, mapDispatchToProps)(LayoutWrap)
