<template>
  <div class="order-wrap">
    <!--路由菜单-->
    <BreadMenu :menu="menu" :submenu="submenu"></BreadMenu>
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
      <!-- 订单信息表格 -->
      <el-table :data="goodList" border stripe style="width: 100%">
        <el-table-column label="#" type="index" width="50"></el-table-column>
        <el-table-column prop="order_number" width="650" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格(元)"></el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" :formatter="formatter" label="创建时间" min-width="160"></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(scope.row.order_id)"
            ></el-button>
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location"
              @click="SeeGood( scope.row.order_id)"
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
    <!--弹出展示物流进度-->
    <el-dialog title="查看物流进度" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
      <div style="height: auto">
        <el-steps direction="vertical" :active="1">
          <el-step
            v-for="(v,i) in seeList"
            :key="i"
            :title="`${v.ftime}`"
            :description="`${v.context}`"
          ></el-step>
        </el-steps>
      </div>
    </el-dialog>
    <!--弹出修改地址 -->
    <el-dialog title="修改地址" :visible.sync="dialogVisibles" width="60%" :before-close="handleClose">
      <div class="dialog-item">
        <!--展示地址三级数据-->
        <div class="dialog-title">地址选择:</div>
        <div class="dialog-content">
          <el-cascader
            :options="cityOptions"
            :value="city"
            @change="changeProvince"
            size="medium"
            change-on-select
            v-model="valueCity"
          ></el-cascader>
        </div>
      </div>
      <div class="dialog-item">
        <!--用户选择输入详细地址-->
        <div class="dialog-title">详细地址:</div>
        <div class="dialog-content">
          <el-input v-model="details"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisibles = false">取 消</el-button>
        <el-button type="primary" @click="handleModifyCity">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BreadMenu from "../BreadNav";
import formatDate from "../../utils/formatDate";
import citys from "@/assets/city/city_data2017_element";
// console.log(citys)
export default {
  name: "order",
  data() {
    return {
      pageInfo: {
        pagesize: 5,
        pagenum: 1
      },
      goodList: [],
      total: 0,
      searchValue: "",
      dialogVisible: false,
      dialogVisibles: false,
      seeList: [],
      cityOptions: null,
      city: null,
      details: "",
      valueCity: ""
    };
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
  components: {
    BreadMenu
  },
  created() {
    this.GETutileDate();
    //获取静态的地址数据
    this.cityOptions = citys;
    // console.log(citys)
  },
  methods: {
    //获取列表数据
    async GETutileDate() {
      let { data: res } = await this.$axios.get("orders", {
        params: this.pageInfo
      });
      console.log(res);
      this.goodList = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(val) {
      //分页控制
      this.pageInfo.pagesize = val;
      this.GETutileDate();
    },
    handleCurrentChange(val) {
      //分页控制
      this.pageInfo.pagenum = val;
      this.GETutileDate();
    },
    addGood() {},
    formatter(row, column, cellValue) {
      //处理时间格式
      return formatDate(cellValue);
    },
    async SeeGood() {
      //请求订单数据
      let { data: res } = await this.$axios.get(`/kuaidi/${1106975712662}`);
      // console.log(res);
      this.seeList = res.data;
      this.dialogVisible = true;
    },
    handleClose() {
      this.dialogVisible = false;
      this.dialogVisibles = false;
    },
    handleEdit(id) {
      console.log(id);
      this.dialogVisibles = true;
    },
    changeProvince(value) {
      console.log(value);
      console.log(this.valueCity);
    },
    //修改地址的函数
    handleModifyCity() {
      //验证参数
      if (this.cityOptions.length > 0 && this.details != "") {
        //成功提示
        this.$message({
          message: "地址修改成功!",
          type: "success"
        });
      } else {
        //失败提示
        this.$message.error("请输入完整参数!");
     
      }
      //复原dialog
      this.dialogVisibles = false;
      //清空参数
      this.valueCity = "";
      this.details = "";
    }
  }
};
</script>
<style lang="scss" scoped>
.dialog-item {
  width: 100%;
  height: 50px;
  line-height: 50px;
  display: flex;
  overflow: hidden;
  margin: 0;
  padding: 0;
  content: "";
  .dialog-content {
    width: 100%;
    display: flex;
  }
  .dialog-title {
    padding: 0px 10px;
  }
}
/deep/.el-input__inner {
  flex: 1;
}
/deep/.el-cascader--medium {
  line-height: 50px;
  flex: 1;
  padding-left: -10px;
}
/deep/.el-input--medium .el-input__inner {
  height: 40px;
}
</style>
