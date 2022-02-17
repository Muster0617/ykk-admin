<template>
  <div class="wrapper" v-loading.fullscreen="fullscreenLoading">
    <div class="addTopic_button">
      <div>
        <el-button
          @click="addTopicBank()"
          type="warning"
          v-if="checkPermission(addRole)"
          >新增题库</el-button
        >
        <el-button @click="addTopic()" type="info">新增题目</el-button>
      </div>
      <div v-if="checkPermission(delRole)">
        <el-select v-model="topicBank" placeholder="请选择">
          <el-option
            v-for="item in regimentation"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
        <el-button
          @click="delTopicBank()"
          type="danger"
          style="margin-left: 10px"
          >删除题库</el-button
        >
      </div>
    </div>
    <el-tabs
      type="border-card"
      v-model="activeName"
      @tab-click="handleClick"
      style="margin-top: 15px"
    >
      <el-tab-pane
        :label="item"
        :name="item"
        v-for="(item, index) in regimentation"
        :key="index"
      >
        <el-table
          :data="
            search
              ? topicData.filter((data) =>
                  data.topic.toString().includes(search.toString())
                )
              : topicData
          "
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="A:">
                  <span>{{ props.row.optionA }}</span>
                </el-form-item>
                <el-form-item label="B:">
                  <span>{{ props.row.optionB }}</span>
                </el-form-item>
                <el-form-item label="C:">
                  <span>{{ props.row.optionC }}</span>
                </el-form-item>
                <el-form-item label="D:">
                  <span>{{ props.row.optionD }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column type="index" width="50"> </el-table-column>
          <el-table-column prop="topic" label="题目"> </el-table-column>
          <el-table-column prop="answer" label="答案" width="320px">
          </el-table-column>
          <el-table-column align="right" width="280px">
            <template slot="header" slot-scope="scope">
              <el-input v-model="search" placeholder="输入题目名称搜索" />
            </template>
            <template slot-scope="scope">
              <el-button @click="editTopic(scope.row)">编辑</el-button>
              <el-button type="danger" @click="delTopic(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="38%"
      @close="close()"
      top="8vh"
      :append-to-body="true"
    >
      <el-form ref="form" :model="form" label-width="auto">
        <el-form-item label="所属题库" prop="category" :rules="rule">
          <el-select v-model="form.category" placeholder="请选择">
            <el-option
              v-for="item in regimentation"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题目" prop="topic" :rules="rule">
          <el-input v-model="form.topic" style="max-width: 380px"></el-input>
        </el-form-item>
        <el-form-item label="选项A:" prop="optionA" :rules="rule">
          <el-input v-model="form.optionA" style="max-width: 380px"></el-input>
        </el-form-item>
        <el-form-item label="选项B:" prop="optionB" :rules="rule">
          <el-input v-model="form.optionB" style="max-width: 380px"></el-input>
        </el-form-item>
        <el-form-item label="选项C:" prop="optionC" :rules="rule">
          <el-input v-model="form.optionC" style="max-width: 380px"></el-input>
        </el-form-item>
        <el-form-item label="选项D:" prop="optionD" :rules="rule">
          <el-input v-model="form.optionD" style="max-width: 380px"></el-input>
        </el-form-item>
        <el-form-item label="答案" prop="answer" :rules="rule">
          <el-radio-group v-model="form.answer" size="small">
            <el-radio-button label="A">A</el-radio-button>
            <el-radio-button label="B">B</el-radio-button>
            <el-radio-button label="C">C</el-radio-button>
            <el-radio-button label="D">D</el-radio-button>
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
import { getTopics, deleteTopicBank, addTopicBank, getTopicBank, addTopic, deleteTopic, updateTopic } from '@/api/topics'
import { getPermission } from '@/api/permission'
import checkPermission from '@/utils/permission'
import { deepCopy } from '@/utils/auth'
export default {
  data() {
    return {
      topicBank: '',
      activeName: '',
      regimentation: [],
      topics: '',
      topicData: [],
      search: '',
      dialogVisible: false,
      rule: [{ required: true, message: '请输入完整信息', trigger: 'blur' }],
      form: {
        category: '',
        topic: '',
        answer: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
      },
      title: '',
      isEdit: false,
      editRow: '',
      delRole: '',
      addRole: '',
      fullscreenLoading: false
    }
  },
  created() {
    this.getTopicData()
    this.getRole()
  },
  methods: {
    checkPermission,
    async getRole() {
      this.fullscreenLoading = true
      const res = await Promise.all([getPermission({ component: 'topicArrange', node: 'index', unit: 'delTopicBank' }), getPermission({ component: 'topicArrange', node: 'index', unit: 'addTopicBank' })])
      this.delRole = res[0].data
      this.addRole = res[1].data
      this.fullscreenLoading = false
    },
    delTopicBank() {
      if (this.topicBank) {
        this.$confirm('此操作将永久删除整个, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await deleteTopicBank({ category: this.topicBank })
          if (res.code == 20000) {
            this.$message({
              type: 'success',
              message: res.msg
            });
            let index = this.regimentation.indexOf(this.topicBank)
            this.regimentation.splice(index, 1)
            this.topicBank = ''
          }
        })
      }
    },
    addTopicBank() {
      this.$prompt('请输入题库名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '请输入正确题库名'
      }).then(async ({ value }) => {
        let res = await addTopicBank({ category: value })
        if (res.code == 20000) {
          this.$message({
            type: 'success',
            message: res.msg
          });
          this.regimentation.push(value)
        } else {
          this.$message({
            type: 'error',
            message: res.msg
          });
        }
      })
    },
    async handleClick(tab, event) {
      let res = await getTopics({ category: this.activeName })
      if (res.code == 20000) {
        this.topicData = res.data
      }
    },
    dataUpdate() {
      this.getTopicData()
      this.topicData = this.topics.filter((row) => {
        return row.category == this.isType
      })
    },
    async getTopicData() {
      const res = await getTopicBank()
      if (res.code == 20000) {
        this.regimentation = res.data
      }
      if (this.regimentation.length !== 0) {
        this.activeName = this.regimentation[0]
        this.handleClick()
      }
    },
    addTopic() {
      this.title = "新增题目"
      this.dialogVisible = true
    },
    editTopic(row) {
      this.title = "编辑"
      this.form = deepCopy(row)
      this.isEdit = true
      this.dialogVisible = true
      this.editRow = row
    },
    delTopic(row) {
      this.$confirm('是否删除该题目', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await deleteTopic(row)
        if (res.code == 20000) {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.topicData.splice(this.topicData.findIndex(val => {
            return val.id == row.id
          }), 1)
        } else {
          this.$message.error('删除失败请重试！')
        }
      }).catch(() => {
      });
    },
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          if (!this.isEdit) {
            const res = await addTopic(this.form)
            if (res.code == 20000) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              let newRow = deepCopy(this.form)
              if (this.activeName == this.form.category) {
                this.topicData.push(newRow)
              }
              this.dialogVisible = false
            } else {
              this.$message.error('添加失败请重试！')
            }
          } else {
            const res = await updateTopic(this.form)
            if (res.code == 20000) {
              this.$message({
                message: res.msg,
                type: 'success'
              })
              let newRow = deepCopy(this.form)
              this.topicData.splice(this.topicData.findIndex(val => {
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
    close() {
      this.isEdit = false
      for (const key in this.form) {
        this.form[key] = ''
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.wrapper {
  width: 100%;
  height: 100%;
  padding: 20px;
  .addTopic_button {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .radio {
    width: 100%;
    margin: 20px;
  }
  .table {
    width: 100%;
    .el-pagination {
      position: absolute;
      top: 20px;
      right: 20px;
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
  }
}
</style>
