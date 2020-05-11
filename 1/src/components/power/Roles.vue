<template>
  <div class="roles">
    <BreadMenu :menu="menu" :submenu="submenu"></BreadMenu>
    <el-card>
      <!-- 添加角色按钮 -->
      <div class="add_role">
        <el-button type="primary" @click="showAddDialog">添加角色</el-button>
      </div>
      <!-- 角色信息表格 -->
      <el-table stripe :data="rolesList" border style="width: 100%">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 一级权限 -->
            <el-row v-for="item in scope.row.children" :key="item.id" class="el-row-line">
              <el-col :span="5">
                <el-tag closable @close="handleClose(scope.row,item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限 -->
              <el-col :span="19">
                <el-row v-for="item2 in item.children" :key="item2.id" class="el-row-line-inner">
                  <el-col :span="7">
                    <el-tag
                      @close="handleClose(scope.row,item2.id)"
                      type="success"
                      closable
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="17">
                    <!-- 三级权限 -->
                    <el-tag
                      @close="handleClose(scope.row,item3.id)"
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index" width="50"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" min-width="160"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" min-width="160"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(scope.row.id)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteRoles( scope.row.id)"
            >删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showRightsDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 修改角色信息  -->
    <el-dialog title="修改角色信息" :visible.sync="dialogFormVisible" width="50%">
      <el-form :model="editForm" ref="editForm" :rules="EditruleForm">
        <el-form-item label="角色名称" label-width="100px" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="100px" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancalEdit">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加角色信息 -->
    <el-dialog title="添加角色信息" :visible.sync="addDialogVisible" width="50%">
      <el-form :model="addForm" ref="addForm" :rules="EditruleForm">
        <el-form-item label="角色名称" label-width="100px" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="100px" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancalAdd">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      @close="closeRightsDialog"
      :visible.sync="setRightDialogVisible"
      width="50%"
    >
      <el-tree
        ref="righttree"
        :data="rightsList"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="defaultCheckedKeys"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible=false">取 消</el-button>
        <el-button type="primary" @click="updateRight">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BreadMenu from '../BreadNav.vue'
export default {
  name: 'roles',
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
    return {
      rolesList: [],
      // 编辑
      dialogFormVisible: false,
      editForm: {
        roleName: '',
        roleDesc: ''
      },
      editId: -1,
      EditruleForm: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      // 添加
      addDialogVisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      currentTreeId: -1,
      setRightDialogVisible: false,
      rightsList: [],
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的数组
      defaultCheckedKeys: []
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$axios.get('/roles')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('请求角色列表失败')
      }
      this.rolesList = res.data
    },
    async handleEdit (id) {
      this.editId = id
      const { data: res } = await this.$axios.get('/roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色信息失败')
      }
      this.editForm = res.data
      this.dialogFormVisible = true
    },
    cancalEdit () {
      this.$refs.editForm.resetFields()
      this.dialogFormVisible = false
    },
    async editRoles () {
      const { data: res } = await this.$axios.put(
        '/roles/' + this.editId,
        this.editForm
      )
      if (res.meta.status !== 200) {
        return this.$message.error('编辑角色信息失败')
      }
      this.$message.success('编辑角色信息成功')
      this.dialogFormVisible = false
      this.getRolesList()
    },
    showAddDialog () {
      this.addDialogVisible = true
    },
    cancalAdd () {
      this.$refs.addForm.resetFields()
      this.addDialogVisible = false
    },
    async addRoles () {
      const { data: res } = await this.$axios.post('roles', {
        roleName: this.addForm.roleName,
        roleDesc: this.addForm.roleDesc
      })
      console.log(res)
      if (res.meta.status !== 201) {
        return this.$message.error('添加失败')
      }

      this.$message.success('添加成功')
      this.$refs.addForm.resetFields()
      this.addDialogVisible = false
      this.getRolesList()
    },
    deleteRoles (id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示 !', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showCancelButton: true
      })
        .then(async () => {
          const { data: res } = await this.$axios.delete(`/roles/${id}`)
          if (res.meta.status !== 200) {
            return this.$message.error('删除失败')
          }
          this.$message.success('删除成功')
          this.getRolesList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    async getRightsTree (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getRightsTree(item, arr)
      })
    },
    async showRightsDialog (currentRole) {
      this.currentTreeId = currentRole.id
      this.setRightDialogVisible = true
      const { data: res } = await this.$axios.get('/rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限树失败')
      }
      console.log(res)
      this.rightsList = res.data
      this.getRightsTree(currentRole, this.defaultCheckedKeys)
    },
    async updateRight () {
      const selectedKeys = this.$refs.righttree.getCheckedKeys()
      const halfselectedKeys = this.$refs.righttree.getHalfCheckedKeys()
      const selectStr = selectedKeys.concat(halfselectedKeys).join(',')
      console.log(selectStr)
      const { data: res } = await this.$axios.post(
        `/roles/${this.currentTreeId}/rights`,
        {
          rids: selectStr
        }
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('更新失败')
      }
      this.$message.success('更新成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    },
    closeRightsDialog () {
      // 关闭对话框的时候，清空默认选中数组
      this.defaultCheckedKeys = []
    },
    // tag标签删除权限
    async handleClose (role, rightId) {
      const isDelete = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示 !',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          showCancelButton: true
        }
      )
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      if (isDelete) {
        const { data: res } = await this.$axios.delete(
          `/roles/${role.id}/rights/${rightId}`
        )
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('取消权限失败')
        }
        this.$message.success('取消权限成功')
        // 在这个地方可以不用全部更新，只更新当前的角色权限
        role.children = res.data
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.add_role {
  text-align: left;
}
.el-row {
  display: flex;
  align-items: center;
}
.el-row-line {
  align-items: center;
  border-bottom: 1px solid #eee;
}
.el-row-line:first-child {
  border-top: 1px solid #eee;
}
.el-row-line-inner:not(:nth-child(1)) {
  border-top: 1px solid rgb(238, 238, 238);
}
.el-tag {
  margin: 10px;
}
</style>
