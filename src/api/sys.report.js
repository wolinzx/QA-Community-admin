import request from '@/plugin/axios'

export function getReportGet (params) {
  return request({
    url: '/getReportGet',
    method: 'get',
    params
  })
}
export function getHandleReportGet (params) {
  return request({
    url: '/getHandleReportGet',
    method: 'get',
    params
  })
}
export function getQuestionGet (params) {
  return request({
    url: '/getQuestionGet',
    method: 'get',
    params
  })
}
