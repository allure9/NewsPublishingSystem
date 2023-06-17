import request from '../axios/request'

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

type IGetDetail = {
  _expand: string
}

type IGetNews = {
  author?: string
  auditState?: string | number
  _expand?: string
}

type IAuditList = {
  author: string
  auditState_ne: string | number
  publishState_lte: string | number
  _expand: string
}

const Api = {
  category: '/categories',
  news: '/news',
  newsFunc: (id: string | number) => `/news/${id}`,
}

const newsService = {
  getCategory: () =>
    request({
      url: Api.category,
    }),
  addNews: (data: IAddNews) =>
    request({
      url: Api.news,
      method: 'post',
      data,
    }),
  getNews: (params: IGetNews) =>
    request({
      url: Api.news,
      params,
    }),
  updateNews: (id: string | number, data: IAddNews) =>
    request({
      url: Api.newsFunc(id),
      method: 'patch',
      data,
    }),
  deleteNews: (id: string | number) =>
    request({
      url: Api.newsFunc(id),
      method: 'delete',
    }),
  getNewsDetail: (id: string | number, params: IGetDetail) =>
    request({
      url: Api.newsFunc(id),
      params,
    }),
  getAuditList: (params: IAuditList) =>
    request({
      url: Api.news,
      params,
    }),
}

export default newsService
