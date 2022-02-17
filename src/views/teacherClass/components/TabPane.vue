<template>
  <el-table  v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
    <el-table-column type="index" width="50"> </el-table-column>
    <el-table-column prop="class" label="班级" align="center">
    </el-table-column>
    <el-table-column prop="studentID" label="学号" align="center">
    </el-table-column>
    <el-table-column prop="name" label="姓名" align="center"> </el-table-column>
    <el-table-column prop="email" label="邮箱" align="center">
    </el-table-column>
  </el-table>
</template>

<script>
import { getTeaStudent } from '@/api/students'

export default {
  props: {
    type: {
      type: String,
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,

    }
  },
  created() {
    this.getList()
    console.log('1')
  },
  methods: {
    async getList() {
      this.listLoading = true
      const res = await getTeaStudent({ teacherClass: this.type })
      this.list = res.data
      this.listLoading = false

    }
  }
}
</script>

