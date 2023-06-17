import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'
import style from './Preview.module.scss'
import newsService from '../../../../apis/news'
import axios from 'axios'
import moment from 'moment'

export default function Preview() {
  const [detail, setDetail] = useState({} as any)

  const auditStateMap = ['未审核', '审核中', '已通过', '未通过']
  const publishStateMap = ['未发布', '待发布', '已上线', '已下线']
  const colorMap = ['black', 'orange', 'green', 'red']

  const navigate = useNavigate()
  const params = useParams()

  useEffect(() => {
    axios
      .get(
        `http://localhost:3000/news/${params.id}?_expand=category&_expand=role`
      )
      .then((res) => {
        console.log(res)
        setDetail(res.data)
      })
  }, [params.id])
  return (
    <div>
      <div className={style.top_wrap}>
        <div className={`${style.title_wrap} ${style.flex_wp}`}>
          <ArrowLeftOutlined
            onClick={() => {
              navigate(-1)
            }}
          />
          <div className={`${style.flex_wp}`}>
            <div style={{ marginLeft: '10px', fontSize: '20px' }}>
              {detail.title}
            </div>
            <div style={{ marginLeft: '10px' }}>{detail?.category?.title}</div>
          </div>
        </div>
        <div>
          <div className={`${style.info_item} ${style.flex_wp}`}>
            <div className={`${style.flex_1}`}>
              创建者：<span>{detail.author}</span>
            </div>
            <div className={`${style.flex_1}`}>
              创建时间：
              <span>
                {moment(Number(detail.createTime)).format(
                  'YYYY/MM/DD HH:MM:SS'
                )}
              </span>
            </div>
            <div className={`${style.flex_1}`}>
              发布时间：
              <span>
                {detail.publishTime
                  ? moment(Number(detail.publishTime)).format(
                      'YYYY/MM/DD HH:MM:SS'
                    )
                  : '-'}
              </span>
            </div>
          </div>
          <div className={`${style.info_item} ${style.flex_wp}`}>
            <div className={`${style.flex_1}`}>
              区域：<span>{detail.region}</span>
            </div>
            <div className={`${style.flex_1}`}>
              审核状态：
              <span style={{ color: colorMap[Number(detail.auditState)] }}>
                {auditStateMap[Number(detail.auditState)]}
              </span>
            </div>
            <div className={`${style.flex_1}`}>
              发布状态：
              <span style={{ color: colorMap[Number(detail.publishState)] }}>
                {publishStateMap[Number(detail.publishState)]}
              </span>
            </div>
          </div>
          <div className={`${style.info_item} ${style.flex_wp}`}>
            <div className={`${style.flex_1}`}>
              访问数量：<span style={{ color: 'green' }}>{detail.view}</span>
            </div>
            <div className={`${style.flex_1}`}>
              点赞数量：<span style={{ color: 'green' }}>{detail.star}</span>
            </div>
            <div className={`${style.flex_1}`}>
              评论数量：<span style={{ color: 'green' }}>{0}</span>
            </div>
          </div>
        </div>
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: detail.content }}
        style={{ border: '1px solid black' }}
      ></div>
    </div>
  )
}
