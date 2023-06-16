import request from '../axios/request'

const Api = {
  children: '/children',
}

const childrenService = {
  getChildren: () =>
    request({
      url: Api.children,
    }),
}

export default childrenService
