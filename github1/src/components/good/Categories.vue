<template>
  <div class="categories">
    <BreadMenu :menu="menu" :submenu="submenu"></BreadMenu>
    <el-card>
      <!-- 添加分类按钮 -->
      <div class="add_role">
        <el-button type="primary" @click="showAddDialog">添加分类</el-button>
      </div>
      <!-- 商品分类展示表格 -->
      <zk-table
        :data="categoriesList"
        :columns="columnsConfig"
        index-text="#"
        :selection-type="false"
        :expand-type="false"
        :show-index="true"
        :border="true"
      >
        <template slot="operations" scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deleteCategories( scope.row.cat_id)"
          >删除</el-button>
        </template>
        <template slot="showlevel" scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag v-if="scope.row.cat_level===1" type="success">二级</el-tag>
          <el-tag v-if="scope.row.cat_level===2" type="warning">三级</el-tag>
        </template>
        <template slot="isok" scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted"></i>
          <i v-else class="el-icon-error"></i>
        </template>
      </zk-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="pageInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类信息 -->
    <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%">
      <el-form :model="addForm" ref="addForm" :rules="addRule">
        <el-form-item label="分类名称" label-width="100px" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类" label-width="100px">
          <!-- 级联选择器，展示商品分类 -->
          <el-cascader
            v-model="addForm.cat_parent_name"
            :options="cascaderList"
            :props="cascaderProps"
            clearable
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancalAdd">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改分类名称 -->
    <el-dialog title="修改分类" :visible.sync="editDialogVisible" width="50%">
      <el-form :model="editForm" ref="editForm" :rules="addRule">
        <el-form-item label="分类名称" label-width="100px" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancalEdit">取 消</el-button>
        <el-button type="primary" @click="editCategory">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import BreadMenu from '../BreadNav.vue'
export default {
  name: 'categories',
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
      columnsConfig: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_level'
        },
        {
          label: '排序',
          type: 'template',
          template: 'showlevel'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operations',
          minWidth: 160
        }
      ],
      pageInfo: {
        pagesize: 5,
        pagenum: 1
      },
      categoriesList: [],
      total: 0,
      editId: -1,
      addDialogVisible: false,
      addForm: {
        cat_name: '',
        cat_parent_name: []
      },
      // 级联选择器的数据
      cascaderList: [],
      cascaderProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        checkStrictly: true
      },
      addRule: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: ['blur', 'change'] }
        ]
      },
      editDialogVisible: false,
      editForm: {
        cat_name: ''
      }
    }
  },
  created () {
    this.getCategoriesList()
  },
  methods: {
    async getCategoriesList () {
      const { data: res } = await this.$axios.get('categories', {
        params: this.pageInfo
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.categoriesList = res.data.result
      this.total = res.data.total
    },
    async showAddDialog () {
      const { data: res } = await this.$axios.get('categories', {
        params: {
          type: 3
        }
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.cascaderList = res.data
      this.addDialogVisible = true
    },
    async handleEdit (row) {
      console.log(row)
      this.editId = row.cat_id
      this.editForm.cat_name = row.cat_name
      this.editDialogVisible = true
    },
    handleSizeChange (val) {
      this.pageInfo.pagesize = val
      this.getCategoriesList()
    },
    handleCurrentChange (val) {
      this.pageInfo.pagenum = val
      this.getCategoriesList()
    },
    async deleteCategories (id) {
      const isdelete = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
        '提示 !',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          showCancelButton: true
        }
      ).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      if (isdelete) {
        const { data: res } = await this.$axios.delete(`/categories/${id}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        this.getCategoriesList()
      }
    },
    handleChange () {

    },
    async addCategory () {
      const catpid = this.addForm.cat_parent_name.length > 0 ? this.addForm.cat_parent_name[this.addForm.cat_parent_name.length - 1] : 0
      const { data: res } = await this.$axios.post('/categories', {
        // 分类父 ID,必填,如果要添加1级分类，则父分类Id应该设置为  `0`
        cat_pid: catpid + '',
        cat_name: this.addForm.cat_name,
        cat_level: this.addForm.cat_parent_name.length + ''
      })
      console.log(catpid, this.addForm.cat_name, this.addForm.cat_parent_name.length)
      console.log(res)
      if (res.meta.status !== 201) {
        return this.$message.error('添加失败')
      }
      this.$message.success('添加成功')
      this.$refs.addForm.resetFields()
      this.addDialogVisible = false
      this.getCategoriesList()
    },
    cancalAdd () {
      this.$refs.addForm.resetFields()
      this.addDialogVisible = false
    },
    cancalEdit () {
      this.$refs.editForm.resetFields()
      this.editDialogVisible = false
    },
    async editCategory () {
      const { data: res } = await this.$axios.put(`/categories/${this.editId}`, {
        cat_name: this.editForm.cat_name
      })
      if (res.meta.status !== 200) {
        return this.$message.error('更新失败')
      }
      this.$message.success('更新成功')
      this.$refs.editForm.resetFields()
      this.getCategoriesList()
      this.editDialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.add_role {
  text-align: left;
}
.el-cascader{
  width: 100%;
}
</style>
