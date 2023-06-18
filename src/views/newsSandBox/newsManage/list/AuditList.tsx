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
  publishTime?: string | number
}

export default function AuditList() {
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
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => {
        const auditStateMap = ['草稿箱', '审核中', '已通过', '未通过']
        const colorMap = ['', 'orange', 'green', 'red']
        return (
          <Tag color={colorMap[Number(auditState)]}>
            {auditStateMap[Number(auditState)]}
          </Tag>
        )
      },
    },
    {
      title: '操作',
      render: (item) => (
        <div>
          {
            // 正在审核的话可以将其撤销至草稿箱
            Number(item.auditState) === 1 && (
              <Button onClick={() => handleRervert(item)}>撤销</Button>
            )
          }
          {
            //已通过的话可以将其发布
            Number(item.auditState) === 2 && (
              <Button danger onClick={() => handlePublish(item)}>
                发布
              </Button>
            )
          }
          {
            //未通过的话，可以重新更新新闻
            Number(item.auditState) === 3 && (
              <Button type="primary" onClick={() => handleUpdate(item)}>
                更新
              </Button>
            )
          }
        </div>
      ),
    },
  ]

  useEffect(() => {
    const params = {
      author: userInfo.username,
      auditState_ne: 0,
      publishState_lte: 1,
      _expand: 'category',
    }
    newsService.getAuditList(params).then((res) => {
      console.log(res.data)
      setList(res.data)
    })
  }, [userInfo.username])

  // 撤销
  const handleRervert = (item: RoleObjType) => {
    const data: IAddNews = {
      auditState: 0,
    }
    newsService.updateNews(item.id, data).then((res) => {
      setList(list.filter((s: any) => s.id !== item.id))
      notification.info({
        message: `通知`,
        description: `您可以到草稿箱中查看您的新闻`,
        // 位置
        placement: 'bottomRight',
      })
    })
  }
  // 发布
  const handlePublish = (item: RoleObjType) => {
    const data: IAddNews = {
      publishState: 2,
      publishTime: Date.now(),
    }
    newsService.updateNews(item.id, data).then((res) => {
      navigate(`/publish-manage/published`)
      notification.info({
        message: `通知`,
        description: `您可以到[发布管理/已经发布]中查看您的新闻`,
        // 位置
        placement: 'bottomRight',
      })
    })
  }
  // 更新
  const handleUpdate = (item: RoleObjType) => {
    navigate(`/news-manage/update/${item.id}`)
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
