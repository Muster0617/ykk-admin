<template>
  <div class="wrapper">
    <el-steps :active="active" finish-status="success" simple>
      <el-step title="填写考试详情"> </el-step>
      <el-step title="选择题库"> </el-step>
      <el-step title="选择考试题目"> </el-step>
      <el-step title="确认考试"> </el-step>
    </el-steps>
    <div v-show="active == 0" class="active_style">
      <div class="form_style">
        <el-form
          :label-position="labelPosition"
          label-width="80px"
          :model="infoForm"
          hide-required-asterisk
          ref="infoForm"
        >
          <el-form-item label="考试编号:">
            <el-input v-model="infoForm.testSerial" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item
            label="考试名称:"
            prop="testName"
            :rules="[{ required: true, message: '请填写完整的信息' }]"
          >
            <el-input v-model="infoForm.testName"></el-input>
          </el-form-item>
          <el-form-item
            label="考试班级"
            prop="testClass"
            :rules="[
              { required: true, message: '请填写完整的信息', trigger: 'blur' },
            ]"
          >
            <el-select
              v-model="infoForm.testClass"
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
          <el-form-item
            label="考试日期:"
            prop="testDate"
            :rules="[{ required: true, message: '请填写完整的信息' }]"
          >
            <el-date-picker
              v-model="infoForm.testDate"
              type="date"
              value-format="yyyy-MM-dd"
              format="yyyy 年 MM 月 dd 日"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item
            label="考试时间:"
            prop="startTime"
            :rules="[{ required: true, message: '请填写完整的信息' }]"
          >
            <el-time-select
              placeholder="选择时间"
              v-model="infoForm.startTime"
              :picker-options="{
                start: '08:30',
                step: '00:15',
                end: '18:30',
              }"
            >
            </el-time-select>
          </el-form-item>
          <el-form-item
            label="考试时长:"
            prop="testTime"
            :rules="[
              { required: true, message: '请填写完整的信息' },
              { type: 'number', message: '考试时长必须为数字值' },
            ]"
          >
            <el-input
              v-model.number="infoForm.testTime"
              style="width: 220px"
            ></el-input>
          </el-form-item>
          <el-form-item size="large">
            <el-button type="primary" plain @click="next('ensureInfo')"
              >下一步</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div v-show="active == 1">
      <div style="margin: 20px">
        <el-radio
          v-model="isType"
          :label="val"
          border
          v-for="(val, index) in regimentation"
          :key="index"
          >{{ val }}</el-radio
        >
      </div>
      <div class="button_group">
        <el-button plain @click="back()" style="margin-right: 20px"
          >上一步</el-button
        >
        <el-button type="primary" plain @click="next('select')"
          >下一步</el-button
        >
      </div>
    </div>
    <div v-show="active == 2">
      <el-table
        ref="multipleTable"
        :data="topicData"
        tooltip-effect="dark"
        style="width: 100%"
        height="450px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
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
        <el-table-column prop="topic" label="题目"> </el-table-column>
        <el-table-column prop="answer" label="答案" width="200">
        </el-table-column>
      </el-table>
      <div class="button_group_three">
        <div class="alreadySelect_stlye">
          已选：{{ this.infoForm.testTopics.length }}
        </div>
        <div>
          <el-button plain @click="back()" style="margin-right: 20px"
            >上一步</el-button
          >
          <el-button type="primary" plain @click="next('confirm')"
            >下一步</el-button
          >
        </div>
        <div>
          <el-button plain @click="getRandomTopic()">随机选择</el-button>
        </div>
      </div>
    </div>
    <div v-show="active == 3">
      <div style="margin-top: 20px">
        <el-table :data="[infoForm]" border style="width: 100%">
          <el-table-column
            prop="testSerial"
            label="考试编号"
            width="100px"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="testName"
            label="考试名称"
            width="200px"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="testDate"
            label="考试日期"
            width="120px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="testClass" label="考试班级" align="center">
          </el-table-column>
          <el-table-column
            prop="startTime"
            label="考试时间"
            width="140px"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="testTime"
            label="考试时长"
            width="140px"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="testTopics.length"
            label="考试题数"
            width="140px"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="topicScore"
            label="每题得分"
            width="140px"
            align="center"
          >
          </el-table-column>
        </el-table>
      </div>
      <div class="button_group">
        <el-button plain @click="back()">上一步</el-button>
        <el-button type="primary" plain @click="next('submit')"
          >确认提交</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import { getTopics, getTopicBank, getSerials, addArrange } from '@/api/topics'
import { deepCopy } from '@/utils/auth'

export default {
  data() {
    return {
      labelPosition: 'right',
      active: 0,
      classData: [],
      infoForm: {
        testSerial: '',
        testName: '',
        testDate: '',
        testClass: '',
        startTime: '',
        testTime: '',
        testTopics: [],
        topicScore: 0
      },
      topicData: [],
      topics: [],
      multipleSelection: [],
      currentPage: 1, //初始页
      pagesize: 6,    //    每页的数据
      regimentation: [],
      isType: '',
    };
  },
  mounted() {
    this.getClassData()
    this.getTopicData()
    this.getSerial()

  },
  methods: {
    async getSerial() {
      const res = await getSerials()
      if (res.code == 20000) {
        this.infoForm.testSerial = res.data.testSerial
      }
    },
    getClassData() {
      if (this.$store.getters.userInfo.teacherClass.length!==0) {
        for (const iterator of this.$store.getters.userInfo.teacherClass) {
          this.classData.push(iterator)
        }
      }
    },
    getRandomTopic() {
      this.$prompt('请输入随机选择题数', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[0-9]*$/,
        inputErrorMessage: '请输入数字'
      }).then(({ value }) => {
        this.$refs.multipleTable.clearSelection()
        let ary = []
        let number
        if (this.topicData.length >= value) {
          number = this.topicData.length - value
        } else {
          number = 0
        }
        for (let index = number; index < this.topicData.length; index++) {
          let num = Math.floor(Math.random() * (this.topicData.length));
          if (ary.indexOf(num) == -1) {
            ary.push(num)
            console.log(ary)
            this.$refs.multipleTable.toggleRowSelection(this.topicData[num]);
          } else {
            index--
          }
        }
      }).catch(() => {

      });

    },
    async getTopicData() {
      const res = await getTopicBank()
      if (res.code == 20000) {
        this.regimentation = res.data
      }
    },
    async next(operator) {
      if (operator == 'ensureInfo') {
        this.$refs.infoForm.validate((valid) => {
          if (valid) {
            if (this.active < 3) {
              this.active++
            }
          }
        })
      }
      if (operator == 'select') {
        if (this.isType) {
          const res = await getTopics({ category: this.isType })
          if (res.code == 20000) {
            this.topicData = res.data
          }
          if (this.active < 3) {
            this.active++
          }
        }
        else {
          this.$message({
            message: '请选择题库类型',
            type: 'warning'
          });
        }
      }
      if (operator == 'confirm') {
        if (this.infoForm.testTopics.length > 0) {
          if (this.active < 3) {
            this.$prompt('请输入每题得分', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              inputPattern: /\d/,
              inputErrorMessage: '分数格式不正确'
            }).then(({ value }) => {
              this.infoForm.topicScore = value
              this.active++
            }).catch(() => {
            });
          }
        } else {
          this.$message({
            message: '请选择考试题目',
            type: 'warning'
          });
        }
      }
      if (operator == 'submit') {
        let topicsID = []
        this.infoForm.testTopics.forEach(row => {
          topicsID.push(row.id)
        })
        let data = deepCopy(this.infoForm)
        data.testTopics = topicsID
        data.topicNum = topicsID.length
        data.teacherName = this.$store.getters.userInfo.teacherName
        const res = await addArrange(data)
        if (res.code == 20000) {
          this.$message({
            message: res.msg,
            type: 'success'
          });
        }
        setTimeout(() => {
          this.$router.go(0)
        }, 2000)
      }
    },
    back() {
      if (this.active > 0) {
        this.active--
      }
    },
    handleSelectionChange(val) {
      this.infoForm.testTopics = val
      console.log(this.infoForm.testTopics)
    }
  }
}
</script>
<style lang='scss' scoped>
.wrapper {
  padding: 20px;
  height: 100%;

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
  .active_style {
    margin-top: 20px;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    .form_style {
      width: 45%;
      height: 100%;
    }
  }
  .button_group {
    display: flex;
    justify-content: center;
    position: relative;
    top: 300px;
  }
  .button_group_three {
    display: flex;
    margin-top: 40px;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    .alreadySelect_stlye {
      font-size: 20px;
      color: red;
    }
  }
}
</style>