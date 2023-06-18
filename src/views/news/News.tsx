import React, { useState, useEffect } from 'react'
import { Card, Col, Row, List } from 'antd'
import newsService from '../../apis/news'
import _ from 'lodash'
import style from './News.module.scss'

type IProps = {
  children?: any
}

export default function News(props: IProps) {
  const [list, setList] = useState([] as any)

  useEffect(() => {
    const parmas = {
      _expand: 'category',
      publishState: 2,
    }
    newsService.getNews(parmas).then((res: any) => {
      console.log(res)
      setList(
        Object.entries(_.groupBy(res.data, (item) => item.category.title))
      )
    })
  }, [])

  return (
    <div>
      <div className={style.page_title}>
        <div className={style.title1}>全球大新闻</div>
        <div className={style.title2}>查看新闻</div>
      </div>
      {/* 控制上下左右间距的 */}
      <Row gutter={[16, 16]}>
        {list.map((item: any) => (
          <Col span={8} key={item[0]}>
            {/* hoverable鼠标刚放上去会有这个属性 */}
            <Card title={item[0]} bordered={true} hoverable={true}>
              <List
                size="small"
                dataSource={item[1]}
                pagination={{
                  pageSize: 3,
                }}
                //携带当前新闻的id跳转至新闻详情界面
                renderItem={(data: any) => (
                  <List.Item>
                    <a href={`/detail/${data.id}`}>{data.title}</a>
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}
