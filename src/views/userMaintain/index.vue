<template>
  <div class="wrapper">
    <div class="addUesr_button">
      <el-button type="primary"   @click="addUser()">新建教师</el-button>
    </div>
    <el-table
      :data="
        search
          ? userData.filter((data) =>
              data.username.toLowerCase().includes(search.toLowerCase())
            )
          : userData.slice((currentPage - 1) * pagesize, currentPage * pagesize)
      "
      style="width: 100%"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="教师名称:">
              <span>{{ props.row.teacherName }}</span>
            </el-form-item>
            <el-form-item label="教学班级:">
              <span
                v-for="item in props.row.teacherClass"
                style="margin-right: 10px"
                >{{ item }}</span
              >
            </el-form-item>
            <el-form-item label="教学科目:">
              <span>{{ props.row.teacherSubject }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="用户名" prop="username"> </el-table-column>
      <el-table-column label="角色" prop="name"> </el-table-column>
      <!-- <el-table-column label="密码" prop="password"> </el-table-column> -->
      <el-table-column label="角色" prop="name"> </el-table-column>
      <el-table-column>
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" placeholder="输入用户名搜索" />
        </template>
        <template slot-scope="scope">
          <el-button type="primary" @click="editUser(scope.row)"
            >编辑</el-button
          >
          <el-button type="danger" @click="removeUser(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange" 
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 20]"  
      :page-size="pagesize" 
      layout="total, sizes, prev, pager, next, jumper"
      :total="userData.length" 
      background
    >
    </el-pagination>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
      @close="close()"
      :close-on-click-modal="false"
      top="8vh"
    >
      <el-form :model="userForm" ref="userForm" label-width="120px">
        <el-form-item label="用户名：" prop="username" :rules="rule">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password" :rules="rule">
          <el-input v-model="userForm.password"></el-input>
        </el-form-item>
        <el-form-item label="教师名称：" prop="teacherName" :rules="rule">
          <el-input v-model="userForm.teacherName"></el-input>
        </el-form-item>
        <el-form-item label="教学班级：" prop="teacherClass" :rules="rule">
          <el-select
            v-model="userForm.teacherClass"
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="item in classData"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="教学科目：" prop="teacherSubject" :rules="rule">
          <el-input v-model="userForm.teacherSubject"></el-input>
        </el-form-item>
        <el-form-item label="角色：" prop="role" :rules="rule">
          <el-radio-group v-model="userForm.role">
            <el-radio
              v-for="(item, index) in infoData"
              :key="index"
              :label="item"
            ></el-radio>
          </el-radio-group>
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
import { getUsers, addUser, deleteUser, editUser } from '@/api/user'
import { deepCopy } from '@/utils/auth'
import { getInfos } from '@/api/infos'
import { getClassInfo } from '@/api/class'

export default {
  data() {
    return {
      userData: [],
      infoData: [],
      dialogVisible: false,
      newPasswordDialogVisible: false,
      userForm: {
        username: '',
        password: '',
        role: '',
        teacherSubject: '',
        teacherName: '',
        teacherClass: []
      },
      rule: [{ required: true, message: '请输入完整信息', trigger: 'blur' }],
      operation: '',//0新建用户,1编辑,2更改密码
      row: '',
      title: '',
      classData: [],
      search: '',
      currentPage: 1, // 初始页
      pagesize: 10,    // 每页的数据
      editRow:''

    }
  },
  created() {
    this.getUserData()
    this.getInfoData()
    this.getClassData()
  },
  methods: {
    handleSizeChange: function (size) {
      this.pagesize = size;
      console.log(this.pagesize)  //每页下拉显示数据
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
      console.log(this.currentPage)  //点击第几页
    },
    async getUserData() {
      const res = await getUsers()
      if (res.code == 20000) {
        this.userData = res.data
      } else {
        this.userData = []
      }
    },
    async getInfoData() {
      const res = await getInfos()
      if (res.code == 20000) {
        for (const iterator of res.data) {
          this.infoData.push(iterator.name)
        }
      } else {
        this.infoData = []
      }
    },
    async getClassData() {
      const res = await getClassInfo()
      if (res.code == 20000) {
        for (const iterator of res.data) {
          this.classData.push(iterator.className)
        }
      } else {
        this.classData = []
      }
    },
    addUser() {
      this.operation = 0
      this.title = '新建教师'
      this.dialogVisible = true
    },
    editUser(row) {
      this.title = '编辑教师'
      this.operation = 1
      this.userForm = deepCopy(row)
      this.$set(this.userForm, 'role', row.name)
      console.log(this.userForm)
      this.dialogVisible = true
      this.editRow = row
    },
    removeUser(row) {
      this.$confirm('是否删除该用户', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const send = {
          userId: row.userId
        }
        const res = await deleteUser(send)
        if (res.code == 20000) {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.userData.splice(this.userData.findIndex(val => {
            return val.userId == row.userId
          }), 1)
        } else {
          this.$message.error('删除失败请重试！')
        }
      }).catch(() => {
      });
    },
    submit() {
      this.$refs.userForm.validate(async (valid) => {
        if (valid) {
          if (this.operation == 0) {
            console.log(this.userForm)
            const res = await addUser(this.userForm)
            if (res.code == 20000) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              let newRow = deepCopy(this.userForm)
              newRow.name=newRow.role
              this.userData.push(newRow)
              this.dialogVisible = false
            } else {
              this.$message.error('新建失败请重试！')
            }
          }
          if (this.operation == 1) {
            const send = {
              ...this.userForm, name: this.userForm.role, token: '',userId: this.editRow.userId
            }
            delete send.role
            const res = await editUser(send)
            if (res.code == 20000) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              let newRow = deepCopy(this.userForm)
              newRow.name=newRow.role
              this.userData.splice(this.userData.findIndex(val => {
                return val.userId == this.editRow.userId
              }), 1, newRow)
              this.dialogVisible = false
            } else {
              this.$message.error('编辑用户失败请重试！')
            }
          }
          this.dialogVisible = false
        }
      })
    },
    close() {
      for (const key in this.userForm) {
        this.userForm[key] = ''
      }
    },
  },


}
</script>
<style lang='scss' scoped>
.wrapper {
  padding: 20px;
  .el-pagination {
   margin-top: 20px;
    margin-left: 20px;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .addUesr_button {
    margin-bottom: 10px;
    margin-left: 10px;
  }
}
</style>