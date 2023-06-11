import request from '../axios/request'

const menuApi = {
  menus: '/rights',
}

const menuService = {
  getMenus: (params: { _embed: string }) =>
    request({
      url: menuApi.menus,
      params,
    }),
}

export default menuService
