<template>
  <d2-container>
    <template slot="header">举报管理</template>
    <d2-crud
      :columns="columns"
      :data="data"
      :loading="loading"
      :pagination="pagination"
      @pagination-current-change="paginationCurrentChange"
      :rowHandle="rowHandle"
      @custom-emit="handleCustomEvent"
      @custom-emit-2="handleCustomEvent2">
      <el-form slot="header">
        <el-form-item>
          <el-button type="primary" circle icon="el-icon-refresh" @click="fetchData"></el-button>
        </el-form-item>
      </el-form>
    </d2-crud>
    <el-dialog
      :title="`被举报${type}详情`"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose">
      <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign" v-if="switchQA">
        <el-form-item label="提问者">
          <span>{{formLabelAlign.questioner}}</span>
        </el-form-item>
        <el-form-item label="标题">
          <span>{{formLabelAlign.title}}</span>
        </el-form-item>
        <el-form-item label="内容">
          <!-- <el-input v-model="formLabelAlign.contentData"></el-input> -->
          <div style="max-height: 300px; overflow: auto;" v-html="formLabelAlign.contentData"></div>
        </el-form-item>
        <el-form-item label="回答数">
          <span>{{formLabelAlign.answers}}</span>
        </el-form-item>
        <el-form-item label="关注数">
          <span>{{formLabelAlign.follows}}</span>
        </el-form-item>
        <el-form-item label="举报类型">
          <span>{{formLabelAlign.type}}</span>
        </el-form-item>
        <el-form-item label="举报状态">
          <el-tag :type="!!formLabelAlign.handled ? 'danger' : 'success'">{{!!formLabelAlign.handled ? '已封禁' : '未封禁'}}</el-tag>
        </el-form-item>
      </el-form>
      <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign" v-else>
        <el-form-item label="回答者">
          <span>{{formLabelAlign.answerer}}</span>
        </el-form-item>
        <el-form-item label="内容">
          <!-- <el-input v-model="formLabelAlign.contentData"></el-input> -->
          <div style="max-height: 300px; overflow: auto;" v-html="formLabelAlign.contentData"></div>
        </el-form-item>
        <el-form-item label="赞同数">
          <span>{{formLabelAlign.endorseCount}}</span>
        </el-form-item>
        <el-form-item label="回答时间">
          <span>{{date_format(formLabelAlign.answerDate)}}</span>
        </el-form-item>
        <el-form-item label="举报类型">
          <span>{{formLabelAlign.type}}</span>
        </el-form-item>
        <el-form-item label="举报状态">
          <el-tag :type="formLabelAlign.handled ? 'danger' : 'success'">{{formLabelAlign.handled ? '已封禁' : '未封禁'}}</el-tag>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </d2-container>
</template>

<script>
import { getReportGet, getHandleReportGet } from '@/api/sys.report'
import Tag from '../report/components/Tag'
export default {
  name: 'page1',
  data () {
    return {
      dialogVisible: false,
      labelPosition: 'right',
      formLabelAlign: {},
      columns: [
        {
          title: '状态',
          key: 'handle',
          width: 100,
          filters: [
            { text: '未封禁', value: false },
            { text: '已封禁', value: true }
          ],
          filterMethod (value, row) {
            return row.handle === value
          },
          filterPlacement: 'bottom-end',
          component: {
            name: Tag
          }
        },
        {
          title: '举报者',
          key: 'reporter',
          width: 120
        },
        {
          title: '举报类型',
          key: 'reportType',
          width: 120,
          filters: [
            { text: '垃圾广告信息', value: '垃圾广告信息' },
            { text: '涉嫌侵权', value: '涉嫌侵权' },
            { text: '有害信息', value: '有害信息' },
            { text: '低质问题', value: '低质问题' }
          ],
          filterMethod (value, row) {
            return row.reportType === value
          },
          filterPlacement: 'bottom-end'
        },
        {
          title: '问题',
          key: 'reportQId.title',
          formatter: (row, column, cellValue, index) => {
            if (!cellValue) {
              return '无'
            } else {
              return cellValue
            }
          },
          showOverflowTooltip: true
        },
        {
          title: '回答',
          key: 'reportAId.contentData',
          formatter: (row, column, cellValue, index) => {
            if (!cellValue) {
              return '无'
            } else {
              let data = cellValue.replace(/<[^>]+>/g, '')
              let data1 = data.replace(/编辑于\s[0-9]{4}-[0-9]{1,2}-[0-9]{1,2}\s·\s著作权归作者所有/ig, '')
              return data1
            }
          },
          showOverflowTooltip: true
        },
        {
          title: '举报时间',
          key: 'reportDate',
          width: 180,
          formatter: (row, column, cellValue, index) => {
            return this.date_format(cellValue)
          },
          sortable: true
        }
      ],
      rowHandle: {
        custom: [
          {
            text: '查看详情',
            type: 'primary',
            size: 'small',
            emit: 'custom-emit-2'
          },
          {
            text: '封禁',
            type: 'danger',
            size: 'small',
            emit: 'custom-emit',
            show (index, row) {
              if (!row.handle) {
                return true
              }
              return false
            }
          },
          {
            text: '解除',
            type: 'success',
            size: 'small',
            emit: 'custom-emit',
            show (index, row) {
              if (row.handle) {
                return true
              }
              return false
            }
          }
        ],
        width: 200
      },
      data: [],
      loading: false,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      switchQA: false,
      type: ''
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    handleClose (done) {
      done()
    },
    paginationCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.fetchData()
    },
    fetchData () {
      this.loading = true
      // BusinessTable1List({
      //   ...this.pagination
      // }).then(res => {
      //   this.data = res.list
      //   this.pagination.total = res.page.total
      //   this.loading = false
      // }).catch(err => {
      //   console.log('err', err)
      //   this.loading = false
      // })
      getReportGet({
        ...this.pagination
      }).then(res => {
        if (res.docs.length) {
          for (const i of res.docs) {
            i['handle'] = i.reportQId ? i.reportQId.handled : i.reportAId.handled
          }
          this.data = res.docs
          console.log(this.data)
          this.pagination.total = res.total
        }
        this.loading = false
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    date_format: (date) => {
      let dateObj = new Date(date)
      return `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()} ${dateObj.getHours()}:${dateObj.getMinutes()}:${dateObj.getSeconds()}`
    },
    handleCustomEvent ({ index, row }) {
      console.log(row.reportQId)
      console.log(row.reportAId)
      let params = {
        reportQId: row.reportQId ? row.reportQId._id : '',
        reportAId: row.reportAId ? row.reportAId._id : '',
        handle: !row.handle
      }
      console.log(params)
      getHandleReportGet(params).then(res => {
        console.log(res)
        if (res) {
          this.fetchData()
          this.$message({
            message: `${row.handle ? '解除' : '封禁'}成功`,
            type: 'success'
          })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleCustomEvent2 ({ index, row }) {
      this.switchQA = !!row.reportQId
      if (this.switchQA) {
        this.type = '提问'
      } else {
        this.type = '回答'
      }
      this.formLabelAlign = row.reportQId || row.reportAId
      // this.formLabelAlign['handle'] = row.handle
      this.formLabelAlign['type'] = row.reportType
      this.dialogVisible = true
    }
  }
}
</script>
