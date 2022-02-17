import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// 不需要token白名单
const whiteList = ['/login', '/auth-redirect']
    // 路由前置守卫
router.beforeEach(async(to, from, next) => {
    // 开始进度条
    NProgress.start()
        // 设置目标页面的title(从目标页面的meta中获取title)
    document.title = getPageTitle(to.meta.title)
        // 获取store里面得登陆令牌，有令牌，表示有登录
    const hasToken = getToken()
    if (hasToken) {
        if (to.path === '/login') {
            // 如果有登录，并且目标路径是/login,路由到首页
            next({ path: '/' })
            NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
        } else {
            // 获取登陆用户的角色，能获取到，表示有角色信息，否则就调用getinfo，获取当前用户的角色信息
            const hasRoles = store.getters.roles && store.getters.roles.length > 0
            if (hasRoles) {
                next()
            } else {
                try {
                    // 派发user/getInfo action，获取当前角色信息
                    const { roles } = await store.dispatch('user/getInfo')
                        // 根据用户得角色信息，派发到permission/generateRoutes action，生成动态路由表
                    const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
                        // 挂载动态路由
                    router.addRoutes(accessRoutes)
                        // hack方法来确保addroues是完整的 
                        // 设置replace: true，这样导航就不会留下历史记录  
                    next({...to, replace: true })
                } catch (error) {
                    // 移除令牌，到登录页面重新登录
                    await store.dispatch('user/resetToken')
                    Message.error(error || 'Has Error')
                    next(`/login?redirect=${to.path}`)
                    NProgress.done()
                }
            }
        }
    } else {
        /*没有token*/
        // 在免费登录白名单，直接去
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            // 其他没有访问权限的页面被重定向到登录页面
            next(`/login?redirect=${to.path}`)
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    // 完成进度条  
    NProgress.done()
})