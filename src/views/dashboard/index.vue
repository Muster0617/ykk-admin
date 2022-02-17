<template>
  <div class="dashboard-container">
    
    <el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>用户信息</span>
  </div>
    <div class="dashboard-text">用户名: {{ userInfo.teacherName }}</div>
  <div class="dashboard-text">用户权限: {{ name }}</div>
    <div class="dashboard-text">教学科目: {{ userInfo.teacherSubject }}</div>
    <div class="dashboard-text">
      教学班级:
      <span v-for="(item, idnex) in userInfo.teacherClass">
      {{ item }}

      </span>
    </div>
</el-card>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      userInfo: '',
      name: ''

    }
  },
  mounted() {
    this.userInfo = this.$store.getters.userInfo
    this.name = this.$store.getters.name

  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 20px;
    line-height: 46px;
  }
}
</style>
