import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Table, Tag, notification } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import newsService from '../../../../apis/news'

interface DataType {
  id?: any
  key: React.Key
  name: string
  age: number
  address: string
  children?: DataType[]
}

type anyProps = {
  [propName: string]: any
}

interface RoleObjType {
  roleType: number
  id: number
  roleName: string
  rights?: []
}

type IAddNews = {
  categoryId?: string | number
  title?: string
  content?: string
  region?: string
  author?: string
  roleId?: string | number
  auditState?: number
  publishState?: number
  createTime?: string | number
  star?: number
  view?: number
}

export default function Audit() {
  const [list, setList] = useState([])

  const navigate = useNavigate()
  // 获取用户登录信息
  const userInfo: anyProps = JSON.parse(localStorage.getItem('token') as any)

  const columns: ColumnsType<DataType> = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <a href={`/news-manage/preview/${item.id}`}>{title}</a>
      },
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => {
        return <div>{category.title}</div>
      },
    },
    {
      title: '操作',
      render: (item) => (
        <div>
          <Button
            type="primary"
            style={{ marginRight: '8px' }}
            onClick={() => handleAudit(item, 2, 1)}
          >
            更新
          </Button>
          <Button danger onClick={() => handleAudit(item, 3, 0)}>
            驳回
          </Button>
        </div>
      ),
    },
  ]

  useEffect(() => {
    const roleObj: anyProps = {
      1: 'superadmin',
      2: 'admin',
      3: 'editor',
    }
    const params = {
      auditState: 1,
      _expand: 'category',
    }
    newsService.getNews(params).then((res) => {
      setList(
        roleObj[userInfo.roleId] === 'superadmin'
          ? res.data
          : [
              ...res.data.filter((s: any) => {
                s.username === userInfo.username
              }),
              ...res.data.filter((s: any) => {
                s.region === userInfo.region && roleObj[s.roleId] === 'editor'
              }),
            ]
      )
      console.log(res.data)
      setList(res.data)
    })
  }, [userInfo.roleId, userInfo.username, userInfo.region])

  const handleAudit = (
    item: RoleObjType,
    auditState: number,
    publishState: number
  ) => {
    const data: IAddNews = {
      auditState,
      publishState,
    }
    newsService.updateNews(item.id, data).then((res) => {
      setList(list.filter((s: any) => s.id !== item.id))
      notification.info({
        message: `通知`,
        description: `您可以到[审核管理/审核列表]中查看您的新闻审核状态`,
        // 位置
        placement: 'bottomRight',
      })
    })
  }
  return (
    <div>
      <Table
        columns={columns}
        dataSource={list}
        pagination={{ pageSize: 5 }}
        rowKey={(item) => item.id}
      />
    </div>
  )
}
