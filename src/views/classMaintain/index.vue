<template>
  <div class="wrapper">
    <div class="addUesr_button">
      <el-button type="primary" @click="addClass()">新建班级</el-button>
    </div>
    <el-table
      :data="
        search
          ? classData.filter((data) =>
              data.className.toLowerCase().includes(search.toLowerCase())
            )
          : classData.slice(
              (currentPage - 1) * pagesize,
              currentPage * pagesize
            )
      "
      style="width: 100%"
    >
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column label="所属系部" prop="faculty"> </el-table-column>
      <el-table-column label="班级名称" prop="className" sortable>
      </el-table-column>
      <el-table-column label="班主任" prop="coordinator"> </el-table-column>
      <el-table-column label="班级人数" prop="number"> </el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-button type="text" @click="viewStudent(scope.row)"
            >查看本班学生</el-button
          >
        </template>
      </el-table-column>
      <el-table-column>
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" placeholder="输入班级名称搜索" />
        </template>
        <template slot-scope="scope">
          <el-button type="primary" @click="editClass(scope.row)"
            >编辑</el-button
          >
          <el-button type="danger" @click="removeClass(scope.row)"
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
      :total="classData.length"
      background
    >
    </el-pagination>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
      @close="close()"
    >
      <el-form :model="classForm" ref="classForm" label-width="120px">
        <el-form-item label="所属系部：" prop="faculty" :rules="rule">
          <el-input v-model="classForm.faculty"></el-input>
        </el-form-item>
        <el-form-item label="班级名称：" prop="className" :rules="rule">
          <el-input v-model="classForm.className"></el-input>
        </el-form-item>
        <el-form-item label="班主任：" prop="coordinator" :rules="rule">
          <el-input v-model="classForm.coordinator"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="stuTitle"
      :visible.sync="stuDialogVisible"
      width="60%"
      top="8vh"
    >
      <el-table
        :data="
          stuSearch
            ? studentData.filter((data) =>
                data.name.toString().includes(stuSearch.toString())
              )
            : studentData.slice(
                (currentPage - 1) * pagesize,
                currentPage * pagesize
              )
        "
        style="width: 100%"
        height="420px"
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
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column label="学号" prop="studentID" sortable>
        </el-table-column>
        <el-table-column label="姓名" prop="name"> </el-table-column>
        <el-table-column label="班级" prop="class"> </el-table-column>
        <el-table-column align="right">
          <template slot="header" slot-scope="scope">
            <el-input v-model="stuSearch" placeholder="输入学生姓名搜索" />
          </template>
        </el-table-column>
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          plain
          :loading="downloadLoading"
          @click="handleDownload"
          >导出名单</el-button
        >
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-backtop></el-backtop>

  </div>
</template>
<script>
import { deepCopy } from '@/utils/auth'
import { getClassInfo, addClass, deleteClass, updateClass, getStudent } from '@/api/class'
export default {
  data() {
    return {
      classData: [],
      downloadLoading: false,
      dialogVisible: false,
      classForm: {
        faculty: '',
        className: '',
        coordinator: '',
      },
      rule: [{ required: true, message: '请输入完整信息', trigger: 'blur' }],
      operation: '',
      title: '',
      search: '',
      stuSearch:'',
      currentPage: 1, // 初始页
      pagesize: 10,    // 每页的数据
      editRow: '',
      stuDialogVisible: false,
      studentData: [],
      stuTitle: ''

    }
  },
  created() {
    this.getClassData()
  },
  methods: {
     handleDownload() {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['', '班级', '学号', '姓名', '邮箱']
          const filterVal = ['class', 'studentID', 'name', 'email']
          const list = this.studentData
          const data = this.formatJson(filterVal, list)
          let index = 1
          data.forEach(row => {
            row.unshift(index)
            index++
          })
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.stuTitle,
            autoWidth: true,
            bookType: 'xlsx'
          })
          this.downloadLoading = false
        })
      
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {

        return v[j]
      }))
    },
    handleSizeChange: function (size) {
      this.pagesize = size;
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
    },
    async getClassData() {
      const res = await getClassInfo()
      this.classData = res.data
    },
    async viewStudent(row) {
      const res = await getStudent({ className: row.className })
      this.studentData = res.data
      this.stuTitle = row.className
      this.stuDialogVisible = true
    },
    addClass() {
      this.operation = 0
      this.title = '新建班级信息'
      this.dialogVisible = true
    },
    editClass(row) {
      this.title = '编辑班级信息'
      this.operation = 1
      this.classForm = deepCopy(row)
      this.dialogVisible = true
      this.editRow = row
    },
    removeClass(row) {
      this.$confirm('是否删除该班级', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const send = {
          className: row.className
        }
        const res = await deleteClass(send)
        if (res.code == 20000) {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.classData.splice(this.classData.findIndex(val => {
            return val.className == row.className
          }), 1)
        } else {
          this.$message.error('删除失败请重试！')
        }
      }).catch(() => {
      });
    },
    submit() {
      this.$refs.classForm.validate(async (valid) => {
        if (valid) {
          if (this.operation == 0) {
            const res = await addClass(this.classForm)
            if (res.code == 20000) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              let newRow = deepCopy(this.classForm)
              newRow.number = 0
              newRow.list = []
              this.classData.push(newRow)
              this.dialogVisible = false
            } else {
              this.$message.error('新建失败请重试！')
            }
          }
          if (this.operation == 1) {
            this.classForm.formeClass = this.editRow.className
            const res = await updateClass(this.classForm)
            if (res.code == 20000) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              let newRow = deepCopy(this.classForm)
              this.classData.splice(this.classData.findIndex(val => {
                return val.className == this.editRow.className
              }), 1, newRow)
              this.dialogVisible = false
            } else {
              this.$message.error('编辑班级信息请重试！')
            }
          }
        }
      })
    },
    close() {
      for (const key in this.classForm) {
        this.classForm[key] = ''
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