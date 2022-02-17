import request from '@/utils/request'

export function getPermission(data) {
    return request({
        url: '/permission/getPermission',
        method: 'post',
        data
    })
}
export function getAllPermission() {
    return request({
        url: '/permission/getAllPermission',
        method: 'get',
    })
}
export function addPermission(data) {
    return request({
        url: '/permission/addPermission',
        method: 'post',
        data
    })
}
export function deletePermission(data) {
    return request({
        url: '/permission/deletePermission',
        method: 'post',
        data
    })
}
export function updatePermission(data) {
    return request({
        url: '/permission/updatePermission',
        method: 'post',
        data
    })
}
export function revampPermission(data) {
    return request({
        url: '/permission/revampPermission',
        method: 'post',
        data
    })
}