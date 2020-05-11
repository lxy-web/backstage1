<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/user1.jpg" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginout">退出</el-button>
    </el-header>
    <!-- 页面的主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse?'56px':'200px'">
        <!-- 侧边菜单栏 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          :default-active="activePath"
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#ffffff"
          active-text-color="#ffd04b"
          :collapse="isCollapse"
          unique-opened
          router
        >
          <!-- 一级菜单 -->
          <el-submenu v-for="item in menuList" :index="item.id+''" :key="item.id">
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="menuIconList[item.id]"></i>
              <span slot="title">{{item.authName}}</span>
            </template>
            <!-- 二级子菜单 -->
            <el-menu-item
              :index="'/'+subItem.path"
              @click="saveNavState(subItem.path)"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <i class="el-icon-menu"></i>
              {{subItem.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      menuList: null,
      menuIconList: {
        125: "iconfont icon-users",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao"
      },
      isCollapse: false,
      activePath: ""
    };
  },
  methods: {
    loginout() {
      sessionStorage.removeItem("token");
      this.$router.push("/login");
    },
    async getMenuList() {
      const { data: res } = await this.$axios.get("/menus");
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error(res.data.msg);
      this.menuList = res.data;
    },
    saveNavState(activePath) {
      activePath = "/" + activePath;
      sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    }
  },
  created() {
    // 在created生命周期请求数据
    this.getMenuList();
    this.activePath = sessionStorage.getItem("activePath");
  }
};
</script>
<style lang="scss" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  color: #fff;
  line-height: 60px;
  font-size: 22px;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
}

.el-aside {
  background-color: #333744;
  color: #fff;
  .toggle-button {
    font-size: 12px;
    line-height: 24px;
    text-align: center;
    cursor: pointer;
    letter-spacing: 0.2em;
    background: #4a5064;
  }
  .el-menu {
    border-right: 0px;
    i.iconfont {
      margin-right: 10px;
    }
  }
}

.el-main {
  background-color: #eaedf1;
  color: #333;
  text-align: center;
}
</style>
