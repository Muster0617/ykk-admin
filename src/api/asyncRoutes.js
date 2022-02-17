import request from '@/utils/request'

export function getAsyncRoutes() {
    return request({
        url: '/route/getAsyncRoutes',
        method: 'get',
    })
}
export function addNode(data) {
    return request({
        url: '/route/addNode',
        method: 'post',
        data
    })
}
export function removeRoute(data) {
    return request({
        url: '/route/removeRoute',
        method: 'post',
        data
    })
}
export function addRoute(data) {
    return request({
        url: '/route/addRoute',
        method: 'post',
        data
    })
}
export function updateRoute(data) {
    return request({
        url: '/route/updateRoute',
        method: 'post',
        data
    })
}