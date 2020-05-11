<template>
  <div class="reports-wrap">
    <!--路由菜单-->
    <BreadMenu :menu="menu" :submenu="submenu"></BreadMenu>
    <el-card>
      <el-card>
      <div id="main" style="width: 800px;height:400px;"></div>
    </el-card>
    </el-card>
  </div>
</template>

<script>
// 引入echarts
import echarts from 'echarts'
import BreadMenu from "../BreadNav";
import _ from 'lodash'
export default {
  name: "reports",
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
        // 需要跟请求的折线图数据合并的options
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    };
  },
  /**
   * 在哪实例化echarts----- 确保dom元素已经挂载到咱们的页面中
   */
  async mounted() {
    const myChart = echarts.init(document.getElementById('main'))
    // 准备数据和配置项
    // 发送请求获取折线图的数据
    const { data: res } = await this.$http.get('reports/type/1')
    console.log(res.data)
    // 合并res.data 和this.options
    const result = _.merge(res.data, this.options)

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(result)
  }
};
</script>
<style lang="scss" scoped>
</style>
