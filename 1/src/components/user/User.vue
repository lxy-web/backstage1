<template>
  <div>
    <!-- 面包屑导航组件 -->
    <BreadMenu :menu="menu" :submenu="submenu"></BreadMenu>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 搜索框 -->
      <el-row :gutter="24">
        <el-col :span="8">
          <el-input placeholder="请输入搜索内容" v-model="searchValue">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="showAddModal">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户信息表格 -->
      <el-table :data="userList" border style="width: 100%">
        <el-table-column label="#" type="index" width="50"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              @change="changeState(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteUser( scope.row.id)"
            ></el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 修改用户信息 -->
    <el-dialog title="修改用户信息" :visible.sync="dialogFormVisible" width="50%">
      <el-form :model="editForm" ref="editForm" :rules="EditruleForm">
        <el-form-item label="用户名" label-width="70px">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="70px" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" label-width="70px" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancalEdit">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增用户 -->
    <el-dialog title="修改用户信息" :visible.sync="addUserFormVisible" width="50%">
      <el-form :model="addForm" ref="addForm" :rules="EditruleForm">
        <el-form-item label="用户名" label-width="70px" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="70px" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="70px" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" label-width="70px" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancaladd">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BreadMenu from '../BreadNav.vue'
export default {
  name: 'user',
  components: {
    BreadMenu
  },
  props: {
    menu: {
      type: String,
      required: true
    },
    submenu: {
      type: String,
      required: true
    }
  },
  data () {
    // 验证邮箱正则
    var checkEmail = (rule, value, callback) => {
      const regEamil = /^\w+@\w+(\.\w+)+$/
      if (regEamil.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    var checkMobile = (rule, value, callback) => {
      const regEamil = /^1[3-9]\d{9}$/
      if (regEamil.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法手机号'))
    }
    return {
      searchValue: '',
      queryInfo: {
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      total: 0,
      dialogFormVisible: false,
      editId: -1,
      editForm: {
        email: '',
        mobile: ''
      },
      EditruleForm: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '用户名3-8个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码6-15个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, message: '邮箱格式不正确，请重新输入', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, message: '手机号格式不正确，请重新输入', trigger: 'blur' }
        ]
      },
      addUserFormVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$axios.get('users', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    async handleEdit (id) {
      this.editId = id
      const { data: res } = await this.$axios.get('/users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户信息失败')
      }
      this.editForm = res.data
      this.dialogFormVisible = true
    },
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.getUserList()
    },
    handleCurrentChange (val) {
      this.queryInfo.pagenum = val
      this.getUserList()
    },
    async changeState (row) {
      const { data: res } = await this.$axios.put(`users/${row.id}/state/${row.mg_state}`)
      if (res.meta.status !== 200) {
        return this.$message.error('修改状态失败')
      }
      this.$message.success('修改状态成功')
      this.editForm = res.data
    },
    cancalEdit () {
      this.$refs.editForm.resetFields()
      this.dialogFormVisible = false
    },
    async editUser () {
      const { data: res } = await this.$axios.put(`users/${this.editId}`, {
        email: this.editForm.email,
        mobile: this.editForm.mobile
      })
      if (res.meta.status !== 200) {
        return this.$message.error('编辑失败')
      }
      console.log(this.editId)
      console.log(res)
      this.$message.success('编辑成功')
      this.$refs.editForm.resetFields()
      this.dialogFormVisible = false
      this.getUserList()
    },
    deleteUser (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示 !', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showCancelButton: true
      }).then(async () => {
        const { data: res } = await this.$axios.delete(`users/${id}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        this.getUserList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    showAddModal () {
      this.addUserFormVisible = true
    },
    cancaladd () {
      this.$refs.addForm.resetFields()
      this.addUserFormVisible = false
    },
    async addUser () {
      const { data: res } = await this.$axios.post('users', this.addForm)
      console.log(res)
      if (res.meta.status !== 201) {
        return this.$message.error('添加失败')
      }

      this.$message.success('添加成功')
      this.$refs.addForm.resetFields()
      this.addUserFormVisible = false
      this.getUserList()
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
