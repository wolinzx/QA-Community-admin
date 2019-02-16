import request from '@/plugin/axios'

export function getTopicGet (params) {
  return request({
    url: '/getTopicGet',
    method: 'get',
    params
  })
}

export function getTopicDetailGet (params) {
  console.log(params)
  return request({
    url: '/getTopicDetailGet',
    method: 'get',
    params
  })
}

export function deleteTopicGet (params) {
  return request({
    url: '/deleteTopicGet',
    method: 'get',
    params
  })
}

export function addTopicGet (params) {
  return request({
    url: '/addTopicGet',
    method: 'get',
    params
  })
}
