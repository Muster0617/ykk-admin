import request from '@/utils/request'

export function getArrange(data) {
    return request({
        url: '/grade/getArrange',
        method: 'post',
        data
    })
}
export function getTopic(data) {
    return request({
        url: '/grade/getTopic',
        method: 'post',
        data
    })
}
export function getScore(data) {
    return request({
        url: '/grade/getScore',
        method: 'post',
        data
    })
}