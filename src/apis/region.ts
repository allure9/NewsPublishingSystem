import request from '../axios/request'

const regionApi = {
  regions: '/regions',
}

const regionService = {
  getRegions: () =>
    request({
      url: regionApi.regions,
    }),
}

export default regionService
