<template>
  <div class="page-main-container">
    <div class="list-page-container">
      <div class="search-container">
        <el-form :inline="true" ref="searchForm" :model="searchParams">
          <el-form-item prop="zoneName" label="配送点名称">
            <el-input clearable v-model="searchParams.zoneName" @keyup.enter.native="searchData" placeholder="请输入配送点名称"></el-input>
          </el-form-item>
          <el-form-item prop="region" label="地区">
            <el-cascader clearable :options="regionData" v-model="searchParams.region" placeholder="请选择地区" change-on-select></el-cascader>
          </el-form-item>
          <el-button type="primary" @click="page.pageNo = 1; searchData()">查询</el-button>
          <el-button type="info" @click="$refs.searchForm.resetFields(); searchData();">重置</el-button>
        </el-form>
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
          <el-table-column prop="code" label="编码">
            <template slot-scope="scope">
              <div class="table-link" @click="viewDetail(scope.row)">{{scope.row.code}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="zoneName" label="名称">
          </el-table-column>
          <el-table-column prop="province" label="省份">
          </el-table-column>
          <el-table-column prop="city" label="城市">
          </el-table-column>
          <el-table-column prop="region" label="区县">
          </el-table-column>
          <el-table-column prop="street" label="街道">
          </el-table-column>
          <el-table-column prop="address" label="详细地址">
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
          <div class="flex-row" v-if="infoFlag !== 'add'">
            <el-form-item label="编码" prop="code">
              <el-input disabled v-model.trim="infoData.code" placeholder="请输入编码"></el-input>
            </el-form-item>
          </div>
          <div class="base-info">
            <div style="max-width: 600px;">
              <el-form-item label="名称" prop="zoneName">
                <el-input :disabled="infoFlag === 'detail'" v-model.trim="infoData.zoneName" max-length="64" placeholder="请输入配送点名称"></el-input>
              </el-form-item>
            </div>
            <div style="max-width: 600px;">
              <el-form-item label="地址" prop="region">
                <el-cascader :disabled="infoFlag === 'detail'" :options="regionData" v-model="infoData.region" placeholder="请选择地址" change-on-select></el-cascader>
              </el-form-item>
            </div>
            <div style="max-width: 600px;">
              <el-form-item label="详细地址" prop="address">
                <el-input :disabled="infoFlag === 'detail'" v-model.trim="infoData.address" max-length="64" placeholder="请输入详细地址"></el-input>
              </el-form-item>
            </div>
            <div style="max-width: 600px;">
              <el-form-item label="备注" prop="remark">
                <el-input :disabled="infoFlag === 'detail'" v-model.trim="infoData.remark" max-length="256" placeholder="请输入备注信息"></el-input>
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
import { regionData } from 'element-china-area-data'
export default {
  components: {},
  data() {
    return {
      checkAuth: utils.checkAuth,
      loadingData: false,
      searchParams: {
        zoneName: '',
        region: []
      },
      regionData: regionData,
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
        add: '新增配送点',
        edit: '编辑配送点',
        detail: '配送点详情'
      },
      infoFlag: 'add',
      infoDialogFlag: false,
      infoData: {},
      infoRule: {
        zoneName: [
          { required: true, message: '请输入配送点名称', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择地址', trigger: 'blur' }
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
        this.$log.info('查询数据，查询条件为：', this.searchParams, '； 分页信息为：', this.page);
        this.data = [{
          code: 1244,
          zoneName: '马兰坡配送点',
          province: '河南省',
          city: '郑州市',
          region: '中原区',
          street: '人民路',
          address: '海门街道118号',
          remark: '这是河南郑州的配送点，负责人张三'
        }, {
          code: 1255,
          zoneName: '海狮配送点',
          province: '广东省',
          city: '广州市',
          region: '天河区',
          street: '黄岗大道',
          address: '天正平路29号',
          remark: '这是广东广州的配送点，负责人李四'
        }];
        this.page.totalCount = 105;
        this.loadingData = false;
      }, 500);
    },
    // 选中表格数据
    selectData(val) {
      this.selectIds = val.map((item) => { return item.code; });
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
      this.$confirm('您确定删除选中的配送点信息吗？', '批量删除配送点', {
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
      this.$log.info('查看元素详情，操作的元素ID为：', item.code);
    },
    // 编辑（单个）
    eidtItem(item) {
      this.infoFlag = 'edit';
      this.infoDialogFlag = true;
      this.$log.info('编辑元素，操作的元素ID为：', item.code);
    },
    // 删除（单个）
    deleteItem(item) {
      this.$confirm('您确定删除当前配送点信息吗？', '删除配送点', {
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
