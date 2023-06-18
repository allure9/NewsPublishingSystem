import React, { useState, useEffect } from 'react'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Table, Modal, Tree } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { DataNode, TreeProps } from 'antd/es/tree'
import roleService from '../../../../apis/role'
import menuService from '../../../../apis/menu'

interface DataType {
  key: React.Key
  name: string
  age: number
  address: string
  children?: DataType[]
}

interface RoleObjType {
  roleType: number
  id: number
  roleName: string
  rights?: []
}

type IProps = {
  children?: any
}

const { confirm } = Modal

export default function Role(props: IProps) {
  const [list, SetList] = useState([] as any[])
  const [currentCheckedRight, setCurrentCheckedRight] = useState([])
  const [isModalShow, setIsModalShow] = useState(false)
  const [roleId, setRoleId] = useState(0 as number)
  const [roleTree, setRoleTree] = useState([
    {
      title: 'parent 1',
      key: '0-0',
      children: [
        {
          title: 'parent 1-0',
          key: '0-0-0',
          disabled: true,
          children: [
            {
              title: 'leaf',
              key: '0-0-0-0',
              disableCheckbox: true,
            },
            {
              title: 'leaf',
              key: '0-0-0-1',
            },
          ],
        },
        {
          title: 'parent 1-1',
          key: '0-0-1',
          children: [
            {
              title: <span style={{ color: '#1677ff' }}>sss</span>,
              key: '0-0-1-0',
            },
          ],
        },
      ],
    },
  ] as DataNode[])

  const columns: ColumnsType<DataType> = [
    { title: 'ID', dataIndex: 'id', key: 'id', render: (id) => <b>{id}</b> },
    {
      title: '角色名称',
      dataIndex: 'roleName',
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
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => {
              showEditModal(x)
            }}
          ></Button>
        </div>
      ),
    },
  ]

  // 获取列表
  useEffect(() => {
    roleService.getRoles().then((res: any) => {
      SetList(res.data)
    })
  }, [])
  // 获取权限列表
  useEffect(() => {
    const params = {
      _embed: 'children',
    }
    menuService.getMenus(params).then((res: any) => {
      setRoleTree(res.data)
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
    roleService.deleteRoles(x.id).then((res) => {
      SetList(list.filter((i) => i.id !== x.id))
    })
  }

  // 打开编辑对话框
  const showEditModal = (x: RoleObjType) => {
    setCurrentCheckedRight(x.rights as [])
    setRoleId(x.id)
    setIsModalShow(true)
  }
  // 关闭编辑对话框
  const editModalCancle = () => {
    setIsModalShow(false)
  }
  // 权限树形选中
  const rightTreeCheck = (e: any) => {
    setCurrentCheckedRight(e.checked)
  }
  // 编辑角色
  const editRole = () => {
    const data = {
      rights: currentCheckedRight as [],
    }
    roleService.patchRoles(roleId, data).then((res) => {
      SetList(
        list.map((i) => {
          if (i.id === roleId) {
            return {
              ...i,
              rights: currentCheckedRight,
            }
          } else {
            return i
          }
        })
      )
    })
    editModalCancle()
  }

  return (
    <div>
      <Table
        columns={columns}
        dataSource={list}
        pagination={{ pageSize: 5 }}
        rowKey={(item) => item.id}
      />
      <Modal
        title="权限分配"
        cancelText="取消"
        okText="确定"
        open={isModalShow}
        onOk={editRole}
        onCancel={editModalCancle}
      >
        <div>
          <Tree
            checkable
            checkStrictly={true}
            checkedKeys={currentCheckedRight}
            onCheck={rightTreeCheck}
            treeData={roleTree}
          />
        </div>
      </Modal>
    </div>
  )
}
