<template>
  <div class="roleMaintain_wrapper">
    <div class="roleMaintain_button">
      <el-button type="primary" @click="addRole()">新建角色</el-button>
      <el-button type="warning" @click="addPermission()"
        >新建角色权限</el-button
      >
    </div>
    <el-table
      :data="roleData"
      border
      style="width: 100%"
      @cell-click="cellClick"
    >
      <el-table-column type="index" align="center" />
      <el-table-column
        prop="name"
        label="角色名称"
        align="center"
        width="240"
      />
      <el-table-column prop="introduction" align="center" width="200" label="角色描述" />
      <el-table-column prop="roles" align="center" label="标识" width="160" />
      <el-table-column align="center" label="维护">
        <el-button type="primary" @click="editRole()"
          >编辑角色信息和角色路由</el-button
        >
        <el-button type="primary" @click="editPermission()"
          >编辑角色权限</el-button
        >
        <el-button type="danger" @click="removeInfo()">删除</el-button>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="40%"
      top="5vh"
      @close="close"
      :close-on-click-modal="false"
    >
      <el-form ref="addForm" :model="infoFrom" label-width="90px">
        <el-form-item label="角色名称:" prop="name" :rules="rule">
          <el-input v-model="infoFrom.name" />
        </el-form-item>
        <el-form-item label="角色描述:" prop="introduction" :rules="rule">
          <el-input v-model="infoFrom.introduction" />
        </el-form-item>
        <el-form-item label="标识:" prop="roles" :rules="rule">
          <el-input v-model="infoFrom.roles" />
        </el-form-item>
        <el-form-item label="路由树:">
          <el-tree
            ref="roleTree"
            :data="treeData"
            show-checkbox
            node-key="id"
            default-expand-all
            :props="routeProps"
            :expand-on-click-node="false"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑角色权限"
      :visible.sync="dialogPermission"
      width="50%"
      :close-on-click-modal="false"
    >
      <el-table
        ref="multipleTable"
        :data="permissionData"
        tooltip-effect="dark"
        style="width: 100%"
        @cell-click="permissionCellClick"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="component" label="组件" align="center">
        </el-table-column>
        <el-table-column prop="node" label="节点" align="center">
        </el-table-column>
        <el-table-column prop="unit" label="单元" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <el-button type="primary" @click="editPermissionData()"
            >编辑</el-button
          >
          <el-button type="danger" @click="removePermission()">删除</el-button>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogPermission = false">取 消</el-button>
        <el-button type="primary" @click="amendPermission()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="新建角色权限"
      :visible.sync="dialogAddPermission"
      width="30%"
      @close="close"
      :close-on-click-modal="false"
    >
      <el-form
        :model="permissionForm"
        ref="addPermissionForm"
        label-width="90px"
      >
        <el-form-item label="组件：" prop="component" :rules="rule">
          <el-input v-model="permissionForm.component"></el-input>
        </el-form-item>
        <el-form-item label="节点：" prop="node" :rules="rule">
          <el-input v-model="permissionForm.node"></el-input>
        </el-form-item>
        <el-form-item label="单元：" prop="unit" :rules="rule">
          <el-input v-model="permissionForm.unit"></el-input>
        </el-form-item>
        <el-form-item label="权限分配：">
          <el-checkbox-group v-model="checkList">
            <el-checkbox
              v-for="(item, index) in roleData"
              :key="index"
              :label="item.roles"
            ></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddPermission = false">取 消</el-button>
        <el-button type="primary" @click="permissionSubmit()">确 定</el-button>
      </span>
    </el-dialog>
    <el-backtop></el-backtop>
  </div>
</template>
<script>
import { getAllPermission, addPermission, deletePermission, updatePermission, revampPermission } from '@/api/permission'
import { getInfos, addInfo, deleteInfo, updateInfo } from '@/api/infos'
import { getAsyncRoutes } from '@/api/asyncRoutes'
import { getRole } from '@/utils/getTreeData'
export default {
  data() {
    return {
      roleData: [],
      rule: [{ required: true, message: '请输入完整信息', trigger: 'blur' }],
      infoFrom: {
        introduction: '',
        roles: '',
        name: '',
      },
      permissionForm: {
        component: '',
        node: "",
        unit: ''
      },
      checkList: [],
      dialogVisible: false,
      dialogPermission: false,
      dialogAddPermission: false,
      treeData: [],
      permissionData: [],
      routeProps: {
        children: 'children',
        label: 'label',
      },
      row: '',
      title: '',
      operation: '', // 0新建，1编辑角色或路由，2编辑权限
      allTree: [],
      multipleSelection: '',
      permissionRow: '',
      permissionOperation: ''
    }
  },
  created() {
    this.getRoleData()
    this.getRouteData()
    this.getPermissionData()
  },
  methods: {
    async getRoleData() {
      const { data } = await getInfos()
      this.roleData = data
    },
    async getPermissionData() {
      const { data } = await getAllPermission()
      this.permissionData = data
    },
    async getRouteData() {
      const routes = await getAsyncRoutes()
      routes.data.pop()
      this.treeData = getRole(routes.data)
      for (let tree of this.treeData) {
        this.allTree.push(tree)
        if (tree.children) {
          for (let children of tree.children) {
            this.allTree.push(children)
          }
        }
      }
    },
    addPermission() {
      this.dialogAddPermission = true
      this.permissionOperation = 0
    },
    async amendPermission() {
      let ary = []
      if (this.multipleSelection) {
        for (const iterator of this.multipleSelection) {
          ary.push(iterator.permissionId)
        }
      }
      const send = {
        roles: this.row.roles,
        permissionId: ary
      }
      const res = await revampPermission(send)
      if (res.code === 20000) {
        this.$message({
          message: res.msg,
          type: 'success',
        })
        this.$router.go(0)
      } else {
        this.$message.error('修改失败请重试')
      }
      this.dialogPermission = false
    },
    removePermission() {
      this.$confirm('是否删除该角色权限', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const send = {
          permissionId: this.permissionRow.permissionId
        }
        const res = await deletePermission(send)
        if (res.code === 20000) {
          this.$message({
            message: res.msg,
            type: 'success',
          })
          this.$router.go(0)
        } else {
          this.$message.error('删除失败请重试')
        }
      }).catch(() => {
      });
    },
    permissionSubmit() {
      this.$refs.addPermissionForm.validate(async (valid) => {
        if (valid) {
          if (this.permissionOperation == 0) {
            const send = {
              component: this.permissionForm.component,
              node: this.permissionForm.node,
              unit: this.permissionForm.unit,
              roles: this.checkList
            }
            const res = await addPermission(send)
            if (res.code === 20000) {
              this.$message({
                message: res.msg,
                type: 'success',
              })
              this.$router.go(0)
            } else {
              this.$message.error(res.msg)
            }
          }
          if (this.permissionOperation == 1) {
            const send = {
              component: this.permissionForm.component,
              node: this.permissionForm.node,
              unit: this.permissionForm.unit,
              roles: this.checkList,
              permissionId: this.permissionForm.permissionId
            }
            const res = await updatePermission(send)
            if (res.code === 20000) {
              this.$message({
                message: res.msg,
                type: 'success',
              })
              this.$router.go(0)
            } else {
              this.$message.error('修改失败请重试')
            }
          }

          this.dialogAddPermission = false
        }
      })
    },
    editPermissionData() {
      this.dialogAddPermission = true
      const setTime = setTimeout(() => {
        this.$set(this.permissionForm, 'component', this.permissionRow.component)
        this.$set(this.permissionForm, 'unit', this.permissionRow.unit)
        this.$set(this.permissionForm, 'node', this.permissionRow.node)
        this.$set(this.permissionForm, 'permissionId', this.permissionRow.permissionId)
        this.checkList = this.permissionRow.roles
        this.permissionOperation = 1
        clearTimeout(setTime)
      }, 0)
    },
    editPermission() {
      const setTime = setTimeout(() => {
        this.$refs.multipleTable.clearSelection()
        this.$nextTick(() => {
          this.permissionData.forEach((r) => {
            if (r.roles.indexOf(this.row.roles) !== -1) {
              this.$refs.multipleTable.toggleRowSelection(r, true)
            }
          })
        })
        clearTimeout(setTime)
      }, 0)
      this.dialogPermission = true
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    close() {
      this.infoFrom.roles = ''
      this.infoFrom.introduction = ''
      this.infoFrom.name = ''
      this.permissionForm.component = ''
      this.permissionForm.node = ''
      this.permissionForm.unit = ''
      this.checkList = []
    },
    addRole() {
      this.title = '新建角色'
      this.operation = 0
      this.dialogVisible = true
      this.$nextTick(() => {
        this.allTree.forEach((r) => {
          this.$refs.roleTree.setChecked(r, true, false)
        })
      })
    },
    editRole() {
      this.title = '编辑角色信息和角色路由'
      this.operation = 1
      this.dialogVisible = true
      const timeOut = setTimeout(() => {
        this.$set(this.infoFrom, 'introduction', this.row.introduction)
        this.$set(this.infoFrom, 'name', this.row.name)
        this.$set(this.infoFrom, 'roles', this.row.roles)
        this.$nextTick(() => {
          const ary = []
          this.allTree.forEach((r) => {
            this.$refs.roleTree.setChecked(r, false, false)
          })
          for (let tree of this.treeData) {
            if (tree.roles.includes(this.row.roles)) {
              ary.push(tree.id)
            }
            if (tree.children) {
              for (let children of tree.children) {
                if (children.roles.includes(this.row.roles)) {
                  ary.push(children.id)
                  if (ary.indexOf(tree.id) !== -1) {
                    ary.splice(ary.indexOf(tree.id), 1)
                  }
                }
              }
            }
          }
          ary.forEach((r) => {
            this.$refs.roleTree.setChecked(r, true, true)
          })
        })
        clearTimeout(timeOut)
      }, 0)
    },
    submit() {
      this.$refs.addForm.validate(async (valid) => {
        if (valid) {
          if (this.operation === 0) {
            const check = this.$refs.roleTree.getCheckedNodes()
            let selected = []
            for (const item of check) {
              if (item.id % 100 !== 0) {
                let parent = this.treeData.find(row => {
                  return row.children.indexOf(item) !== -1
                })
                selected.push({parentNode:parent.path,sonNode:item.path})
              }
            }
            const send = {
              roles: this.infoFrom.roles,
              introduction: this.infoFrom.introduction,
              selected: selected,
              name: this.infoFrom.name,
            }
            console.log(send)
            const res = await addInfo(send)
            if (res.code === 20000) {
              this.$message({
                message: res.msg,
                type: 'success',
              })
              this.$router.go(0)
            } else {
              this.$message.error('新建失败请重试')
            }
          }
          if (this.operation == 1) {
            const check = this.$refs.roleTree.getCheckedNodes()
            let selected = []
            for (const item of check) {
              if (item.id % 100 !== 0) {
                let parent = this.treeData.find(row => {
                  return row.children.indexOf(item) !== -1
                })
                selected.push({parentNode:parent.path,sonNode:item.path})
              }
            }
            let send = {
              selected: selected,
              formerRoles: this.row.roles,
              roles: this.infoFrom.roles,
              introduction: this.infoFrom.introduction,
              name: this.infoFrom.name,
            }

            const res = await updateInfo(send)
            if (res.code === 20000) {
              this.$message({
                message: res.msg,
                type: 'success',
              })
              this.$router.go(0)
            } else {
              this.$message.error('编辑失败请重试')
            }

          }
          this.dialogVisible = false
        }
      })
    },
    removeInfo() {
      this.$confirm('是否删除该角色', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const send = {
          roles: this.row.roles,
        }
        const res = await deleteInfo(send)
        if (res.code === 20000) {
          this.$message({
            message: res.msg,
            type: 'success',
          })
          this.$router.go(0)
        } else {
          this.$message.error('删除失败请重试！')
        }
      }).catch(() => {
      });
    },
    cellClick(row) {
      this.row = row
    },
    permissionCellClick(row) {
      this.permissionRow = row

    }
  },
}
</script>
<style lang='scss' scoped>
.roleMaintain_wrapper {
  padding: 20px;
  .roleMaintain_button {
    margin-bottom: 10px;
    margin-left: 10px;
  }
}
</style>
