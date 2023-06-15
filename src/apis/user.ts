import request from '../axios/request'

interface AddData {
  [propName: string]: any
}

const userApi = {
  users: '/users',
  usersFun: (id: number) => `/users/${id}`,
}

const userService = {
  getUsers: (params: { _expand: string }) =>
    request({
      url: userApi.users,
      params,
    }),
  addUser: (data: AddData) =>
    request({
      url: userApi.users,
      data,
      method: 'post',
    }),
  deleteUser: (id: number) =>
    request({
      url: userApi.usersFun(id),
      method: 'delete',
    }),
  setUserState: (id: number, data: { roleState: any }) =>
    request({
      url: userApi.usersFun(id),
      method: 'patch',
      data,
    }),
  updateUserState: (id: number, data: AddData) =>
    request({
      url: userApi.usersFun(id),
      method: 'patch',
      data,
    }),
}

export default userService
