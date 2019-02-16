<template>
  <d2-container :filename="filename">
    <template slot="header">话题查询</template>
    <d2-crud class="hhh"
      :columns="columns"
      :data="data"
      :loading="loading"
      :pagination="pagination"
      @pagination-current-change="paginationCurrentChange"
      selection-row
      @selection-change="handleSelectionChange"
      :rowHandle="rowHandle"
      :edit-template="editTemplate"
      :form-options="formOptions"
      @row-edit="handleRowEdit"
      @dialog-cancel="handleDialogCancel"
      @row-remove="handleRowRemove">
      <el-form slot="header" :rules="rules" :inline="true" ref="ruleForm" :model="formInline" class="demo-form-inline">
        <el-form-item label="话题名称" prop="queryInput">
          <!-- <el-input v-model="formInline.user" placeholder="审批人"></el-input> -->
          <el-input v-model="formInline.queryInput" placeholder="请输入话题名称"></el-input>
        </el-form-item>
        <el-form-item>
          <!-- <el-button type="primary" @click="onSubmit">查询</el-button> -->
          <el-button type="primary" @click="queryTopic">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="danger" @click="deleteSelect(selectionTopics)" :disabled="!selection.length">删除选中</el-button>
        </el-form-item>
      </el-form>
      <!-- <el-input slot="header" v-model="queryInput" placeholder="请输入内容"></el-input>
      <el-button slot="header" style="margin-bottom: 5px" @click="queryTopic">查询</el-button> -->
    </d2-crud>
  </d2-container>
</template>

<script>
import { getTopicGet, getTopicDetailGet, deleteTopicGet, addTopicGet } from '@/api/sys.topic'
import EditQuill from '../component/edit-quill'
export default {
  name: 'page1',
  components: {
    EditQuill
  },
  data () {
    return {
      filename: __filename,
      formInline: {
        queryInput: ''
      },
      selection: [],
      selectionTopics: [],
      rules: {
        // queryInput: [
        //   { required: true, message: '请输入话题名称', trigger: 'blur' }
        // ]
      },
      columns: [
        {
          title: 'ID',
          key: '_id',
          width: 220
        },
        {
          title: '话题名称',
          key: 'topicName',
          width: 120
        },
        {
          title: '话题描述',
          key: 'topicDescribe',
          showOverflowTooltip: true
        },
        {
          title: '提问数',
          key: 'topicQList.length',
          width: 80
        },
        {
          title: '添加日期',
          key: 'addDate',
          width: 180,
          formatter: (row, column, cellValue, index) => {
            return this.date_format(cellValue)
          }
        }
      ],
      rowHandle: {
        edit: {
          icon: 'el-icon-edit',
          text: '编辑',
          size: 'small',
          fixed: 'right'
        },
        remove: {
          icon: 'el-icon-delete',
          size: 'small',
          fixed: 'right',
          confirm: true
        },
        width: 200
      },
      data: [],
      loading: false,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      editTemplate: {
        _id: {
          title: 'ID',
          value: '',
          component: {
            span: 12,
            disabled: true
          }
        },
        topicName: {
          title: '话题名称',
          value: '',
          component: {
            span: 12,
            disabled: true
          }
        },
        topicDescribe: {
          title: '话题描述',
          value: false,
          component: {
            name: EditQuill
          }
        }
      },
      formOptions: {
        labelWidth: '80px',
        labelPosition: 'left',
        saveLoading: false,
        gutter: 20
      }
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    paginationCurrentChange (currentPage) {
      this.pagination.currentPage = currentPage
      this.fetchData()
    },
    fetchData () {
      this.loading = true
      getTopicGet({
        ...this.pagination
      }).then(res => {
        console.log(res)
        this.data = res.docs
        this.pagination.total = res.total
        this.loading = false
      }).catch(err => {
        this.loading = false
        console.log(err)
      })
    },
    handleRowEdit ({ index, row }, done) {
      addTopicGet({
        topicName: row.topicName,
        topicDescribe: row.topicDescribe
      }).then(res => {
        if (res) {
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
          done()
        } else {
          this.$message({
            message: '编辑失败',
            type: 'error'
          })
        }
      }).catch(err => {
        this.$message({
          message: '编辑失败',
          type: 'error'
        })
        throw err
      })
    },
    handleDialogCancel (done) {
      this.$message({
        message: '取消编辑',
        type: 'warning'
      })
      done()
    },
    handleRowRemove ({ index, row }, done) {
      this.deleteSelect(row.topicName)
    },
    queryTopic () {
      if (this.formInline.queryInput) {
        this.loading = true
        getTopicDetailGet({
          topicName: this.formInline.queryInput
        }).then(res => {
          this.data = res ? [res] : []
          this.loading = false
        }).catch(err => {
          console.log(err)
        })
      } else {
        this.fetchData()
        // return false
      }
    },
    deleteSelect (topicName) {
      deleteTopicGet({
        topicName
      }).then(res => {
        if (res) {
          console.log(res)
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.fetchData()
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleSelectionChange (selection) {
      console.log(selection)
      this.selection = selection
      for (const i of this.selection) {
        this.selectionTopics.push(i.topicName)
      }
    },
    date_format: (date) => {
      let dateObj = new Date(date)
      return `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()} ${dateObj.getHours()}:${dateObj.getMinutes()}:${dateObj.getSeconds()}`
    }
  }
}
</script>

<style scoped>
.hhh>>>.el-col-24 .el-form-item__content{
  height: 286px;
  line-height: 0;
}
.hhh>>>.el-col-24 .d2-container-full__body{
  padding: 0 !important;
}
.hhh>>>.el-col-24 .d2-container-full{
  border: none !important;
}
</style>
