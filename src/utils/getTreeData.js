export function getRole(routes) {
    let res = []
    for (const route of routes) {
        let data = {}
        if (route.meta.roles instanceof Array) {
            data.label = route.meta.title
            data.roles = route.meta.roles
        } else {
            data.label = route.meta.title
            data.roles = []
        }
        data.id = (routes.indexOf(route) + 1) * 100
        data.path = route.path
        if (route.children) {
            data.children = getRole(route.children)
            for (let iterator of data.children) {
                iterator.id = (data.children.indexOf(iterator) + 1) + data.id
            }
        } else {
            data.children = []
        }
        res.push(data)
    }
    return res
}
export function getMeta(routes) {
    let res = []
    for (const route of routes) {
        let data = route.meta
        data.id = (routes.indexOf(route) + 1) * 100
        data.path = route.path
        if (route.children) {
            data.children = getMeta(route.children)
            for (let iterator of data.children) {
                iterator.id = (data.children.indexOf(iterator) + 1) + data.id
            }
        } else {
            data.children = []
        }
        res.push(data)
    }
    return res
}