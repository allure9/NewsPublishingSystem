import React, { useState, useEffect, useRef, useContext } from 'react'
import { DeleteOutlined } from '@ant-design/icons'
import { Button, Table, Modal, Form, Input } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { FormInstance } from 'antd/es/form'
import type { InputRef } from 'antd'
import newsService from '../../../../apis/news'

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
  value?: string
}

type IProps = {
  children?: any
}

interface Item {
  key: string
  name: string
  age: string
  address: string
}

interface EditableRowProps {
  index: number
}

interface EditableCellProps {
  title: React.ReactNode
  editable: boolean
  children: React.ReactNode
  dataIndex: keyof Item
  record: Item
  handleSave: (record: Item) => void
}

type IUpdateCategory = {
  title: string
  value: string
}

const { confirm } = Modal
const EditableContext = React.createContext<FormInstance<any> | null>(null)

export default function Category(props: IProps) {
  const [list, SetList] = useState([] as any[])

  const columns: ColumnsType<DataType> = [
    { title: 'ID', dataIndex: 'id', key: 'id', render: (id) => <b>{id}</b> },
    {
      title: '栏目名称',
      dataIndex: 'title',
      onCell: (record: DataType) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '栏目名称',
        handleSave,
      }),
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
        </div>
      ),
    },
  ]

  // 获取列表
  useEffect(() => {
    newsService.getCategory().then((res: any) => {
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
        deleteCategory(x)
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }
  // 删除
  const deleteCategory = (x: RoleObjType) => {
    newsService.deleteCategory(x.id).then((res) => {
      SetList(list.filter((s) => s.id !== x.id))
    })
  }
  const handleSave = (x: RoleObjType) => {
    const params: IUpdateCategory = {
      title: x.title,
      value: x.value as string,
    }
    newsService.updateCategory(x.id, params).then((res) => {
      SetList(
        list.map((s) => {
          if (s.id === x.id) {
            return {
              id: x.id,
              title: x.title,
              value: x.value,
            }
          }
          return s
        })
      )
    })
  }

  const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm()
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    )
  }

  const EditableCell: React.FC<EditableCellProps> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false)
    const inputRef = useRef<InputRef>(null)
    const form = useContext(EditableContext)!

    useEffect(() => {
      if (editing) {
        inputRef.current!.focus()
      }
    }, [editing])

    const toggleEdit = () => {
      setEditing(!editing)
      form.setFieldsValue({ [dataIndex]: record[dataIndex] })
    }

    const save = async () => {
      try {
        const values = await form.validateFields()

        toggleEdit()
        handleSave({ ...record, ...values })
      } catch (errInfo) {
        console.log('Save failed:', errInfo)
      }
    }

    let childNode = children

    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{ margin: 0 }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{ paddingRight: 24 }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      )
    }

    return <td {...restProps}>{childNode}</td>
  }

  return (
    <div>
      <Table
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell,
          },
        }}
        columns={columns}
        dataSource={list}
        pagination={{ pageSize: 5 }}
        rowKey={(item) => item.id}
      />
    </div>
  )
}
