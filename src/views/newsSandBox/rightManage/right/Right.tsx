import React, { useState, useEffect } from 'react'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Table, Tag, Modal, Popover, Switch } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { ActionType } from '@rc-component/trigger/lib/interface'
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
  rightId?: number
}

type IProps = {
  children?: any
}

const { confirm } = Modal

export default function Right(props: IProps) {
  const [list, SetList] = useState([] as any[])

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
              showDeleteModal(x)
            }}
          />
          <Popover
            content={
              <div style={{ textAlign: 'center' }}>
                <Switch
                  checked={x.pagepermisson}
                  onChange={() => editRight(x)}
                ></Switch>
              </div>
            }
            title="页面配置项"
            trigger={
              x.pagepermisson === undefined
                ? ('' as ActionType)
                : ('click' as ActionType)
            }
          >
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              disabled={x.pagepermisson === undefined}
            ></Button>
          </Popover>
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
        i.pagepermisson = Number(i.pagepermisson)
        if (i.children && i.children.length === 0) {
          delete i.children
        }
        if (i.children && i.children.length > 0) {
          i.children.forEach((s: any) => {
            if (s.pagepermisson) {
              s.pagepermisson = Number(s.pagepermisson)
            }
          })
        }
      })
      SetList(res.data)
      console.log(res)
    })
  }, [])
  // 删除对话框
  const showDeleteModal = (x: RoleObjType) => {
    confirm({
      title: '确定要删除吗?',
      cancelText: '取消',
      okText: '确定',
      onOk() {
        deleteRight(x)
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }
  // 删除
  const deleteRight = (x: RoleObjType) => {
    console.log('删除', x)
    if (x.grade === 1) {
      menuService.deleteRights(x.id).then((res) => {
        SetList(list.filter((i: any) => i.id !== x.id))
      })
    } else {
      menuService.deleteChilrenRight(x.id).then((res) => {
        const parentList = list.filter((i: any) => i.id === x.rightId)
        console.log('parentList', parentList, list)
        parentList[0].children = parentList[0].children.filter(
          (s: any) => s.id !== x.id
        )
        SetList([...list])
      })
    }
  }
  // 编辑
  const editRight = (x: RoleObjType) => {
    x.pagepermisson = x.pagepermisson === 0 ? 1 : 0
    const data = {
      pagepermisson: x.pagepermisson,
    }
    if (x.grade === 1) {
      menuService.patchRights(x.id, data).then((res) => {
        SetList([...list])
      })
    } else {
      menuService.patchChilrenRight(x.id, data).then((res) => {
        SetList([...list])
      })
    }
    console.log('编辑', x)
  }
  return (
    <div>
      <Table columns={columns} dataSource={list} pagination={{ pageSize: 5 }} />
    </div>
  )
}
