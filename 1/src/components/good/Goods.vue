<template>
  <div class="box">
    <div class="goods" v-show="flag">
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
            <el-button type="primary" @click="addGood">添加商品</el-button>
          </el-col>
        </el-row>
        <!-- 商品信息表格 -->
        <el-table :data="goodList" border stripe style="width: 100%">
          <el-table-column label="#" type="index" width="50"></el-table-column>
          <el-table-column prop="goods_name" width="650" label="商品名称"></el-table-column>
          <el-table-column prop="goods_price" label="商品价格(元)"></el-table-column>
          <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
          <el-table-column prop="add_time" :formatter="formatter" label="创建时间" min-width="160"></el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="handleEdit(scope.row.goods_id)"
              ></el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="deleteGood( scope.row.goods_id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
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
    </div>
    <!--添加商品容器-->
    <div class="handle_ADD" v-show="!flag">
      <!--头部索引展示-->
      <BreadMenu :menu="menu" :submenu="submenu"></BreadMenu>
      <el-card class="box-card">
        <el-row :gutter="24">
          <!--进度条展示-->
          <!-- <el-col :span="24"> -->
          <el-steps :active="active" finish-status="success">
            <el-step title="步骤 1"></el-step>
            <el-step title="步骤 2"></el-step>
            <el-step title="步骤 3"></el-step>
            <el-step title="步骤 4"></el-step>
            <el-step title="步骤 5"></el-step>
          </el-steps>
          <!-- </el-col> -->
        </el-row>
        <!--展示tabs标签页-->
        <el-row :gutter="24">
          <el-tabs
            :tab-position="tabPosition"
            style="height:auto;"
            @tab-click="handleTabClick($event)"
          >
            <el-tab-pane name="0" label="基本信息" :disabled="tabs_pane_flag">
              <!--form表单-->
              <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
                class="demo-ruleForm"
                @change="handelChanges"
              >
                <el-form-item label="商品名称" prop="name">
                  <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="price">
                  <el-input v-model="ruleForm.price"></el-input>
                </el-form-item>
                <el-form-item label="商品重量" prop="weight">
                  <el-input v-model="ruleForm.weight"></el-input>
                </el-form-item>
                <el-form-item label="商品数量" prop="num">
                  <el-input v-model="ruleForm.num"></el-input>
                </el-form-item>
                <el-form-item label="商品分类" prop="class">
                  <el-row>
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
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane name="1" label="商品参数" :disabled="tabs_pane_flag">配置管理</el-tab-pane>
            <el-tab-pane name="2" label="商品属性" :disabled="tabs_pane_flag">
              <el-input v-model="attribute"></el-input>
            </el-tab-pane>
            <el-tab-pane name="3" label="商品图片" :disabled="tabs_pane_flag">
              <!--上传图片-->
              <el-upload
                class="upload-demo"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList2"
                list-type="picture"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-tab-pane>
            <el-tab-pane name="4" label="商品内容" :disabled="tabs_pane_flag">
              <!--富文本展示-->
              <div id="wangeditor">
                <div ref="editorElem" style="text-align:left;"></div>
              </div>
              <el-button type="primary" @click="handleSub()">提交</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-row>
      </el-card>
    </div>
  </div>
</template>
<script>
import BreadMenu from "../BreadNav";
import formatDate from "../../utils/formatDate";
import E from "wangeditor";
export default {
  name: "goods",
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
      editor: null,
      editorContent: "",
      searchValue: "",
      htmls: "",
      pageInfo: {
        pagesize: 5,
        pagenum: 1
      },
      goodList: [],
      total: 0,
      editId: -1,
      flag: true,
      active: 0,
      tabPosition: "left",
      attribute: "",
      ruleForm: {
        name: "",
        price: "",
        weight: "",
        class: "",
        num: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10个字符", trigger: "blur" }
        ],
        weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1到 10 个字符", trigger: "blur" }
        ],
        class: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ],
        num: [
          { required: true, message: "请输入商品分类", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      },
      currentCategory: [],
      cascaderList: [],
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name"
      },
      tabs_pane_flag: true,
      fileList2: [
        {
          name: "food.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        },
        {
          name: "food2.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        }
      ]
    };
  },
  created() {
    this.getGoodsList();
    this.getCategoriesList();
  },
  watch: {
    // 如果 `ruleForm` 发生改变，这个函数就会运行
    ruleForm: {
      handler: function(newlist) {
        if (newlist["class"] != "") {
          this.tabs_pane_flag = false; //如果分类没有选择，标签页不可以切换
        }
      },
      deep: true, //开启深度监听
      immediate: true//改变立即执行
    }
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$axios.get("goods", {
        params: this.pageInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败");
      }
      this.goodList = res.data.goods;
      this.total = res.data.total;
    },
    addGood() {
      this.flag = false;
    },
    next() {
      if (this.active++ > 5) this.active = 0;
    },
    async handleEdit(id) {
      console.log(id);
      this.editId = id;
      const { data: res } = await this.$axios.get("/goods/" + id);
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品信息失败");
      }
      this.editForm = res.data;
      this.dialogFormVisible = true;
    },
    handleSizeChange(val) {
      this.pageInfo.pagesize = val;
      this.getGoodsList();
    },
    handleCurrentChange(val) {
      this.pageInfo.pagenum = val;
      this.getGoodsList();
    },
    async deleteGood(id) {
      const isdelete = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示 !",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          showCancelButton: true
        }
      ).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
      if (isdelete) {
        const { data: res } = await this.$axios.delete(`/goods/${id}`);
        if (res.meta.status !== 200) {
          return this.$message.error("删除失败");
        }
        this.$message.success("删除成功");
        this.getGoodsList();
      }
    },
    formatter(row, column, cellValue) {
      return formatDate(cellValue);
    },
    async handleChange() {
      //获取分类的数据
      //  console.log(this.currentCategory)
      // console.log()
      if (this.currentCategory.length <= 2) {
        return this.$message({
          message: "选择的分类不能小于2！",
          type: "warning"
        });
      } //分类小于2，返回提示
      this.ruleForm.class = this.currentCategory;
      let { data: res } = await this.$axios.get(
        `categories/${Number(this.currentCategory[2])}/attributes`,
        {
          params: {
            sel: [this.activeName == "first" ? "many" : "only"]
          }
        }
      );
      this.tableData = res.data; //获取参数还是属性
    },
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
    handleTabClick(value) {
      //操作进度的函数
      //如果class不等于空的时候，
      if (this.ruleForm.class != "") {
        // console.log(value);
        this.active = Number(value.index); //进度条切换对相应的进度
      }
    },
    handelChanges() {
      this.ruleForm;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    // catchData是一个类似回调函数，来自父组件，当然也可以自己写一个函数，主要是用来获取富文本编辑器中的html内容用来传递给服务端
    catchData(htmls) {
      this.htmls = htmls;
    },
    async handleSub() {
      //提交数据

      let { name, price, num, weight } = this.ruleForm;
      //结构赋值
      let { data: res } = await this.$axios.post("goods", {
        //
        goods_name: name,
        goods_cat: this.currentCategory.join(","),
        goods_price: price,
        goods_number: num,
        goods_weight: weight,
        goods_introduce: this.htmls,
        pics: "",
        attrs: ""
      });
console.log(res)
      if (res.meta.status!==201) return;
      //提示
      this.$message({
        message: "恭喜你，添加成功",
        type: "success"
      });
    }
  },

  mounted() {
    console.log(this.$refs.editorElem);
    this.editor = new E(this.$refs.editorElem);
    // 编辑器的事件，每次改变会获取其html内容
    this.editor.customConfig.onchange = html => {
      this.editorContent = html;
      this.catchData(this.editorContent); // 把这个html通过catchData的方法传入父组件
    };
    this.editor.customConfig.menus = [
      // 菜单配置
      "head", // 标题
      "bold", // 粗体
      "fontSize", // 字号
      "fontName", // 字体
      "italic", // 斜体
      "underline", // 下划线
      "strikeThrough", // 删除线
      "foreColor", // 文字颜色
      "backColor", // 背景颜色
      "link", // 插入链接
      "list", // 列表
      "justify", // 对齐方式
      "quote", // 引用
      "emoticon", // 表情
      "image", // 插入图片
      "table", // 表格
      "code", // 插入代码
      "undo", // 撤销
      "redo" // 重复
    ];
    this.editor.create(); // 创建富文本实例
  }
};
</script>
<style lang="scss" scoped>
</style>
