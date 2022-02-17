import request from '@/utils/request'


export function deleteTopicBank(data) {
    return request({
        url: 'topics/deleteTopicBank',
        method: 'post',
        data
    })
}
export function addTopicBank(data) {
    return request({
        url: 'topics/addTopicBank',
        method: 'post',
        data
    })
}
export function getTopicBank() {
    return request({
        url: 'topics/getTopicBank',
        method: 'get'
    })
}
export function getTopics(data) {
    return request({
        url: 'topics/getTopics',
        method: 'post',
        data
    })
}
export function getSerials() {
    return request({
        url: 'topics/getSerials',
        method: 'get'
    })
}
export function addArrange(data) {
    return request({
        url: 'topics/addArrange',
        method: 'post',
        data
    })
}
export function deleteArrange(data) {
    return request({
        url: 'topics/deleteArrange',
        method: 'post',
        data
    })
}
export function deleteTopic(data) {
    return request({
        url: 'topics/deleteTopic',
        method: 'post',
        data
    })
}
export function updateTopic(data) {
    return request({
        url: 'topics/updateTopic',
        method: 'post',
        data
    })
}
export function addTopic(data) {
    return request({
        url: 'topics/addTopic',
        method: 'post',
        data
    })
}