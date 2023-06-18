import React from 'react'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'

interface DataType {
  key: React.Key
  name: string
  age: number
  address: string
  children?: DataType[]
  id?: any
}

type IProps = {
  children?: any
  list?: []
  button?: any
}

export default function NewsPublished(props: IProps) {
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
      render: (item) => {
        return <div>{item.title}</div>
      },
    },
    {
      title: '操作',
      render: (x) => <div>{props.button(x.id)}</div>,
    },
  ]

  return (
    <div>
      <Table
        columns={columns}
        dataSource={props.list}
        pagination={{ pageSize: 5 }}
        rowKey={(item) => item.id}
      />
    </div>
  )
}
