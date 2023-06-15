import React, { forwardRef, useState, useEffect } from 'react'
import { Form, Input, Select } from 'antd'

type IProps = {
  children?: any
  roleList: any[]
  regionList: any[]
  isUpdateDisabled?: any
}

const { Option } = Select

const UserForm = forwardRef((props: IProps, ref: any) => {
  const [isDisabled, setIsDisabled] = useState(false)
  const { roleList, regionList } = props

  useEffect(() => {
    setIsDisabled(props.isUpdateDisabled)
  }, [props.isUpdateDisabled])

  // 角色选中
  const roleSelect = (x: number) => {
    if (x === 1) {
      setIsDisabled(true)
      ref.current.setFieldsValue({
        region: '',
      })
    } else {
      setIsDisabled(false)
    }
  }
  return (
    <div>
      <Form layout="vertical" ref={ref as any}>
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="区域"
          name="region"
          rules={isDisabled ? [] : [{ required: true, message: '请选择区域' }]}
        >
          <Select disabled={isDisabled}>
            {regionList.map((s) => {
              return (
                <Option value={s.value} key={s.id}>
                  {s.title}
                </Option>
              )
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label="角色"
          name="roleId"
          rules={[{ required: true, message: '请选择角色' }]}
        >
          <Select
            onChange={(x) => {
              roleSelect(x)
            }}
          >
            {roleList.map((s) => {
              return (
                <Option value={s.id} key={s.id}>
                  {s.roleName}
                </Option>
              )
            })}
          </Select>
        </Form.Item>
      </Form>
    </div>
  )
})
export default UserForm
