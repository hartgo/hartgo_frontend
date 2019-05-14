<template>
  <div class="page-main-container">
    <div class="list-page-container">
      <div class="search-container">
        <el-form :inline="true" ref="searchForm" :model="serchParams">
          <el-form-item prop="mobileNo" label="账号">
            <el-input v-model="serchParams.mobileNo" @keyup.enter.native="serachData" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item prop="realName" label="姓名">
            <el-input v-model="serchParams.realName" @keyup.enter.native="serachData" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item prop="userPhone" label="手机号">
            <el-input v-model="serchParams.userPhone" @keyup.enter.native="serachData" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-button type="primary" @click="page.pageNo = 1; serachData()">查询</el-button>
          <el-button type="info" @click="$refs.searchForm.resetFields(); serachData();">重置</el-button>
        </el-form>
      </div>
      <div class="table-container">
        <div class="operation-container">
          <el-button type="primary" icon="el-icon-plus" @click="addItem">新增</el-button>
          <el-button type="info" :disabled="!selectIds || !selectIds.length" icon="el-icon-delete" @click="deleteItems">删除</el-button>
          <el-button type="info" :disabled="!selectIds || !selectIds.length" icon="el-icon-lock" @click="forbadeItems">禁用</el-button>
          <el-button type="info" :disabled="!selectIds || !selectIds.length" icon="el-icon-unlock" @click="recoveryItems">启用</el-button>
          <el-button type="info" :disabled="!selectIds || !selectIds.length" icon="el-icon-refresh" @click="resetItems">重置密码</el-button>
        </div>
        <el-table :data="data" v-loading="loadingData" height="100%" @selection-change="selectData" style="width: 100%">
          <el-table-column type="selection" width="50">
          </el-table-column>
          <el-table-column type="index" label="编号" width="50">
          </el-table-column>
          <el-table-column prop="userId" label="用户ID">
            <template slot-scope="scope">
              <div class="table-link" @click="viewDetail(scope.row)">{{scope.row.userId}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="mobileNo" label="账号">
          </el-table-column>
          <el-table-column prop="realName" label="姓名">
          </el-table-column>
          <el-table-column prop="userPhone" label="手机号">
          </el-table-column>
          <el-table-column prop="email" label="邮箱">
          </el-table-column>
          <el-table-column prop="userStatus" label="状态">
            <template slot-scope="scope">
              <div>{{statusText[scope.row.userStatus] || '未知'}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="expireTime" label="超期时间">
          </el-table-column>
          <el-table-column prop="openId" label="OPEN ID">
          </el-table-column>
          <el-table-column prop="unionId" label="UNION ID">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button title="编辑" size="medium" type="text" icon="el-icon-edit" @click="eidtItem(scope.row)"></el-button>
              <el-button title="删除" size="medium" type="text" icon="el-icon-delete" @click="deleteItem(scope.row)"></el-button>
              <el-button v-if="scope.row.userStatus === 1" title="禁用" size="medium" type="text" icon="el-icon-lock" @click="forbadeItem(scope.row)"></el-button>
              <el-button v-if="scope.row.userStatus === 2" title="启用" size="medium" type="text" icon="el-icon-unlock" @click="recoveryItem(scope.row)"></el-button>
              <el-button title="授权" size="medium" type="text" icon="el-icon-setting" @click="authItem(scope.row)"></el-button>
              <el-button title="重置密码" size="medium" type="text" icon="el-icon-refresh" @click="resetItem(scope.row)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-container">
        <el-pagination layout="total, sizes, prev, pager, next, jumper" background :total="page.totalCount" :pager-count="pagerCount" :page-size="page.pageSize" :current-page.sync="page.pageNo" :page-sizes="pageSizes" @size-change="pageSizeChange" @current-change="pageChange">
        </el-pagination>
      </div>
    </div>
    <el-dialog :title="infoTitleMap[infoFlag]" :visible.sync="infoDialogFlag" :close-on-click-modal="false" width="35%">
      <el-form :model="infoData" ref="infoDialog" label-width="100px" :rules="infoRule">
        <div class="dialog-body">
          <div class="body-item">基本信息</div>
          <div class="flex-row" v-if="infoFlag !== 'add'">
            <el-form-item label="用户ID" prop="userId">
              <el-input disabled v-model.trim="infoData.userId"></el-input>
            </el-form-item>
            <el-form-item label="用户状态" prop="userStatus" v-if="infoFlag === 'detail'">
              <div style="color: #C0C4CC;">{{statusText[infoData.userStatus] || '未知'}}</div>
            </el-form-item>
          </div>
          <div class="base-info" v-if="infoFlag !== 'auth'">
            <div class="flex-row">
              <el-form-item label="账号" prop="mobileNo">
                <el-input :disabled="infoFlag === 'detail'" v-model.trim="infoData.mobileNo" max-length="64" placeholder="请输入登录账号"></el-input>
              </el-form-item>
              <el-form-item label="真实姓名" prop="realName">
                <el-input :disabled="infoFlag === 'detail'" v-model="infoData.realName" max-length="64" placeholder="请输入真实姓名"></el-input>
              </el-form-item>
            </div>
            <div class="flex-row" v-if="infoFlag !== 'detail'">
              <el-form-item label="密码" prop="password">
                <el-input :disabled="infoFlag === 'detail'" type="password" v-model.trim="infoData.password" max-length="64" placeholder="请输入登录密码"></el-input>
              </el-form-item>
              <el-form-item label="密码确认" prop="confirmPassword">
                <el-input :disabled="infoFlag === 'detail'" type="password" v-model.trim="infoData.confirmPassword" max-length="64" placeholder="请再次输入登录密码"></el-input>
              </el-form-item>
            </div>
            <div class="flex-row">
              <el-form-item label="联系电话" prop="userPhone">
                <el-input :disabled="infoFlag === 'detail'" v-model="infoData.userPhone" max-length="64" placeholder="请输入联系电话"></el-input>
              </el-form-item>
              <el-form-item label="邮箱地址" prop="email">
                <el-input :disabled="infoFlag === 'detail'" v-model="infoData.email" max-length="64" placeholder="请输入邮箱地址"></el-input>
              </el-form-item>
            </div>
            <div class="flex-row">
              <el-form-item label="失效时间" prop="expireTime">
                <el-date-picker :disabled="infoFlag === 'detail'" v-model="infoData.expireTime" type="date" placeholder="请请选择失效时间">
                </el-date-picker>
              </el-form-item>
            </div>
          </div>
          <div class="auth-info" v-if="infoFlag === 'detail' || infoFlag === 'auth'">
            <div class="body-item">角色权限</div>
            <div class="flex-row">
              <el-form-item label="后台系统" prop="platAuth">
                <el-checkbox-group :disabled="infoFlag === 'detail'" v-model="infoData.platAuth">
                  <el-checkbox label="1">用户管理员</el-checkbox>
                  <el-checkbox label="2">配送员</el-checkbox>
                  <el-checkbox label="3">订单提供者</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>
            <div class="flex-row">
              <el-form-item label="小程序" prop="wechatAuth">
                <el-checkbox-group :disabled="infoFlag === 'detail'" v-model="infoData.wechatAuth">
                  <el-checkbox label="1">用户管理员</el-checkbox>
                  <el-checkbox label="2">配送员</el-checkbox>
                  <el-checkbox label="3">订单提供者</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="flex-right">
          <div>
            <el-button type="primary" @click="dialogConfirm">确定</el-button>
            <el-button @click="dialogCancel">取消</el-button>
          </div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import utils from '@/utils';
import appConfig from '@/utils/appConfig'
export default {
  components: {},
  data() {
    return {
      checkAuth: utils.checkAuth,
      loadingData: false,
      serchParams: {
        name: ''
      },
      data: [],
      pagerCount: appConfig.pagerCount,
      page: appConfig.pageInfo,
      pageSizes: appConfig.pageSizes,
      statusText: {
        1: '启用',
        2: '禁用'
      },
      selectIds: [],
      infoTitleMap: {
        add: '新增用户',
        edit: '编辑用户',
        detail: '用户详情',
        auth: '用户授权'
      },
      infoFlag: 'add',
      infoDialogFlag: false,
      infoData: {
        platAuth: [],
        wechatAuth: []
      },
      infoRule: {
        mobileNo: [
          { required: true, message: '请输入登录账号', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' }
        ],
        userPhone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { validator: this.checkPassword, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入登录密码', trigger: 'blur' },
          { validator: this.checkPassword, trigger: 'blur' }
        ],
        email: [
          { pattern: appConfig.regMap.email, message: '请输入正确的邮箱地址', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.serachData();
  },
  methods: {
    // 数据查询
    serachData() {
      this.loadingData = true;
      setTimeout(() => {
        this.$log.info('查询数据，查询条件为：', this.serchParams, '； 分页信息为：', this.page);
        this.data = [{
          userId: 1113,
          mobileNo: '13512345678',
          realName: '张三',
          userPhone: '13512345678',
          email: 'zhangsan@qq.com',
          expireTime: '2019-12-31 23:59:59',
          openId: '23t32jg2398yt23jg203t',
          unionId: 'fewgt23t23t23t13225t235',
          userStatus: 1
        }, {
          userId: 1118,
          mobileNo: '13587654321',
          realName: '李四',
          userPhone: '13587654321',
          email: 'lisi@qq.com',
          expireTime: '2019-12-31 23:59:59',
          openId: 'fw2t23tkgeglwe329523',
          unionId: 'egy34yhkl34hj43ohsdglwke',
          userStatus: 2
        }];
        this.page.totalCount = 105;
        this.loadingData = false;
      }, 500);
    },
    // 选中表格数据
    selectData(val) {
      this.selectIds = val.map((item) => { return item.userId; });
      this.$log.info('用户使用复选框，多选表格数据，选中的ID为：', this.selectIds);
    },
    // 表格展示数量发生编号
    pageSizeChange(val) {
      this.$log.info('用户切换每页展示条数，切换后的每页展示数为：', val);
      this.page.pageSize = val;
      this.serachData();
    },
    // 翻页操作
    pageChange(val) {
      this.$log.info('用户进行翻页操作，翻页后的新页码为：', val);
      this.serachData();
    },
    // 新增
    addItem() {
      this.infoFlag = 'add';
      this.infoDialogFlag = true;
      this.$log.info('新增元素');
    },
    // 删除（批量）
    deleteItems() {
      this.$confirm('您确定删除选中的用户信息吗？', '批量删除用户', {
        type: 'warning'
      }).then(_ => {
        // TODO
        this.$log.info('批量删除元素，操作的ID列表为：', this.selectIds);
      }).catch(_ => {});
    },
    // 禁用（批量）
    forbadeItems() {
      this.$confirm('您确定禁用选中的用户信息吗？', '批量禁用用户', {
        type: 'warning'
      }).then(_ => {
        // TODO
        this.$log.info('批量禁用元素，操作的ID列表为：', this.selectIds);
      }).catch(_ => {});
    },
    // 启用（批量）
    recoveryItems() {
      this.$confirm('您确定启用选中的用户信息吗？', '批量启用用户', {
        type: 'warning'
      }).then(_ => {
        // TODO
        this.$log.info('批量启用元素，操作的ID列表为：', this.selectIds);
      }).catch(_ => {});
    },
    // 重置密码（批量）
    resetItems() {
      this.$confirm('您确定重置选中用户的密码吗？', '批量重置密码', {
        type: 'warning'
      }).then(_ => {
        // TODO
        this.$log.info('批量重置密码，操作的ID列表为：', this.selectIds);
      }).catch(_ => {});
    },
    // 查看详情（单个）
    viewDetail(item) {
      this.infoFlag = 'detail';
      this.infoDialogFlag = true;
      this.$log.info('查看元素详情，操作的元素ID为：', item.userId);
    },
    // 编辑（单个）
    eidtItem(item) {
      this.infoFlag = 'edit';
      this.infoDialogFlag = true;
      this.$log.info('编辑元素，操作的元素ID为：', item.userId);
    },
    // 删除（单个）
    deleteItem(item) {
      this.$confirm('您确定删除当前用户信息吗？', '删除用户', {
        type: 'warning'
      }).then(_ => {
        // TODO
        this.$log.info('删除单个元素，操作的元素ID为：', this.selectIds);
      }).catch(_ => {});
    },
    // 禁用（单个）
    forbadeItem(item) {
      this.$confirm('您确定禁用当前用户信息吗？', '禁用用户', {
        type: 'warning'
      }).then(_ => {
        // TODO
        this.$log.info('禁用单个元素，操作的元素ID为：', this.selectIds);
      }).catch(_ => {});
    },
    authItem(item) {
      this.infoFlag = 'auth';
      this.infoDialogFlag = true;
      this.$log.info('设置元素权限，操作的元素ID为：', item.userId);
    },
    // 启用（单个）
    recoveryItem(item) {
      this.$confirm('您确定启用当前用户信息吗？', '启用用户', {
        type: 'warning'
      }).then(_ => {
        // TODO
        this.$log.info('启用单个元素，操作的元素ID为：', this.selectIds);
      }).catch(_ => {});
    },
    resetItem(item) {
      this.$confirm('您确定重置当前用户登录密码为初始密码（123456）吗？', '重置密码', {
        type: 'warning'
      }).then(_ => {
        // TODO
        this.$log.info('重置单个元素密码，操作的元素ID为：', this.selectIds);
      }).catch(_ => {});
    },
    checkPassword(rule, value, callback) {
      if (this.infoData.password && this.infoData.password.length && this.infoData.confirmPassword && this.infoData.confirmPassword.length && this.infoData.password !== this.infoData.confirmPassword) {
        callback(new Error('登录密码和确认密码不一致'))
      } else {
        callback()
      }
    },
    dialogConfirm() {
      if (this.infoFlag === 'detail') {
        this.$refs.infoDialog.resetFields();
        this.infoDialogFlag = false;
        return;
      }
      this.$refs['infoDialog'].validate((valid) => {
        if (valid) {
          this.$log.info('当前操作为：', this.infoFlag, '；数据结构为：', this.infoData);
        }
      })
    },
    dialogCancel() {
      this.$refs.infoDialog.resetFields();
      this.infoDialogFlag = false;
    }
  }
}

</script>
<style></style>
