import request from '@/utils/request'

export function login(data) {
    return request({
        url: '/user/login',
        method: 'post',
        data
    })
}

export function getInfo(token) {
    return request({
        url: '/user/getInfo',
        method: 'get',
        params: { token }
    })
}

export function logout(data) {
    return request({
        url: '/user/logout',
        method: 'post',
        data
    })
}

export function getUsers() {
    return request({
        url: '/user/getUsers',
        method: 'get',
    })
}
export function getClassInfo() {
    return request({
        url: '/user/getClassInfo',
        method: 'get',
    })
}
export function addUser(data) {
    return request({
        url: '/user/addUser',
        method: 'post',
        data
    })
}
export function deleteUser(data) {
    return request({
        url: '/user/deleteUser',
        method: 'post',
        data
    })
}
export function updatePassword(data) {
    return request({
        url: '/user/updatePassword',
        method: 'post',
        data
    })
}
export function editUser(data) {
    return request({
        url: '/user/editUser',
        method: 'post',
        data
    })
}