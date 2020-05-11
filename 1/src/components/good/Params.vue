<template>
  <div class="params">
    <BreadMenu :menu="menu" :submenu="submenu"></BreadMenu>
    <el-card>
      <!-- 警告提示文字 -->
      <el-alert :closable="false" title="注意：只允许为第三级分类设置相关参数" type="warning" show-icon></el-alert>
      <el-row>
        <el-col :span="4">选择商品分类：</el-col>
        <el-col :span="20">
          <!-- 级联选择器，展示商品分类 -->
          <el-cascader
            v-model="currentCategory"
            :options="cascaderList"
            :props="cascaderProps"
            clearable
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab切换 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="first">
          <!-- 添加参数按钮 -->
          <div class="add_role">
            <el-button type="primary" @click="showAddDialog">添加参数</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="second">
          <!-- 添加属性按钮 -->
          <div class="add_role">
            <el-button type="primary" @click="showAddDialog">添加属性</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
      <!-- 表格展示-->

      <el-table :data="tableData" style="width: 100%">
        <el-table-column width="50"></el-table-column>
        <el-table-column label="#" width="800">
          <template slot-scope="scope">
            <el-popover placement="top" width>
              <div slot="reference" class="name-wrapper" :title="scope.row.attr_name">
                <!--手风琴下拉展示tag标签-->
                <el-collapse v-model="activeNames" @change="handleChange">
                  <el-collapse-item :title="scope.row.attr_name" :name="scope.row.id">
                    <!-- 添加tag 标签-->
                    <div>
                      <el-tag
                        :key="tag"
                        v-for="tag in dynamicTags"
                        closable
                        :disable-transitions="false"
                        @close="handleClose(tag)"
                      >{{tag}}</el-tag>
                      <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        size="small"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm"
                      ></el-input>
                      <el-button
                        v-else
                        class="button-new-tag"
                        size="small"
                        @click="showInput"
                      >+ New Tag</el-button>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 弹出对话框修改动态或者静态参数-->
    <el-dialog title="提示" :visible.sync="centerDialogVisible" width="30%" center>
      <div class="dialog-title">{{activeName=="first"?"修改动态参数":"修改静态参数"}}</div>
      <div>
        <el-input type="text" v-model="defaultValue.attr_name"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSUB()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 弹出对话框添加动态或者静态参数-->
    <el-dialog title="提示" :visible.sync="centerDialogVisibles" width="30%" center>
      <div class="dialog-title">{{activeName=="first"?"添加动态参数":"添加静态参数"}}</div>
      <div>
        <el-input type="text" v-model="addDefaultValue"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisibles = false">取 消</el-button>
        <el-button type="primary" @click="handleADDSUB()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import BreadMenu from "../BreadNav.vue";
export default {
  name: "params",
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
  data() {
    return {
      // 选中的分类
      currentCategory: [],
      cascaderList: [],
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name"
      },
      activeName: "first",
      activeNames: [],
      addDialogVisible: false,
      tableData: [],
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
      centerDialogVisible: false,
      centerDialogVisibles:false,
      defaultValue: "",
      addDefaultValue:""
    };
  },
  created() {
    this.getCategoriesList();
  },
  methods: {
    async getCategoriesList() {
      //获取所有分类数据
      const { data: res } = await this.$axios.get("categories", {
        params: {
          type: 3
        }
      });
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败");
      }
      this.cascaderList = res.data;
    },
    // 选择分类时
    async handleChange() {
      //  console.log(this.currentCategory)
      if (this.currentCategory.length <= 2) {
        return this.$message({
          message: "选择的分类不能小于2！",
          type: "warning"
        });
      } //分类小于2，返回提示

      let { data: res } = await this.$axios.get(
        `categories/${Number(this.currentCategory[2])}/attributes`,
        {
          params: {
            sel: [this.activeName == "first" ? "many" : "only"]
          }
        }
      );
      this.tableData = res.data; //获取参数还是属性
      // this.dynamicTags.length=0;
      //  this.dynamicTags.push(res.data.attr_name)
      console.log(res);
    },
    handleClick() {
      console.log(this.activeName);
      this.handleChange();
    },
    async handleADDSUB(){
      let {data:res}=await this.$axios.post(`categories/${this.currentCategory[2]}/attributes`,{
        attr_name:this.addDefaultValue ,
        attr_sel:[this.activeName == "first" ? "many" : "only"]
      })
      console.log(res)
      this.centerDialogVisibles=false;
      this.handleChange();
      this.addDefaultValue =""
    },
     showAddDialog() {
       this.centerDialogVisibles=true;
    },
    handleEdit(index, row) {
      console.log(index, row);
      this.centerDialogVisible = true;
      this.defaultValue = row;
    },
    async handleSUB() {
      //dialog点击确定处理函数
      let { data: res } = await this.$axios.put(
        `categories/${this.currentCategory[2]}/attributes/${this.defaultValue.attr_id}`,
        {
          attr_name: this.defaultValue.attr_name,
          attr_sel: [this.activeName == "first" ? "many" : "only"]
        }
      );
      this.centerDialogVisible = false;
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("修改失败");

      this.handleChange();
      this.$message({
        message: "恭喜你，修改成功",
        type: "success"
      });
    },
    async handleDelete(index, row) {
      //点击删除处理
      // console.log(index, row.attr_id);
      let { data: res } = await this.$axios.delete(
        `categories/${this.currentCategory[2]}/attributes/${row.attr_id}`
      );
      console.log(res);

      this.handleChange();
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      // this.$nextTick(_ => {
      //   this.$refs.saveTagInput.$refs.input.focus();
      // });
    },

    handleInputConfirm() {
      // let inputValue = this.inputValue;
      if (this.inputValue) {
        this.dynamicTags.push(this.inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    }
  }
};
</script>
<style lang="scss" scoped>
.el-row {
  margin: 15px 0;
  display: flex;
  align-items: center;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.name-wrapper {
  overflow: hidden;
}
.dialog-title {
  font-size: 15px;
  font-weight: 500;
  padding: 10px;
}
</style>
