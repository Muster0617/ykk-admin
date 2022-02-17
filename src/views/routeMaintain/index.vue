<template>
  <div class="wrapper">
    <div class="top_button">
      <el-button type="success"  @click="addRoute()">新建菜单</el-button>
    </div>
    <el-tree
      :data="data"
      node-key="id"
      :props="defaultProps"
      default-expand-all
      :expand-on-click-node="false"
    >
      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span class="custom-tree-button">
          <el-button
            v-if="(data.id % 100) % 10 === 0"
            type="text"
            size="mini"
            @click="addSeed(data)"
          >
            添加子菜单
          </el-button>
          <el-button type="text" size="mini" @click="update(data)">
            修改
          </el-button>
          <el-button type="text" size="mini" @click="() => remove(node, data)">
            删除
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="70%"
      @close="close()"
      :close-on-click-modal="false"
    >
      <el-form
        ref="routeForm"
        label-position="right"
        label-width="100px"
        :model="operateData"
      >
        <!--
        prop：表单域 model 要验证的字段，在使用 validate、resetFields 方法的情况下，该属性是必填的
        rules：表单验证规则
         -->
        <el-form-item label="路径:" prop="path" :rules="rules">
          <el-input v-model="operateData.path" placeholder="path" />
        </el-form-item>
        <el-form-item label="标题:" prop="name" :rules="rules">
          <el-input v-model="operateData.name" placeholder="name" />
        </el-form-item>
        <el-form-item
          label="组件名:"
          prop="component"
          :rules="isNode ? rules : Layoutrule"
        >
          <el-input v-model="operateData.component" placeholder="component" />
        </el-form-item>
        <el-form-item
          v-if="!isNode"
          label="重定向路径:"
          prop="redirect"
          :rules="rules"
        >
          <el-input v-model="operateData.redirect" placeholder="redirect" />
        </el-form-item>
        <el-form-item v-if="!isNode" label="图标:" prop="icon" :rules="rules">
          <el-input v-model="operateData.icon" placeholder="icon" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </span>
    </el-dialog>
    <el-backtop></el-backtop>
  </div>
</template>
<script>
import {
  getAsyncRoutes,
  addNode,
  removeRoute,
  addRoute,
  updateRoute
} from '@/api/asyncRoutes'
import { getMeta } from '@/utils/getTreeData'
export default {
  data() {
    // 验证规则
    const validate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请填写完整信息'))
      } else {
        callback()
      }
    }
    const validateLayout = (rule, value, callback) => {
      if (value !== 'Layout') {
        callback(new Error('组件名必须是Layout'))
      } else {
        callback()
      }
    }
    return {
      data: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      dialogVisible: false,
      operateData: {},
      addId: '',
      addnode: '',
      title: '',
      isNode: '',
      operation: '', // 0一级路由添加，1子节点添加，2,一级路由更改，3子节点更改，4一级路由删除，5子节点删除
      // required:必填项，trigger：验证触发方式，validator：表单验证规则
      rules: [{ required: true, trigger: 'blur', validator: validate }],
      Layoutrule: [
        { required: true, trigger: 'blur', validator: validateLayout }
      ],
      updata: '',
      removeData: {},
      asyncRoutes: ''
    }
  },
  created() {
    this.getData()
  },
  methods: {
    async getData() {
      const routes = await getAsyncRoutes()
      routes.data.pop()
      this.asyncRoutes = routes.data
      this.data = getMeta(this.asyncRoutes)
    },
    addRoute() {
      this.title = '添加菜单'
      this.isNode = false
      this.operation = 0
      this.dialogVisible = !this.dialogVisible
    },
    update(data) {
      this.updata = data
      this.title = `修改<${data.title}>该节点`
      if (data.id % 100 === 0) {
        const route = this.asyncRoutes.find((r) => {
          if (r.path === data.path) {
            return r
          }
        })
        this.$set(this.operateData, 'path', route.path)
        this.$set(this.operateData, 'name', route.name)
        this.$set(this.operateData, 'redirect', route.redirect)
        this.$set(this.operateData, 'icon', route.meta.icon)
        this.$set(this.operateData, 'component', route.component)
        this.isNode = false
        this.operation = 2
      } else {
        let route
        this.asyncRoutes.forEach((r) => {
          if (r.children) {
            for (const iterator of r.children) {
              if (iterator.name === data.title) {
                route = iterator
                this.updata.parentNode = r.path
                return
              }
            }
          }
        })
        // this.$set给对象添加属性
        this.$set(this.operateData, 'name', route.meta.title)
        this.$set(this.operateData, 'path', route.path)
        this.$set(this.operateData, 'component', route.component)
        this.isNode = true
        this.operation = 3
      }
      this.dialogVisible = !this.dialogVisible
    },
    addSeed(data) {
      this.title = `添加<${data.title}>子菜单`
      this.isNode = true
      this.operation = 1
      if (data.children == '') {
        this.addId = data.id + 1
      } else {
        this.addId = data.children[data.children.length - 1].id + 1
      }
      this.addnode = data
      this.dialogVisible = !this.dialogVisible
    },
    submit() {
      // 表单验证成功是触发回调
      this.$refs.routeForm.validate(async (valid) => {
        if (valid) {
          if (this.operation == 1) {
            const send = {
              parentNode: this.addnode.path,
              path: this.operateData.path,
              name: this.operateData.name,
              title: this.operateData.name,
              component: this.operateData.component
            }
            const res = await addNode(send)
            if (res.code == 20000) {
              const newChild = {
                id: this.addId,
                title: this.operateData.name
              }
              this.data.forEach((r) => {
                if (r == this.addnode) {
                  if (r.children) {
                    r.children.push(newChild)
                    this.$message({
                      message: '添加子菜单成功！',
                      type: 'success'
                    })
                    this.$router.go(0)
                  }
                }
              })
            } else {
              this.$message.error('添加子菜单失败请重试！')
            }
          }
          if (this.operation == 0) {
            const send = {
              path: this.operateData.path,
              name: this.operateData.name,
              title: this.operateData.name,
              component: this.operateData.component,
              redirect: this.operateData.redirect,
              icon: this.operateData.icon
            }
            const res = await addRoute(send)
            if (res.code == 20000) {
              this.$message({
                message: '新建菜单成功！',
                type: 'success'
              })
              const newChild = {
                id: (this.data.length + 1) * 100,
                title: this.operateData.name,
                children: []
              }
              this.data.push(newChild)
              this.$router.go(0)
            } else {
              this.$message.error('新建失败请重试！')
            }
          }
          if (this.operation == 2) {
            const send = {
              path: this.operateData.path,
              name: this.operateData.name,
              title: this.operateData.name,
              component: this.operateData.component,
              redirect: this.operateData.redirect,
              icon: this.operateData.icon,
              operation: 0,
              parentNode: this.updata.path
            }
            const res = await updateRoute(send)
            if (res.code == 20000) {
              this.$message({
                message: '更改菜单成功！',
                type: 'success'
              })
              this.$router.go(0)
            } else {
              this.$message.error('更改失败请重试！')
            }
          }
          if (this.operation == 3) {
            const send = {
              parentNode: this.updata.parentNode,
              node: this.updata.path,
              path: this.operateData.path,
              name: this.operateData.name,
              title: this.operateData.name,
              component: this.operateData.component,
              operation: 1
            }
            console.log(send)
            const res = await updateRoute(send)
            if (res.code == 20000) {
              this.$message({
                message: '更改子菜单成功！',
                type: 'success'
              })
              this.$router.go(0)
            } 
            else {
              this.$message.error('更改子菜单失败请重试！')
            }
          }
          this.dialogVisible = !this.dialogVisible
        }
      })
    },
    close() {
      for (const key in this.operateData) {
        this.operateData[key] = ''
      }
    },
    remove(node, data) {
      const parent = node.parent
      let children
      if (parent.data.children) {
        children = parent.data.children
        this.removeData.childrenNode = node.data.path
        for (const iterator of this.data) {
          if (iterator.children) {
            for (const childrenNode of iterator.children) {
              if (childrenNode.path == node.data.path) {
                this.removeData.parentNode = iterator.path
              }
            }
          }
        }
        this.removeData.operation = 0
        this.$confirm('是否删除该子菜单', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(async () => {
          const res = await removeRoute(this.removeData)
          if (res.code == 20000) {
            this.$message({
              message: '删除该子菜单成功！',
              type: 'success'
            })
            this.$router.go(0)
          } else {
            this.$message.error('删除失败请重试！')
          }
        }).catch(() => {
        })
      } else {
        children = parent.data
        this.removeData.parentNode = node.data.path
        this.removeData.operation = 1
        this.$confirm('是否删除该菜单', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(async () => {
          const res = await removeRoute(this.removeData)
          if (res.code == 20000) {
            this.$message({
              message: '删除该菜单成功！',
              type: 'success'
            })
            const index = children.findIndex((d) => d.id === data.id)
            children.splice(index, 1)
            this.$router.go(0)
          } else {
            this.$message.error('删除失败请重试！')
          }
        }).catch(() => {
        })
      }

    }
  }
}
</script>
<style lang='scss' scoped>
.wrapper {
  padding: 20px;
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 15px;
    padding-right: 8px;
  }
  .top_button {
    margin-bottom: 10px;
    margin-left: 10px;
  }
}
</style>
