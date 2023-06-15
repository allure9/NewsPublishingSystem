import React, { useState, useEffect, useRef } from 'react'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { Button, Table, Modal, Switch } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import userService from '../../../../apis/user'
import regionService from '../../../../apis/region'
import roleService from '../../../../apis/role'
import UserForm from '../../../../components/userMange/userForm'

interface DataType {
  key: React.Key
  name: string
  age: number
  address: string
  children?: DataType[]
  default?: any
}

interface RoleObjType {
  [propName: string]: any
}

type IProps = {
  children?: any
}

const { confirm } = Modal

export default function List(props: IProps) {
  const [list, SetList] = useState([] as any[])
  const [isAddModal, setIsAddMoadl] = useState(false)
  const [isUpdateModal, setIsUpdateModal] = useState(false)
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false)
  const [roleList, setRoleList] = useState([] as any[])
  const [regionList, setRegionList] = useState([] as any[])
  const [currentUser, setCurrentUser] = useState({} as any)
  const addFormRef = useRef(null as any)
  const updateFormRef = useRef({} as any)

  const columns: ColumnsType<DataType> = [
    {
      title: '区域',
      dataIndex: 'region',
      render: (region) => <b>{region ? '全球' : region}</b>,
      filters: [
        ...regionList.map((s) => ({
          text: s.title,
          value: s.value,
        })),
        {
          text: '全球',
          value: '全球',
        },
      ],
      onFilter: (value: any, item: any) => {
        if (value === '全球') {
          return item.region == ''
        } else {
          return item.region === value
        }
      },
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => role.roleName,
    },
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => (
        <Switch
          checked={JSON.parse(roleState)}
          disabled={JSON.parse(item.default)}
          onChange={() => {
            setRoleState(item)
          }}
        ></Switch>
      ),
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
            disabled={JSON.parse(x.default)}
            onClick={() => {
              showDeleteModal(x)
            }}
          />
          <Button
            type="primary"
            shape="circle"
            icon={<EditOutlined />}
            disabled={JSON.parse(x.default)}
            onClick={() => {
              openUpdateModal(x)
            }}
          ></Button>
        </div>
      ),
    },
  ]

  // 获取列表
  useEffect(() => {
    const params = {
      _expand: 'role',
    }
    userService.getUsers(params).then((res: any) => {
      SetList(res.data)
      console.log(res)
    })
  }, [])
  // 获取角色列表
  useEffect(() => {
    roleService.getRoles().then((res: any) => {
      setRoleList(res.data)
    })
  }, [])
  // 获取区域列表
  useEffect(() => {
    regionService.getRegions().then((res: any) => {
      setRegionList(res.data)
    })
  }, [])
  // 打开添加用户对话框
  const openAddUserModal = () => {
    setIsAddMoadl(true)
  }
  // 添加用户
  const addUser = () => {
    addFormRef.current
      .validateFields()
      .then((value: any) => {
        const data = {
          ...value,
          roleState: true,
          default: false,
        }
        userService.addUser(data).then((res) => {
          SetList([
            ...list,
            {
              ...res.data,
              role: roleList.filter((s) => s.id === value.roleId)[0],
            },
          ])
        })
      })
      .catch((err: any) => {
        console.log(err)
      })
    setIsAddMoadl(false)
    addFormRef.current.resetFields()
  }
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
    userService.deleteUser(x.id).then((res) => {
      SetList(list.filter((s) => s.id !== x.id))
    })
  }
  // 设置用户状态
  const setRoleState = (x: RoleObjType) => {
    const data = {
      roleState: x.roleState,
    }
    userService.setUserState(x.id, data).then((res) => {
      x.roleState = !x.roleState
      SetList([...list])
    })
  }
  // 打开更新对话框
  const openUpdateModal = (x: RoleObjType) => {
    setIsUpdateModal(true)
    setTimeout(() => {
      x.roleId === 1 ? setIsUpdateDisabled(true) : setIsUpdateDisabled(false)
      updateFormRef.current?.setFieldsValue(x)
      setCurrentUser(x)
    }, 0)
  }
  // 编辑
  const updateUser = () => {
    updateFormRef.current
      .validateFields()
      .then((value: any) => {
        userService.updateUserState(currentUser.id, value).then((res) => {
          SetList(
            list.map((s) => {
              if (s.id === currentUser.id) {
                return {
                  ...s,
                  ...value,
                  role: roleList.filter((s) => s.id === value.roleId)[0],
                }
              }
              return s
            })
          )
        })
      })
      .catch((err: any) => {
        console.log(err)
      })
    setIsUpdateModal(false)
    setIsUpdateDisabled(!isUpdateDisabled)
  }
  return (
    <div>
      <Button type="primary" onClick={openAddUserModal}>
        添加用户
      </Button>
      <Table
        columns={columns}
        dataSource={list}
        pagination={{ pageSize: 5 }}
        rowKey={(item) => item.id}
      />
      <Modal
        title="添加用户"
        cancelText="取消"
        okText="确定"
        open={isAddModal}
        onOk={addUser}
        onCancel={() => {
          setIsAddMoadl(false)
          addFormRef.current.resetFields()
        }}
      >
        <UserForm
          ref={addFormRef}
          roleList={roleList as []}
          regionList={regionList as []}
        ></UserForm>
      </Modal>
      <Modal
        title="更新用户"
        cancelText="取消"
        okText="更新"
        open={isUpdateModal}
        onOk={updateUser}
        onCancel={() => {
          setIsUpdateModal(false)
          setIsUpdateDisabled(!isUpdateDisabled)
        }}
      >
        <UserForm
          ref={updateFormRef}
          roleList={roleList as []}
          regionList={regionList as []}
          isUpdateDisabled={isUpdateDisabled}
        ></UserForm>
      </Modal>
    </div>
  )
}
