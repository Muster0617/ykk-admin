import { constantRoutes, componentMap } from '@/router'
import { getAsyncRoutes } from '@/api/asyncRoutes'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
    if (route.meta && route.meta.roles) {
        return roles.some(role => route.meta.roles.includes(role))
    } else {
        return true
    }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
    const res = []

    routes.forEach(route => {
        const tmp = {...route }
        if (hasPermission(roles, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, roles)
            }
            res.push(tmp)
        }
    })

    return res
}

//替换route对象中的component
function replaceComponent(comp) {
    if (comp.component && typeof(comp.component) == 'string') {
        comp.component = componentMap[comp.component];
    }
    if (comp.children && comp.children.length > 0) {
        for (let index = 0; index < comp.children.length; index++) {
            comp.children[index] = replaceComponent(comp.children[index])
        }
    }
    return comp
}

const state = {
    routes: [],
    addRoutes: []
}

const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes
        state.routes = constantRoutes.concat(routes)
    }
}

const actions = {
    async generateRoutes({ commit }, roles) {
        // 向后端请求路由表
        let res = await getAsyncRoutes()
            // 替换组件
        let asyncRoutes = res.data.filter(route => {
                return replaceComponent(route)
            })
            // 定义一个变量，用来存放可以访问的路由表
        let accessedRoutes
            //     // 判断当前的角色列表中，是否包含admin
            // if (roles.includes('admin')) {
            //     // 所有路由表都可以访问
            //     accessedRoutes = asyncRoutes || []
            // } else {
            //     // 根据角色，过滤掉不能访问的路由表
            //     accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
            // }
            //根据角色，过滤掉不能访问的路由表
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
            // commit
        commit('SET_ROUTES', accessedRoutes)
            // 成功返回该路由表
        return accessedRoutes
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}