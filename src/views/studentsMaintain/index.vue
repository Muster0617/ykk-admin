<template>
  <div class="wrapper">
    <div class="addUesr_button">
      <el-button type="primary" @click="addStudent()">新建学生</el-button>
      <el-select
        v-model="searchClass"
        placeholder="班级查询"
        clearable
        style="position: absolute; right: 30px"
      >
        <el-option
          v-for="(item, index) in classData"
          :key="index"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
    </div>
    <el-table
      :data="
        search
          ? tableData.filter((data) =>
              data.studentID.toString().includes(search.toString())
            )
          : tableData.slice(
              (currentPage - 1) * pagesize,
              currentPage * pagesize
            )
      "
      style="width: 100%"
      @expand-change="expandChange"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="学号">
              <span>{{ props.row.studentID }}</span>
            </el-form-item>
            <el-form-item label="姓名">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="性别">
              <span>{{ props.row.sex }}</span>
            </el-form-item>
            <el-form-item label="班级">
              <span>{{ props.row.class }}</span>
            </el-form-item>
            <el-form-item label="院系">
              <span>{{ props.row.faculty }}</span>
            </el-form-item>
            <el-form-item label="培养类型">
              <span>{{ props.row.type }}</span>
            </el-form-item>
            <el-form-item label="学制">
              <span>{{ props.row.studyLength }}</span>
            </el-form-item>
            <el-form-item label="专业">
              <span>{{ props.row.specialty }}</span>
            </el-form-item>
            <el-form-item label="是否在籍">
              <span>{{ props.row.absentee }}</span>
            </el-form-item>
            <el-form-item label="是否在校">
              <span>{{ props.row.atSchool }}</span>
            </el-form-item>
            <el-form-item label="出生年月">
              <span>{{ props.row.dateBirth }}</span>
            </el-form-item>
            <el-form-item label="民族">
              <span>{{ props.row.national }}</span>
            </el-form-item>
            <el-form-item label="政治面貌">
              <span>{{ props.row.national }}</span>
            </el-form-item>
            <el-form-item label="婚姻状况">
              <span>{{ props.row.maritalStatus }}</span>
            </el-form-item>
            <el-form-item label="通信地址">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item label="电子邮件">
              <span>{{ props.row.email }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="院系" prop="faculty" width="180" sortable>
      </el-table-column>
      <el-table-column label="学号" prop="studentID" width="180">
      </el-table-column>
      <el-table-column label="姓名" prop="name" width="180"> </el-table-column>
      <el-table-column label="班级" prop="class" sortable> </el-table-column>
      <el-table-column label="密码" prop="password" width="120">
      </el-table-column>
      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" placeholder="输入学号搜索" />
        </template>
        <template slot-scope="scope">
          <el-button @click="editStudent(scope.row)">编辑</el-button>
          <el-button type="danger" @click="delStudent(scope.row)"
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
      :total="tableData.length"
      background
    >
    </el-pagination>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="60%"
      top="6vh"
      @close="close()"
    >
      <el-form ref="form" :model="form"  :inline="true" label-width="auto">
        <el-form-item label="学号" prop="studentID">
          <el-input v-model.number="form.studentID" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" :rules="rule">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name" :rules="rule">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="院系" prop="faculty" :rules="rule">
          <el-input v-model="form.faculty"></el-input>
        </el-form-item>
        <el-form-item label="班级" prop="class" :rules="rule">
          <el-select v-model="form.class" placeholder="班级">
            <el-option
              v-for="(item, index) in classData"
              :key="index"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别" prop="sex" :rules="rule">
          <el-radio v-model="form.sex" label="男">男</el-radio>
          <el-radio v-model="form.sex" label="女">女</el-radio>
        </el-form-item>
        
        <el-form-item label="学制" prop="studyLength" :rules="rule">
          <el-input v-model="form.studyLength"></el-input>
        </el-form-item>
        <el-form-item label="培养类型" prop="type" :rules="rule">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option label="研究生" value="研究生"> </el-option>
            <el-option label="本科" value="本科"> </el-option>
            <el-option label="专科" value="专科"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出生年月">
          <el-date-picker
            v-model="form.dateBirth"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="专业" prop="specialty" :rules="rule">
          <el-input v-model="form.specialty"></el-input>
        </el-form-item>
        <el-form-item label="民族" prop="national" :rules="rule">
          <el-input v-model="form.national"></el-input>
        </el-form-item>
        <el-form-item label="政治面貌" prop="politicsStatus" :rules="rule">
          <el-select v-model="form.politicsStatus" placeholder="请选择">
            <el-option label="党员" value="党员"> </el-option>
            <el-option label="共青团员" value="共青团员"> </el-option>
            <el-option label="群众" value="群众"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="婚姻状况">
          <el-input v-model="form.maritalStatus"></el-input>
        </el-form-item>
        <el-form-item label="通信地址">
          <el-input v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item label="电子邮件">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="是否在校">
          <el-switch v-model="form.atSchool"></el-switch>
        </el-form-item>
        <el-form-item label="是否在籍">
          <el-switch v-model="form.absentee"></el-switch>
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
  getStudents,
  addStudent,
  deleteStudent,
  updateStudent,
  getStudentId
} from '@/api/students'
import {
  deepCopy
} from '@/utils/auth'
import {
  getClassInfo
} from '@/api/class'
import {
  scrollTo
} from '@/utils/scroll-to'

export default {
  data() {
    return {
      searchClass: '',
      search: '',
      copyTableData: [],
      tableData: [],
      dialogVisible: false,
      rule: [{
        required: true,
        message: '请输入完整信息',
        trigger: 'blur'
      }],
      form: {
        studentID: '',
        name: '',
        sex: '男',
        class: '',
        faculty: '',
        type: '',
        studyLength: '',
        specialty: '',
        atSchool: true,
        absentee: true,
        dateBirth: '',
        national: '',
        politicsStatus: '',
        maritalStatus: '',
        address: '',
        email: '',
        password: 1
      },
      classData: [],
      isEdit: false,
      currentPage: 1, //初始页
      pagesize: 10, //    每页的数据
      editRow: '',
      title: ''
    }
  },
  watch: {
    searchClass(val) {
      if (val) {
        if (this.copyTableData.length == 0) {
          this.copyTableData = deepCopy(this.tableData)
        }
        this.tableData = this.copyTableData.filter(row => {
          return row.class == val
        })
      } else {
        this.tableData = this.copyTableData
      }
    }
  },
  async mounted() {
    const res = await getStudents()
    const {
      data
    } = await getClassInfo()
    this.tableData = res.data
    for (const iterator of data) {
      this.classData.push(iterator.className)
    }
  },
  methods: {
    handleSizeChange: function (size) {
      this.pagesize = size;
      scrollTo(0, 400)
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
      scrollTo(0, 400)
    },
    async addStudent() {
      this.dialogVisible = true
      const res = await getStudentId()
      this.form.studentID = res.data.studentID
      this.title = "新增学生"
      this.isEdit = false
    },
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          if (!this.isEdit) {
            console.log(this.form)
            const res = await addStudent(this.form)
            if (res.code == 20000) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              let newRow = deepCopy(this.form)
              this.tableData.push(newRow)
              this.dialogVisible = false
            } else {
              this.$message.error('添加失败请重试！')
            }
          } else {
            const res = await updateStudent(this.form)
            if (res.code == 20000) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              let newRow = deepCopy(this.form)
              this.tableData.splice(this.tableData.findIndex(val => {
                return val.id == this.editRow.id
              }), 1, newRow)
              this.dialogVisible = false
            } else {
              this.$message.error('编辑失败请重试！')
            }
          }
        }
      })
    },
    editStudent(row) {
      console.log(row)
      this.form = deepCopy(row)
      if (typeof this.form.atSchool !== "boolean") {
        this.form.atSchool == "是" ? this.form.atSchool = true : this.form.atSchool = false
      } 
      if (typeof this.form.absentee !== "boolean") {
        this.form.absentee == "是" ? this.form.absentee = true : this.form.absentee = false
      } 
      this.dialogVisible = true
      this.isEdit = true
      this.editRow = row
      this.title = "编辑"


    },
    expandChange(row) {
      if (typeof row.atSchool == "boolean") {
        row.atSchool = row.atSchool == true ? '是' : '否'
      }
      if (typeof row.absentee == "boolean") {
        row.absentee = row.absentee == true ? '是' : '否'
      }
    },
    delStudent(row) {
      this.$confirm('是否删除该用户', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await deleteStudent(row)
        if (res.code == 20000) {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.tableData.splice(this.tableData.findIndex(val => {
            return val.id == row.id
          }), 1)
        } else {
          this.$message.error('删除失败请重试！')
        }
      }).catch(() => { });
    },
    close() {
      for (const key in this.form) {
        this.form[key] = ''
        if (key == 'absentee') {
          this.form[key] = true
        }
        if (key == 'atSchool') {
          this.form[key] = true
        }
        if (key == 'password') {
          this.form[key] = 1
        }
      }

    }
  }
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