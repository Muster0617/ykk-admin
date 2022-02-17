<template>
  <div class="tab-container">
    <div>
      <FilenameOption v-model="filename" />
      <BookTypeOption v-model="bookType" style="margin-left: 20px" />
      <el-button
        :loading="downloadLoading"
        @click="handleDownload"
        style="margin: 0 0 20px 20px"
        type="primary"
        icon="el-icon-document"
      >
        导出
      </el-button>
    </div>

    <el-tabs v-model="activeName" style="margin-top: 15px" type="border-card">
      <el-tab-pane
        v-for="item in tabMapOptions"
        :key="item.key"
        :label="item.label"
        :name="item.key"
      >
        <keep-alive>
          <tab-pane
            v-if="activeName == item.key"
            :type="item.key"
            ref="TabPane"
          />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
    <el-backtop></el-backtop>
  </div>
</template>

<script>
import TabPane from './components/TabPane'
import FilenameOption from './components/FilenameOption'
import BookTypeOption from './components/BookTypeOption'
export default {
  name: 'Tab',
  components: { TabPane, FilenameOption, BookTypeOption },
  data() {
    return {
      tabMapOptions: [
      ],
      activeName: '',
      downloadLoading: false,
      filename: '',
      autoWidth: true,
      bookType: 'xlsx'
    }
  },
  watch: {
    activeName(val) {
      this.$router.push(`${this.$route.path}?tab=${val}`)
    }
  },
  created() {
    if (this.$store.getters.userInfo.teacherClass.length !== 0) {
      this.$store.getters.userInfo.teacherClass.forEach(row => {
        this.tabMapOptions.push({ label: row, key: row })
      })
      this.activeName = this.tabMapOptions[0]['key']
      // init the default selected tab
      const tab = this.$route.query.tab
      if (tab) {
        this.activeName = tab
      }
    }
  },
  methods: {
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['', '学号', '姓名', '班级', '邮箱']
        const filterVal = ['studentID', 'name', 'class', 'email']
        const list = this.$refs.TabPane[0].list
        const data = this.formatJson(filterVal, list)
        let index = 1
        data.forEach(row => {
          row.unshift(index)
          index++
        })
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {

        return v[j]
      }))
    }

  }
}
</script>

<style scoped>
.tab-container {
  margin: 30px;
}
</style>
