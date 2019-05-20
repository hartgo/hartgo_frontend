<template>
  <div class="page-main-container">
    <div class="list-page-container">
      <div class="search-container">
        <div class="flex-between">
          <el-form :model="infoData" ref="infoDialog" label-width="100px">
            <div class="flex-row">
              <el-form-item label="服务编码" prop="businessId">
                <el-input disabled v-model.trim="infoData.businessId" placeholder="请输入服务编码"></el-input>
              </el-form-item>
              <el-form-item label="服务名称" prop="businessName">
                <el-input disabled v-model.trim="infoData.businessName" max-length="64" placeholder="请输入服务名称"></el-input>
              </el-form-item>
              <el-form-item label="服务大类" prop="businessType">
                <el-select disabled v-model="infoData.businessType" placeholder="请选择服务大类">
                  <el-option v-for="item in businessType" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form>
          <el-button type="primary" @click="$router.push({ path: '/servicemgmt/service/list' });">返回</el-button>
        </div>
      </div>
      <div class="table-container">
        <div class="operation-container">
          <el-button type="primary" icon="el-icon-plus" @click="addItem">新增</el-button>
          <el-button type="info" :disabled="!selectIds || !selectIds.length" icon="el-icon-delete" @click="deleteItems">删除</el-button>
        </div>
        <el-table :data="data" v-loading="loadingData" height="100%" @selection-change="selectData" style="width: 100%">
          <el-table-column type="selection" width="50">
          </el-table-column>
          <el-table-column type="index" label="编号" width="50">
          </el-table-column>
          <el-table-column prop="ruleId" label="规则ID">
            <template slot-scope="scope">
              <div class="table-link" @click="viewDetail(scope.row)">{{scope.row.ruleId}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="ruleName" label="规则名称">
          </el-table-column>
          <el-table-column prop="fixAmount" label="固定金额">
          </el-table-column>
          <el-table-column prop="fixRate" label="固定费率">
          </el-table-column>
          <el-table-column prop="strategyCode" label="其他策略">
          </el-table-column>
          <el-table-column prop="strategyArg" label="策略参数">
          </el-table-column>
          <el-table-column prop="remark" label="备注">
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button title="编辑" size="medium" type="text" icon="el-icon-edit" @click="eidtItem(scope.row)"></el-button>
              <el-button title="删除" size="medium" type="text" icon="el-icon-delete" @click="deleteItem(scope.row)"></el-button>
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
          <div class="base-info">
            <div class="flex-row">
              <el-form-item label="规则ID" prop="ruleId" v-if="infoFlag !== 'add'">
                <el-input disabled v-model.trim="infoData.ruleId" placeholder="请输入规则ID"></el-input>
              </el-form-item>
                <el-form-item label="规则名称" prop="ruleName">
                  <el-input :disabled="infoFlag === 'detail'" v-model.trim="infoData.ruleName" max-length="64" placeholder="请输入规则名称"></el-input>
                </el-form-item>
            </div>
            <div class="flex-row">
              <el-form-item label="固定金额" prop="fixAmount">
                <el-input :disabled="infoFlag === 'detail'" v-model.trim="infoData.fixAmount" max-length="64" placeholder="请输入固定金额"></el-input>
              </el-form-item>
              <el-form-item label="固定费率" prop="fixRate">
                <el-input :disabled="infoFlag === 'detail'" v-model.trim="infoData.fixRate" max-length="64" placeholder="请输入固定费率"></el-input>
              </el-form-item>
            </div>
            <div class="flex-row">
              <el-form-item label="其他策略" prop="strategyCode">
                <el-input :disabled="infoFlag === 'detail'" v-model.trim="infoData.strategyCode" max-length="64" placeholder="请输入其他策略"></el-input>
              </el-form-item>
              <el-form-item label="策略参数" prop="strategyArg">
                <el-input :disabled="infoFlag === 'detail'" v-model.trim="infoData.strategyArg" max-length="64" placeholder="请输入策略参数"></el-input>
              </el-form-item>
            </div>
            <div style="max-width: 600px;">
              <el-form-item label="备注" prop="remark">
                <el-input :disabled="infoFlag === 'detail'" v-model.trim="infoData.remark" max-length="256" placeholder="请输入备注"></el-input>
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
      businessTypeText: {
        1: '供应服务',
        2: '配送服务'
      },
      businessType: [{
        label: '供应服务',
        value: 1
      }, {
        label: '配送服务',
        value: 2
      }],
      selectIds: [],
      infoTitleMap: {
        add: '新增计价规则',
        edit: '编辑计价规则',
        detail: '计价规则详情'
      },
      infoFlag: 'add',
      infoDialogFlag: false,
      infoData: {},
      infoRule: {
        ruleName: [
          { required: true, message: '请输入计价规则名称', trigger: 'blur' }
        ]
      }
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
          ruleId: 1258,
          ruleName: '配送规则1',
          fixAmount: '65',
          fixRate: '25.00',
          strategyCode: '叠加奖励',
          strategyArg: '每10单奖励5元',
          remark: '这是配送规则1的备注信息'
        }, {
          ruleId: 1587,
          ruleName: '配送规则2',
          fixAmount: '55',
          fixRate: '18.00',
          strategyCode: '叠加奖励',
          strategyArg: '每5单奖励3元',
          remark: '这是配送规则2的备注信息'
        }];
        this.page.totalCount = 105;
        this.loadingData = false;
      }, 500);
    },
    // 选中表格数据
    selectData(val) {
      this.selectIds = val.map((item) => { return item.ruleId; });
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
      this.$confirm('您确定删除选中的计价规则信息吗？', '批量删除计价规则', {
        type: 'warning'
      }).then(_ => {
        // TODO
        this.$log.info('批量删除元素，操作的ID列表为：', this.selectIds);
      }).catch(_ => {});
    },
    // 查看详情（单个）
    viewDetail(item) {
      this.infoFlag = 'detail';
      this.infoDialogFlag = true;
      this.$log.info('查看元素详情，操作的元素ID为：', item.ruleId);
    },
    // 编辑（单个）
    eidtItem(item) {
      this.infoFlag = 'edit';
      this.infoDialogFlag = true;
      this.$log.info('编辑元素，操作的元素ID为：', item.ruleId);
    },
    // 删除（单个）
    deleteItem(item) {
      this.$confirm('您确定删除当前计价规则信息吗？', '删除计价规则', {
        type: 'warning'
      }).then(_ => {
        // TODO
        this.$log.info('删除单个元素，操作的元素ID为：', this.selectIds);
      }).catch(_ => {});
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
