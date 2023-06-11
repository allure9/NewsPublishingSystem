import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import menuService from '../apis/menu'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
  ContainerOutlined,
  DesktopOutlined,
  MailOutlined,
  PieChartOutlined,
} from '@ant-design/icons'
import { Layout, Menu, Button, theme } from 'antd'
import type { MenuProps } from 'antd'
import style from './LayoutWrap.module.scss'

const { Header, Sider, Content } = Layout

type MenuItem = Required<MenuProps>['items'][number]

type IProps = {
  children?: any
}

export default function LayoutWrap(props: IProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [menuList, setMenuList] = useState([])

  const {
    token: { colorBgContainer },
  } = theme.useToken()

  const navigate = useNavigate()
  const location = useLocation()
  const selectKey = [location.pathname]
  const openKey = ['/' + location.pathname.split('/')[1]]

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
      if (s.children && s.children.length > 0) {
        return getItem(s.title, s.key, s.icon, renderItem(s.children))
      } else {
        return getItem(s.title, s.key, s.icon)
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
  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
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
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          {props.children}
        </Content>
      </Layout>
    </Layout>
  )
}
