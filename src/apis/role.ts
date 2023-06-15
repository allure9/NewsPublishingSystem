import request from '../axios/request'

const roleApi = {
  roles: '/roles',
  rolesFun: (id: number) => `/roles/${id}`,
}

const roleService = {
  getRoles: () =>
    request({
      url: roleApi.roles,
    }),
  deleteRoles: (id: number) =>
    request({
      url: roleApi.rolesFun(id),
      method: 'delete',
    }),
  patchRoles: (id: number, data: { rights: [] }) =>
    request({
      url: roleApi.rolesFun(id),
      method: 'patch',
      data,
    }),
}

export default roleService
