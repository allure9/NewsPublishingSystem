import request from '../axios/request'

const menuApi = {
  menus: '/rights',
  deleteRight: (id: number) => `/rights/${id}`,
  deleteChilrenRight: (id: number) => `/children/${id}`,
}

const menuService = {
  getMenus: (params: { _embed: string }) =>
    request({
      url: menuApi.menus,
      params,
    }),
  deleteRights: (id: number) =>
    request({
      url: menuApi.deleteRight(id),
      method: 'delete',
    }),
  deleteChilrenRight: (id: number) =>
    request({
      url: menuApi.deleteChilrenRight(id),
      method: 'delete',
    }),
  patchRights: (id: number, data: { pagepermisson: number }) =>
    request({
      url: menuApi.deleteRight(id),
      method: 'patch',
      data,
    }),
  patchChilrenRight: (id: number, data: { pagepermisson: number }) =>
    request({
      url: menuApi.deleteChilrenRight(id),
      method: 'patch',
      data,
    }),
}

export default menuService
