<template>
  <div class="page-main-container">
    <div class="list-page-container">
      <div class="search-container">
        <el-form :inline="true" ref="searchForm" :model="serchParams">
          <el-form-item prop="name" label="租户名称">
            <el-input clearable v-model="serchParams.name" @keyup.enter.native="searchData" placeholder="请输入租户名"></el-input>
          </el-form-item>
          <el-button type="primary" @click="page.pageNo = 1; searchData()">查询</el-button>
          <el-button type="info" @click="$refs.searchForm.resetFields(); searchData();">重置</el-button>
        </el-form>
      </div>
      <div class="table-container">
        <div class="operation-container">
          <el-button type="primary" icon="el-icon-plus" @click="addItem">新增</el-button>
          <el-button type="info" :disabled="!selectIds || !selectIds.length" icon="el-icon-delete" @click="deleteItems">删除</el-button>
          <el-button type="info" :disabled="!selectIds || !selectIds.length" icon="el-icon-lock" @click="forbadeItems">禁用</el-button>
          <el-button type="info" :disabled="!selectIds || !selectIds.length" icon="el-icon-unlock" @click="recoveryItems">启用</el-button>
        </div>
        <el-table :data="data" v-loading="loadingData" height="100%" @selection-change="selectData" style="width: 100%">
          <el-table-column type="selection" width="50">
          </el-table-column>
          <el-table-column type="index" label="编号" width="50">
          </el-table-column>
          <el-table-column prop="tenantId" label="租户ID">
            <template slot-scope="scope">
              <div class="table-link" @click="viewDetail(scope.row)">{{scope.row.tenantId}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="companyName" label="企业名称">
          </el-table-column>
          <el-table-column prop="companyAddress" label="企业地址">
          </el-table-column>
          <el-table-column prop="contacts" label="联系人">
          </el-table-column>
          <el-table-column prop="contactEmail" label="邮箱">
          </el-table-column>
          <el-table-column prop="companyPhone" label="联系电话">
          </el-table-column>
          <el-table-column prop="tenantStatus" label="状态">
            <template slot-scope="scope">
              <div>{{statusText[scope.row.tenantStatus] || '未知'}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button title="编辑" size="medium" type="text" icon="el-icon-edit" @click="eidtItem(scope.row)"></el-button>
              <el-button title="删除" size="medium" type="text" icon="el-icon-delete" @click="deleteItem(scope.row)"></el-button>
              <el-button v-if="scope.row.tenantStatus === 1" title="禁用" size="medium" type="text" icon="el-icon-lock" @click="forbadeItem(scope.row)"></el-button>
              <el-button v-if="scope.row.tenantStatus === 2" title="启用" size="medium" type="text" icon="el-icon-unlock" @click="recoveryItem(scope.row)"></el-button>
              <el-button title="授权" size="medium" type="text" icon="el-icon-setting" @click="authItem(scope.row)"></el-button>
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
      <el-form :model="infoData" ref="infoDialog" label-width="100px" :rules="infoFlag !== 'detail' ? infoRule : {}">
        <div class="dialog-body">
          <div class="body-item">基本信息</div>
          <div class="flex-row" v-if="infoFlag !== 'add'">
            <el-form-item label="租户ID" prop="tenantId">
              <el-input disabled v-model.trim="infoData.tenantId" placeholder="请输入租户ID"></el-input>
            </el-form-item>
            <el-form-item label="租户状态" prop="tenantStatus" v-if="infoFlag === 'detail'">
              <div style="color: #C0C4CC;">{{statusText[infoData.tenantStatus] || '未知'}}</div>
            </el-form-item>
          </div>
          <div class="base-info" v-if="infoFlag !== 'auth'">
            <div class="flex-row">
              <el-form-item label="企业名" prop="companyName">
                <el-input :disabled="infoFlag === 'detail'" v-model.trim="infoData.companyName" max-length="64" placeholder="请输入企业名称"></el-input>
              </el-form-item>
              <el-form-item label="联系人" prop="contacts">
                <el-input :disabled="infoFlag === 'detail'" v-model="infoData.contacts" max-length="64" placeholder="请输入企业联系人"></el-input>
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
              <el-form-item label="联系电话" prop="companyPhone">
                <el-input :disabled="infoFlag === 'detail'" v-model="infoData.companyPhone" max-length="64" placeholder="请输入联系电话"></el-input>
              </el-form-item>
              <el-form-item label="邮箱地址" prop="contactEmail">
                <el-input :disabled="infoFlag === 'detail'" v-model="infoData.contactEmail" max-length="64" placeholder="请输入邮箱地址"></el-input>
              </el-form-item>
            </div>
            <div style="max-width: 600px;">
              <el-form-item label="企业地址" prop="companyAddress">
                <el-input :disabled="infoFlag === 'detail'" v-model.trim="infoData.companyAddress" max-length="256" placeholder="请输入企业地址"></el-input>
              </el-form-item>
            </div>
          </div>
          <div class="auth-info" v-if="infoFlag === 'detail' || infoFlag === 'auth'">
            <div class="body-item">角色权限</div>
            <div class="flex-row">
              <el-form-item label="后台系统" prop="platAuth">
                <el-checkbox-group :disabled="infoFlag === 'detail'" v-model="infoData.platAuth">
                  <el-checkbox label="1">租户管理员</el-checkbox>
                  <el-checkbox label="2">配送员</el-checkbox>
                  <el-checkbox label="3">订单提供者</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>
            <div class="flex-row">
              <el-form-item label="小程序" prop="wechatAuth">
                <el-checkbox-group :disabled="infoFlag === 'detail'" v-model="infoData.wechatAuth">
                  <el-checkbox label="1">租户管理员</el-checkbox>
                  <el-checkbox label="2">配送员</el-checkbox>
                  <el-checkbox label="3">订单提供者</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>
            <div class="body-item">服务配置</div>
            <div class="flex-between" style="margin-bottom: 10px;">
              <div class="text-center" style="font-weight: bold; width: 20%;">服务大类</div>
              <div class="text-center" style="font-weight: bold; width: 40%;">服务协议</div>
              <div class="text-center" style="font-weight: bold; width: 40%;">计价规则</div>
            </div>
            <div class="flex-between valign-center" style="margin-bottom: 10px;">
              <div style="width: 20%;">
                <el-checkbox :disabled="infoFlag === 'detail'" label="1">供应服务</el-checkbox>
              </div>
              <div style="width: 40%;">
                <el-select :disabled="infoFlag === 'detail'" v-model="infoData.supplyAgree" placeholder="请选择服务协议">
                  <el-option v-for="item in supplyAgree" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div style="width: 40%;">
                <el-select :disabled="infoFlag === 'detail'" v-model="infoData.supplyRule" placeholder="请选择计价规则">
                  <el-option v-for="item in supplyRule" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="flex-between valign-center" style="margin-bottom: 10px;">
              <div style="width: 20%;">
                <el-checkbox :disabled="infoFlag === 'detail'" label="1">配送服务</el-checkbox>
              </div>
              <div style="width: 40%;">
                <el-select :disabled="infoFlag === 'detail'" v-model="infoData.deliveryAgree" placeholder="请选择服务协议">
                  <el-option v-for="item in deliveryAgree" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
              <div style="width: 40%;">
                <el-select :disabled="infoFlag === 'detail'" v-model="infoData.deliveryRule" placeholder="请选择计价规则">
                  <el-option v-for="item in deliveryRule" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="body-item">配送点配置</div>
            <div style="max-width: 600px;">
              <el-form-item label="配送点选择" prop="deliveryPoints">
                <el-select :disabled="infoFlag === 'detail'" v-model="infoData.deliveryPoints" style="width: 100%;" multiple placeholder="请选择配送点">
                  <el-option v-for="item in deliveryPoints" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
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
        add: '新增租户',
        edit: '编辑租户',
        detail: '租户详情',
        auth: '租户授权'
      },
      infoFlag: 'add',
      infoDialogFlag: false,
      infoData: {
        platAuth: [],
        wechatAuth: []
      },
      infoRule: {
        companyName: [
          { required: true, message: '请输入企业名称', trigger: 'blur' }
        ],
        contacts: [
          { required: true, message: '请输入企业联系人', trigger: 'blur' }
        ],
        companyPhone: [
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
        contactEmail: [
          { pattern: appConfig.regMap.email, message: '请输入正确的邮箱地址', trigger: 'blur' }
        ]
      },
      supplyAgree: [{
        label: '供应协议1',
        value: 1
      }, {
        label: '供应协议2',
        value: 2
      }, {
        label: '供应协议3',
        value: 3
      }],
      deliveryAgree: [{
        label: '配送协议1',
        value: 1
      }, {
        label: '配送协议2',
        value: 2
      }, {
        label: '配送协议3',
        value: 3
      }],
      supplyRule: [{
        label: '供应计价规则1',
        value: 1
      }, {
        label: '供应计价规则2',
        value: 2
      }, {
        label: '供应计价规则3',
        value: 3
      }],
      deliveryRule: [{
        label: '配送计价规则1',
        value: 1
      }, {
        label: '配送计价规则2',
        value: 2
      }, {
        label: '配送计价规则3',
        value: 3
      }],
      deliveryPoints: [{
        label: '配送点1',
        value: 1
      }, {
        label: '配送点2',
        value: 2
      }, {
        label: '配送点3',
        value: 3
      }]
    }
  },
  mounted() {
    this.searchData();
  },
  methods: {
    // 数据查询
    searchData() {
      this.loadingData = true;
      setTimeout(() => {
        this.$log.info('查询数据，查询条件为：', this.serchParams, '； 分页信息为：', this.page);
        this.data = [{
          tenantId: 1258,
          companyName: '苏宁易购',
          companyAddress: '广东省深圳市',
          contacts: '张三',
          contactEmail: 'zhangsan@qq.com',
          companyPhone: '13812345678',
          tenantStatus: 1
        }, {
          tenantId: 1587,
          companyName: '国美电器',
          companyAddress: '四川省成都市',
          contacts: '李四',
          contactEmail: 'lisi@qq.com',
          companyPhone: '13268485945',
          tenantStatus: 2
        }];
        this.page.totalCount = 105;
        this.loadingData = false;
      }, 500);
    },
    // 选中表格数据
    selectData(val) {
      this.selectIds = val.map((item) => { return item.tenantId; });
      this.$log.info('用户使用复选框，多选表格数据，选中的ID为：', this.selectIds);
    },
    // 表格展示数量发生编号
    pageSizeChange(val) {
      this.$log.info('用户切换每页展示条数，切换后的每页展示数为：', val);
      this.page.pageSize = val;
      this.searchData();
    },
    // 翻页操作
    pageChange(val) {
      this.$log.info('用户进行翻页操作，翻页后的新页码为：', val);
      this.searchData();
    },
    // 新增
    addItem() {
      this.infoFlag = 'add';
      this.infoDialogFlag = true;
      this.$log.info('新增元素');
    },
    // 删除（批量）
    deleteItems() {
      this.$confirm('您确定删除选中的租户信息吗？', '批量删除租户', {
        type: 'warning'
      }).then(_ => {
        // TODO
        this.$log.info('批量删除元素，操作的ID列表为：', this.selectIds);
      }).catch(_ => {});
    },
    // 禁用（批量）
    forbadeItems() {
      this.$confirm('您确定禁用选中的租户信息吗？', '批量禁用租户', {
        type: 'warning'
      }).then(_ => {
        // TODO
        this.$log.info('批量禁用元素，操作的ID列表为：', this.selectIds);
      }).catch(_ => {});
    },
    // 启用（批量）
    recoveryItems() {
      this.$confirm('您确定启用选中的租户信息吗？', '批量启用租户', {
        type: 'warning'
      }).then(_ => {
        // TODO
        this.$log.info('批量启用元素，操作的ID列表为：', this.selectIds);
      }).catch(_ => {});
    },
    // 查看详情（单个）
    viewDetail(item) {
      this.infoFlag = 'detail';
      this.infoDialogFlag = true;
      this.$log.info('查看元素详情，操作的元素ID为：', item.tenantId);
    },
    // 编辑（单个）
    eidtItem(item) {
      this.infoFlag = 'edit';
      this.infoDialogFlag = true;
      this.$log.info('编辑元素，操作的元素ID为：', item.tenantId);
    },
    // 删除（单个）
    deleteItem(item) {
      this.$confirm('您确定删除当前租户信息吗？', '删除租户', {
        type: 'warning'
      }).then(_ => {
        // TODO
        this.$log.info('删除单个元素，操作的元素ID为：', this.selectIds);
      }).catch(_ => {});
    },
    // 禁用（单个）
    forbadeItem(item) {
      this.$confirm('您确定禁用当前租户信息吗？', '禁用租户', {
        type: 'warning'
      }).then(_ => {
        // TODO
        this.$log.info('禁用单个元素，操作的元素ID为：', this.selectIds);
      }).catch(_ => {});
    },
    authItem(item) {
      this.infoFlag = 'auth';
      this.infoDialogFlag = true;
      this.$log.info('设置元素权限，操作的元素ID为：', item.tenantId);
    },
    // 启用（单个）
    recoveryItem(item) {
      this.$confirm('您确定启用当前租户信息吗？', '启用租户', {
        type: 'warning'
      }).then(_ => {
        // TODO
        this.$log.info('启用单个元素，操作的元素ID为：', this.selectIds);
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
