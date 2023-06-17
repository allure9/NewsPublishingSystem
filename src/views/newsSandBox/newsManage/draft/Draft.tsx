import React, { useState, useEffect } from 'react'
import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons'
import { Button, Table, Modal, notification } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import newsService from '../../../../apis/news'
import { useNavigate } from 'react-router-dom'

interface DataType {
  key: React.Key
  name: string
  age: number
  address: string
  children?: DataType[]
}

interface RoleObjType {
  grade: number
  id: number
  key: string
  pagepermisson: number
  title: string
  rightId?: number
}

type IProps = {
  children?: any
}

type anyProps = {
  [propName: string]: any
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

const { confirm } = Modal

export default function Draft(props: IProps) {
  const [list, SetList] = useState([] as any[])

  const navigate = useNavigate()
  // 获取用户登录信息
  const userInfo: anyProps = JSON.parse(localStorage.getItem('token') as any)

  const columns: ColumnsType<DataType> = [
    { title: 'ID', dataIndex: 'id', key: 'id', render: (id) => <b>{id}</b> },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item: any) => {
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
      render: (x) => x.title,
    },
    {
      title: '操作',
      render: (x) => (
        <div>
          <Button
            style={{ marginRight: '8px' }}
            danger
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={() => {
              showDeleteModal(x)
            }}
          />
          <Button
            style={{ marginRight: '8px' }}
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => {
              updateNews(x)
            }}
          ></Button>
          <Button
            type="primary"
            shape="circle"
            icon={<UploadOutlined />}
            onClick={() => {
              checkNews(x)
            }}
          ></Button>
        </div>
      ),
    },
  ]

  // 获取列表
  useEffect(() => {
    const params = {
      author: userInfo.username,
      auditState: 0,
      _expand: 'category',
    }
    newsService.getNews(params).then((res: any) => {
      SetList(res.data)
      console.log(res)
    })
  }, [userInfo.username])
  // 删除对话框
  const showDeleteModal = (x: RoleObjType) => {
    confirm({
      title: '确定要删除吗?',
      cancelText: '取消',
      okText: '确定',
      onOk() {
        deleteNews(x)
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }
  // 删除
  const deleteNews = (x: RoleObjType) => {
    newsService.deleteNews(x.id).then((res) => {
      SetList(list.filter((s) => s.id !== x.id))
    })
  }
  // 更新
  const updateNews = (x: RoleObjType) => {
    navigate(`/news-manage/update/${x.id}`)
  }
  // 提交审核
  const checkNews = (x: RoleObjType) => {
    const data: IAddNews = {
      auditState: 1,
    }
    newsService.updateNews(x.id, data).then((res) => {
      // 传0表示跳转至草稿箱列表，传1表示跳转到审核列表
      navigate('/audit-manage/list')
      notification.info({
        message: `通知`,
        description: `您可以到审核列表中查看您的新闻`,
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
