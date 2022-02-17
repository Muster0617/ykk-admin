<template>
  <div class="wrapper">
    <el-table
      :data="
        search
          ? tableData.filter((data) =>
              data.testName.toString().includes(search.toString())
            )
          : tableData
      "
      style="width: 100%"
    >
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column
        prop="testSerial"
        label="考试编号"
        width="130"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="testDate"
        label="考试日期"
        width="130"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="startTime"
        label="考试时间"
        width="130"
      >
      </el-table-column>
      <el-table-column
        prop="testName"
        label="考试科目"
        width="130"
        sortable
      >
      </el-table-column>
      <el-table-column label="考试题目" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="viewTopic(scope.$index, scope.row)"
            >查看</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="考试班级" align="right">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            placeholder="输入考试科目搜索"
            style="width: 250px"
          />
        </template>
        <template slot-scope="scope">
          <el-select v-model="examineClass" placeholder="请选择">
            <el-option
              v-for="(item, index) in scope.row.testClass"
              :key="item.value"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
          <el-button
            type="info"
            @click="viewScore(scope.$index, scope.row)"
            style="margin-left: 20px"
            >查看成绩</el-button
          >
          <el-button
            type="danger"
            @click="delArrange(scope.$index, scope.row)"
            style="margin-left: 20px"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="考试题目"
      :visible.sync="topicDialogVisible"
      min-width="50%"
      top="8vh"
    >
      <el-table
        ref="multipleTable"
        height="420px"
        :data="topicData"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column type="index" width="50"> </el-table-column>
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
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="topicDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      :title="title"
      :visible.sync="scoreDialogVisible"
      @close="close"
      width="85%"
      top="8vh"
    >
      <div class="main">
        <div style="width: 300px">
          <el-table
            ref="multipleTable"
            height="420px"
            :data="scoreData"
            tooltip-effect="dark"
          >
            <el-table-column type="index" width="50"> </el-table-column>
            <el-table-column prop="studentID" label="学号" width="100">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="100">
            </el-table-column>
            <el-table-column prop="score" label="分数" width="50">
            </el-table-column>
          </el-table>
        </div>

        <div ref="chart" class="chart"></div>
      </div>

      <span slot="footer" class="dialog-footer">
        <div class="footer">
          <div style="line-height: 40px">
            <span>班级人数：{{ studentLength }}</span>
            <span>已考试人数：{{ scoreData.length }}</span>
            <span>未考试人数：{{ studentLength - scoreData.length }}</span>
          </div>
          <div>
            <el-button
              type="primary"
              plain
              :loading="downloadLoading"
              @click="handleDownload"
              >导出成绩</el-button
            >
            <el-button type="primary" @click="scoreDialogVisible = false"
              >确 定</el-button
            >
          </div>
        </div>
      </span>
    </el-dialog>
    <el-backtop></el-backtop>
  </div>
</template>
<script>
import { getArrange, getTopic, getScore } from '@/api/grade'
import { deleteArrange } from '@/api/topics'

import { getStudent } from '@/api/class'
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  MarkLineComponent,
  MarkPointComponent
} from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  MarkLineComponent,
  MarkPointComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
]);
export default {
  data() {
    return {
      tableData: [],
      examineClass: "",
      topicData: [],
      scoreData: [],
      topicDialogVisible: false,
      scoreDialogVisible: false,
      title: '',
      myChart: null,
      studentLength: '',
      search: '',
      downloadLoading: false,
    }
  },
  mounted() {
    this.getArrangeData()

  },
  watch: {
    myChart(val) {
      if(val){
        window.onresize = () => {
        this.myChart.resize()
      }
      }
    }
  },
  methods: {
    close(){
        if(this.myChart){
          this.myChart.dispose()
          this.myChart=null
        }
    },
    handleDownload() {
      this.$prompt('请输入文件名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '请输入文件名'
      }).then(({ value }) => {
        this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['','考试科目', '班级', '学号', '姓名', '分数']
          const filterVal = ['testName', 'class', 'studentID', 'name', 'score']
          const list = this.scoreData
          const data = this.formatJson(filterVal, list)
          let index = 1
          data.forEach(row => {
            row.unshift(index)
            index++
          })
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: value,
            autoWidth: true,
            bookType: 'xlsx'
          })
          this.downloadLoading = false
        })
      }).catch(() => {

      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {

        return v[j]
      }))
    },
    async getArrangeData() {
      const res = await getArrange({ teacherName: this.$store.getters.userInfo.teacherName })
      this.tableData = res.data
      console.log(res.data)
    },
    async viewScore(index, row) {
      if (this.examineClass) {
        this.title = this.examineClass
        const res = await getScore({ testSerial: row.testSerial, class: this.examineClass })
        const { data } = await getStudent({ className: this.examineClass })
        this.studentLength = data.length
        this.scoreData = res.data
        this.scoreDialogVisible = true
        let xdata = []
        let ydata = []
        for (const item of this.scoreData) {
          xdata.push(item.name)
          ydata.push(item.score)
        }
        this.$nextTick(() => {
          this.myChart = echarts.init(this.$refs.chart)
          let option = {
            title: {
              text: row.testName,
              left: 'right'
            },
            tooltip: {
              trigger: 'axis'
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: xdata
            },
            yAxis: {
              type: 'value',
              axisLabel: {
                formatter: '{value} 分'
              }
            },
            series: [
              {
                name: '分数',
                type: 'line',
                data: ydata,
                markPoint: {
                  data: [
                    { type: 'max', name: 'Max' },
                    { type: 'min', name: 'Min' }
                  ]
                },
                markLine: {
                  data: [{ type: 'average', name: 'Avg' }]
                }
              }
            ]
          };
          this.myChart.setOption(
            option
          )
        })
      } else {
        this.$message({
          message: '请选择班级',
          type: 'warning'
        });
      }
    },
    async viewTopic(index, row) {
      const res = await getTopic({ testSerial: row.testSerial })
      this.topicData = res.data
      this.topicDialogVisible = true
    },
    async delArrange(index, row) {
      this.$confirm('是否删除该考试', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        const res = await deleteArrange({ testSerial: row.testSerial })
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
      }).catch(() => {
      });
    }
  }


}
</script>
<style lang='scss' scoped>
.wrapper {
  padding: 20px;
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
  .main {
    display: flex;
    flex-direction: row;
    width: 100%;
    .chart {
      height: 420px;
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }
  .footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    span {
      margin-right: 20px;
      color: chocolate;
      font-weight: bold;
    }
  }
}
</style>