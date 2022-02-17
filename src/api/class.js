import request from '@/utils/request'

export function getClassInfo() {
    return request({
        url: '/classinfo/getClassInfo',
        method: 'get',
    })
}
export function addClass(data) {
    return request({
        url: '/classinfo/addClass',
        method: 'post',
        data
    })
}
export function deleteClass(data) {
    return request({
        url: '/classinfo/deleteClass',
        method: 'post',
        data
    })
}
export function updateClass(data) {
    return request({
        url: '/classinfo/updateClass',
        method: 'post',
        data
    })
}
export function getStudent(data) {
    return request({
        url: '/classinfo/getStudent',
        method: 'post',
        data
    })
}