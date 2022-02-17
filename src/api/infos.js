import request from '@/utils/request'

export function getInfos() {
    return request({
        url: '/info/getInfos',
        method: 'get',
    })
}

export function addInfo(data) {
    return request({
        url: '/info/addInfo',
        method: 'post',
        data
    })
}
export function deleteInfo(data) {
    return request({
        url: '/info/deleteInfo',
        method: 'post',
        data
    })
}
export function updateInfo(data) {
    return request({
        url: '/info/updateInfo',
        method: 'post',
        data
    })
}