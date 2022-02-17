import request from '@/utils/request'

export function getStudents() {
    return request({
        url: 'students/getStudents',
        method: 'get'
    })
}
export function getTeaStudent(data) {
    return request({
        url: 'students/getTeaStudent',
        method: 'post',
        data
    })
}
export function getStudentId() {
    return request({
        url: 'students/getStudentId',
        method: 'get'
    })
}
export function addStudent(data) {
    return request({
        url: 'students/addStudent',
        method: 'post',
        data
    })
}
export function deleteStudent(data) {
    return request({
        url: 'students/deleteStudent',
        method: 'post',
        data
    })
}
export function updateStudent(data) {
    return request({
        url: 'students/updateStudent',
        method: 'post',
        data
    })
}