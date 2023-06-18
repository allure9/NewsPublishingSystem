import React, { useEffect, useState } from 'react'
import newsService from '../apis/news'
import { notification } from 'antd'

type anyProps = {
  [propName: string]: any
}
function usePublish(types: number) {
  const [list, setList] = useState([] as any)
  // 获取用户登录信息
  const userInfo: anyProps = JSON.parse(localStorage.getItem('token') as any)

  useEffect(() => {
    const parmas = {
      author: userInfo.username,
      _expand: 'category',
      publishState: types,
    }
    newsService.getNews(parmas).then((res) => {
      setList(res.data)
    })
  }, [userInfo.username, types])

  const handlePublish = (id: number | string) => {
    const data = {
      publishState: 2,
      publishTime: Date.now(),
    }
    newsService.updateNews(id, data).then((res) => {
      setList(list.filter((item: any) => item.id !== id))
      notification.info({
        message: `通知`,
        description: `您可以到【发布管理/已经发布】中查看您的新闻`,
        placement: 'bottomRight',
      })
    })
  }

  const handleSunset = (id: number | string) => {
    const data = {
      publishState: 3,
    }
    newsService.updateNews(id, data).then((res) => {
      setList(list.filter((item: any) => item.id !== id))
      notification.info({
        message: `通知`,
        description: `您可以到【发布管理/已下线】中查看您的新闻`,
        placement: 'bottomRight',
      })
    })
  }

  const handleDelete = (id: number | string) => {
    newsService.deleteNews(id).then((res) => {
      setList(list.filter((item: any) => item.id !== id))
      notification.info({
        message: `通知`,
        description: `您已经删除了已下线的新闻`,
        placement: 'bottomRight',
      })
    })
  }
  return { list, handlePublish, handleSunset, handleDelete }
}
export default usePublish
