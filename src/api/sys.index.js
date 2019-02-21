
import request from '@/plugin/axios'

export function getChartDataGet (params) {
  return request({
    url: '/getChartDataGet',
    method: 'get',
    params
  })
}