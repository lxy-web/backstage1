import Vue from 'vue'
import {
  Button, Input, Form, FormItem, Message, Container, Header, Main, Aside,
  Menu, MenuItem, Submenu, Breadcrumb, BreadcrumbItem, Card, Col, Row, Table,
  TableColumn, Switch, Pagination, Dialog, MessageBox, Tag, Tree, Cascader, Alert,
  Tabs, TabPane,Collapse,CollapseItem,Popover,Steps,Step,Upload
  
} from 'element-ui'

Vue.use(Button)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Col)
Vue.use(Row)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Popover)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Upload)
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message
