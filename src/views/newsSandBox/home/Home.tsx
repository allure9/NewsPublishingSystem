import React, { useState, useEffect, useRef } from 'react'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd'
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import newsService from '../../../apis/news'
import * as ECharts from 'echarts'
import _ from 'lodash'

const { Meta } = Card

type IProps = {
  children?: any
}

type anyProps = {
  [propName: string]: any
}

export default function Home(props: IProps) {
  const [viewList, setViewList] = useState([])
  const [starList, setStarList] = useState([])
  const [allList, setallList] = useState([])
  const [pieChart, setpieChart] = useState(null)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const barRef: any = useRef()
  const pieRef: any = useRef()

  // 获取用户登录信息
  const userInfo: anyProps = JSON.parse(localStorage.getItem('token') as any)

  useEffect(() => {
    const parmas = {
      _expand: 'category',
      publishState: 2,
      _sort: 'view',
      _order: 'desc',
      _limit: 6,
    }
    newsService.getNews(parmas).then((res: any) => {
      setViewList(res.data)
    })
  }, [])

  useEffect(() => {
    const parmas = {
      _expand: 'category',
      publishState: 2,
      _sort: 'star',
      _order: 'desc',
      _limit: 6,
    }
    newsService.getNews(parmas).then((res: any) => {
      setStarList(res.data)
    })
  }, [])

  useEffect(() => {
    const parmas = {
      _expand: 'category',
      publishState: 2,
    }
    newsService.getNews(parmas).then((res: any) => {
      renderBarView(_.groupBy(res.data, (item) => item.category.title))
      setallList(res.data)
    })
    return () => {
      window.onresize = null
    }
  }, [])

  const renderBarView = (obj: any) => {
    // 放到barRef这个容器中
    const myChart = ECharts.init(barRef.current)
    // 指定图表的配置项和数据
    const option = {
      title: {
        text: '新闻分类图示',
      },
      tooltip: {},
      legend: {
        data: ['数量'],
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          rotate: '45',
          // 设置为0表示强制显示所有标签
          interval: 0,
        },
      },
      yAxis: {
        minInterval: 1,
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(obj).map((item: any) => item.length),
        },
      ],
    }
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
    // 给window绑定resize
    window.onresize = () => {
      myChart.resize()
    }
  }

  const renderPieView = () => {
    // 筛选出该作者发布的新闻
    const currentList = allList.filter(
      (item: any) => item.author === userInfo.username
    )
    const groupObj = _.groupBy(currentList, (item: any) => item.category.title)
    const list = []
    for (const i in groupObj) {
      list.push({
        name: i,
        value: groupObj[i].length,
      })
    }
    let myChart: any = ''
    if (!pieChart) {
      // 只做一次初始化
      myChart = ECharts.init(pieRef.current)
      setpieChart(myChart)
    } else {
      myChart = pieChart
    }

    const option: any = {
      title: {
        text: '当前用户新闻分类图示',
        // subtext: '纯属虚构',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: '50%',
          data: list,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    }
    option && myChart.setOption(option)
  }

  return (
    <div>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={false}>
            <List
              size="small"
              // bordered
              dataSource={viewList}
              // 表示要渲染成什么数据
              renderItem={(item: any) => (
                <List.Item>
                  {/* 点击可以查看最长浏览的新闻详情 */}
                  <a href={`/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
            <List
              size="small"
              // bordered
              dataSource={starList}
              renderItem={(item: any) => (
                <List.Item>
                  <a href={`/news-manage/preview/${item.id}`}>{item.title}</a>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            style={{ width: 300 }}
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined
                key="setting"
                onClick={() => {
                  setDrawerVisible(true)
                  setTimeout(() => {
                    renderPieView()
                  }, 0)
                }}
              />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={
                <Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />
              }
              title={userInfo.username}
              description={
                <div>
                  <b style={{ paddingRight: '15px' }}>
                    {userInfo.region ? userInfo.region : '全球'}
                  </b>
                  {userInfo.role.roleName}
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      <div
        ref={barRef}
        style={{ width: '100%', height: '400px', marginTop: '30px' }}
      ></div>
      <Drawer
        width="500px"
        title="个人新闻分类"
        placement="right"
        closable={true}
        onClose={() => {
          setDrawerVisible(false)
        }}
        open={drawerVisible}
      >
        <div
          ref={pieRef}
          style={{
            width: '100%',
            height: '400px',
            marginTop: '30px',
          }}
        ></div>
      </Drawer>
    </div>
  )
}
