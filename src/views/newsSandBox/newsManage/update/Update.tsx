import React, { useState, useEffect, useRef } from 'react'
import { Button, Steps, Form, Input, Select, message, notification } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import style from './Update.module.scss'
import newsService from '../../../../apis/news'
import NewsEditor from '../../../../components/newsMange/newsEditor/index'
import axios from 'axios'

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

const { Option } = Select

export default function Update(props: IProps) {
  const [current, setCurrent] = useState(0)
  const [categoryList, setCategoryList] = useState([])
  const [formInfo, setFormInfo] = useState({})
  const [content, setContent] = useState('' as string)
  const oneForm = useRef(null as any)

  const navigate = useNavigate()
  const params = useParams()

  // 获取用户登录信息
  const userInfo: anyProps = JSON.parse(localStorage.getItem('token') as any)

  useEffect(() => {
    newsService.getCategory().then((res) => {
      setCategoryList(res.data)
    })
  }, [])

  useEffect(() => {
    axios
      .get(
        `http://localhost:3000/news/${params.id}?_expand=category&_expand=role`
      )
      .then((res) => {
        setContent(res.data.content)
        oneForm.current.setFieldsValue({
          categoryId: res.data.categoryId,
          title: res.data.title,
        })
      })
  }, [params.id])

  const categorySelect = (x: any) => {
    console.log(oneForm)
  }
  const handleSave = (x: number) => {
    const data: IAddNews = {
      // title和分类
      ...formInfo,
      content: content,
      auditState: x,
    }
    newsService.updateNews(params.id as string, data).then((res) => {
      // 传0表示跳转至草稿箱列表，传1表示跳转到审核列表
      navigate(x === 0 ? '/news-manage/draft' : '/audit-manage/list')
      notification.info({
        message: `通知`,
        description: `您可以到${x === 0 ? '草稿箱' : '审核列表'}中查看您的新闻`,
        // 位置
        placement: 'bottomRight',
      })
    })
  }
  const handleNext = () => {
    if (current === 0) {
      oneForm?.current
        .validateFields()
        .then((res: any) => {
          setFormInfo(res)
          setCurrent(current + 1)
        })
        .catch((err: any) => {
          return Promise.reject(err)
        })
    } else {
      if (content === '' || content.trim() === '<p></p>') {
        message.error('新闻内容不能为空')
      } else {
        setCurrent(current + 1)
      }
    }
  }
  const handlePrevious = () => {
    console.log(oneForm)
  }
  return (
    <div>
      <div
        style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}
      >
        <ArrowLeftOutlined
          onClick={() => {
            navigate(-1)
          }}
        />
        <div className={style.add_title}>撰写新闻</div>
      </div>
      <Steps
        current={2}
        items={[
          {
            title: '基本信息',
            description: '新闻标题，新闻分类',
          },
          {
            title: '新闻内容',
            description: '新闻主题内容',
          },
          {
            title: '新闻提交',
            description: '保存草稿或提交审核',
          },
        ]}
      />
      <div style={{ marginTop: '50px' }}>
        <div className={current === 0 ? '' : style.none}>
          <Form labelCol={{ span: 0 }} wrapperCol={{ span: 24 }} ref={oneForm}>
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[{ required: true, message: '请输入新闻标题' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[{ required: true, message: '请选择新闻分类' }]}
            >
              <Select
                onChange={(x) => {
                  categorySelect(x)
                }}
              >
                {categoryList.map((s: any) => {
                  return (
                    <Option value={s.id} key={s.id}>
                      {s.title}
                    </Option>
                  )
                })}
              </Select>
            </Form.Item>
          </Form>
        </div>

        <div className={current === 1 ? '' : style.none}>
          <NewsEditor
            getContent={(value: any) => {
              setContent(value)
            }}
            content={content}
          ></NewsEditor>
        </div>

        <div className={current === 2 ? '' : style.none}>333</div>
      </div>
      {/* 操作按钮 */}
      <div style={{ marginTop: '50px' }}>
        {current === 2 && (
          <span>
            <Button type="primary" onClick={() => handleSave(0)}>
              保存草稿箱
            </Button>
            <Button danger onClick={() => handleSave(1)}>
              提交审核
            </Button>
          </span>
        )}
        {current < 2 && (
          <Button type="primary" onClick={handleNext}>
            下一步
          </Button>
        )}
        {current > 0 && <Button onClick={handlePrevious}>上一步</Button>}
      </div>
    </div>
  )
}
