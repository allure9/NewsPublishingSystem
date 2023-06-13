import React, { useState, useEffect } from 'react'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import menuService from '../../../../apis/menu'

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
}

type IProps = {
  children?: any
}

export default function Right(props: IProps) {
  const [list, SetList] = useState([])

  const columns: ColumnsType<DataType> = [
    { title: 'ID', dataIndex: 'id', key: 'id', render: (id) => <b>{id}</b> },
    {
      title: '权限名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      key: 'key',
      render: (x) => <Tag color="orange">{x}</Tag>,
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
              deleteRight(x)
            }}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => {
              editRight(x)
            }}
          ></Button>
        </div>
      ),
    },
  ]

  // 获取列表
  useEffect(() => {
    const params = {
      _embed: 'children',
    }
    menuService.getMenus(params).then((res: any) => {
      res.data.forEach((i: any) => {
        if (i.children && i.children.length === 0) {
          delete i.children
        }
      })
      SetList(res.data)
      console.log(res)
    })
  }, [])
  // 删除
  const deleteRight = (x: RoleObjType) => {
    console.log('删除', x)
  }
  // 编辑
  const editRight = (x: RoleObjType) => {
    console.log('编辑', x)
  }
  return (
    <div>
      <Table columns={columns} dataSource={list} pagination={{ pageSize: 5 }} />
    </div>
  )
}
