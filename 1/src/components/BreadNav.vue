<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{menu}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{submenu}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'welcome',
  props: {
    menu: {
      type: String,
      required: true
    },
    submenu: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
