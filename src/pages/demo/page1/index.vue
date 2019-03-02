<template>
  <d2-container :filename="filename">
    <template slot="header">话题查询</template>
    <d2-crud class="hhh"
      :columns="columns"
      :data="data"
      :loading="loading"
      :pagination="pagination"
      @pagination-current-change="paginationCurrentChange"
      @selection-change="handleSelectionChange"
      :rowHandle="rowHandle"
      :form-options="formOptions"
      @custom-emit="handleCustomEvent"
      @custom-emit-2="handleCustomEvent2"
      @dialog-cancel="handleDialogCancel">
      <el-form slot="header" :rules="rules" :inline="true" ref="ruleForm" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-button type="primary" circle icon="el-icon-refresh" @click="fetchData"></el-button>
        </el-form-item>
        <el-form-item prop="queryInput">
          <!-- <el-input v-model="formInline.user" placeholder="审批人"></el-input> -->
          <el-input v-model="formInline.queryInput" placeholder="请输入话题名称"></el-input>
        </el-form-item>
        <el-form-item>
          <!-- <el-button type="primary" @click="onSubmit">查询</el-button> -->
          <el-button type="primary" @click="queryTopic">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- <el-input slot="header" v-model="queryInput" placeholder="请输入内容"></el-input>
      <el-button slot="header" style="margin-bottom: 5px" @click="queryTopic">查询</el-button> -->
    </d2-crud>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose">
      <el-form :model="editForm" :rules="rules" ref="ruleForm2" label-width="100px" class="demo-ruleForm" v-loading="loading1">
        <el-form-item label="话题名称" prop="topicName">
          <el-input v-model="editForm.topicName" disabled style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item label="话题图片" prop="topicAvatar">
          <el-upload
            ref="upload"
            class="avatar-uploader"
            action="/img/uploadTopicAvatar"
            :show-file-list="false"
            :on-preview="handleAvatarPreview"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :auto-upload="false"
            :on-change="handleChange"
            :data="{ topicName: editForm.topicName }">
            <img v-if="imageUrl" :src="editForm.topicAvatar" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="话题描述" prop="topicDescribe">
          <d2-quill
            style="min-height: 200px;"
            v-model="editForm.topicDescribe"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleRowEdit">确 定</el-button>
      </span>
    </el-dialog>
  </d2-container>
</template>

<script>
import { getTopicGet, getSomeTopicDetailGet, deleteTopicGet, addTopicGet } from '@/api/sys.topic'
import EditQuill from '../component/edit-quill'
import Upload from '../component/upload'
import Tag from '../component/Tag'
import Image from '../component/image'
export default {
  name: 'page1',
  components: {
    EditQuill
  },
  data () {
    return {
      editForm: {},
      selectImage: false,
      dialogVisible: false,
      labelPosition: 'right',
      formLabelAlign: {},
      filename: __filename,
      formInline: {
        queryInput: ''
      },
      selection: [],
      selectionTopics: [],
      rules: {
        queryInput: [
          { required: true, message: '请输入话题名称', trigger: 'blur' }
        ]
      },
      columns: [
        {
          title: '状态',
          key: 'topicHandled',
          width: 80,
          filters: [
            { text: '未禁用', value: false },
            { text: '已禁用', value: true }
          ],
          filterMethod (value, row) {
            return !!row.topicHandled === value
          },
          filterPlacement: 'bottom-end',
          component: {
            name: Tag
          }
        },
        {
          title: '话题图片',
          key: 'topicAvatar',
          width: 100,
          component: {
            name: Image
          }
        },
        {
          title: '话题名称',
          key: 'topicName',
          width: 120
        },
        {
          title: '话题描述',
          key: 'topicDescribe',
          showOverflowTooltip: true,
          formatter: (row, column, cellValue, index) => {
            return cellValue.replace(/<[^>]+>/g, '')
          }
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
        custom: [ {
          icon: 'el-icon-edit',
          text: '编辑',
          type: 'primary',
          size: 'small',
          emit: 'custom-emit'
        }, {
          text: '禁用',
          type: 'danger',
          size: 'small',
          emit: 'custom-emit-2',
          show (index, row) {
            if (!row.topicHandled) {
              return true
            }
            return false
          }
        },
        {
          text: '启用',
          type: 'success',
          size: 'small',
          emit: 'custom-emit-2',
          show (index, row) {
            if (row.topicHandled) {
              return true
            }
            return false
          }
        } ],
        width: 200
      },
      data: [],
      loading: false,
      loading1: false,
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
        topicAvatar: {
          title: '话题图片',
          value: '',
          component: {
            name: Upload,
            props: {
              topicName: this.topicName
            }
          }
        },
        topicDescribe: {
          title: '话题描述',
          value: '',
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
      },
      imageUrl: ''
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
    handleRowEdit () {
      this.loading1 = true
      addTopicGet({
        topicName: this.editForm.topicName,
        topicDescribe: this.editForm.topicDescribe
      }).then(res => {
        if (res) {
          if (this.selectImage) {
            this.$refs.upload.submit()
          } else {
            this.$message({
              message: '编辑成功',
              type: 'success'
            })
            this.loading1 = false
            this.dialogVisible = false
            this.queryTopic()
          }
        } else {
          this.$message({
            message: '编辑失败',
            type: 'error'
          })
          this.loading1 = false
          this.dialogVisible = false
        }
      }).catch(err => {
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
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.formInline.queryInput) {
            this.loading = true
            getSomeTopicDetailGet({
              topicName: this.formInline.queryInput
            }).then(res => {
              console.log(res)
              this.data = res
              this.pagination.total = res.length
              this.loading = false
            }).catch(err => {
              console.log(err)
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
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
    },
    handleCustomEvent ({ index, row }) {
      this.editForm = {}
      this.imageUrl = row.topicAvatar
      console.log(this.imageUrl)
      console.log(row)
      this.editForm = Object.assign({}, row)
      this.dialogVisible = true
    },
    handleClose (done) {
      done()
    },
    handleAvatarSuccess (res, file) {
      this.$message({
        message: '编辑成功',
        type: 'success'
      })
      this.loading1 = false
      this.dialogVisible = false
      this.queryTopic()
    },
    handleAvatarPreview (file) {
      console.log(file)
    },
    handleChange (file, fileList) {
      console.log(fileList)
      console.log(file)
      const isJPG = file.raw.type === 'image/jpeg'
      const isLt2M = file.raw.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      } else if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      } else {
        this.editForm.topicAvatar = URL.createObjectURL(file.raw)
        this.imageUrl = this.editForm.topicAvatar
        this.selectImage = true
      }
      return isJPG && isLt2M
    },
    beforeAvatarUpload (file) {
    },
    handleCustomEvent2 ({ index, row }) {
      deleteTopicGet({
        topicName: row.topicName,
        topicHandled: !row.topicHandled
      }).then(res => {
        if (res) {
          console.log(res)
          this.$message({
            message: `${!row.topicHandled ? '禁用' : '启用'}成功`,
            type: 'success'
          })
          this.fetchData()
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.hhh>>>.el-col-24:last-child .el-form-item__content{
  height: 286px;
  line-height: 0;
}
.hhh>>>.el-col-24 .d2-container-full__body{
  padding: 0 !important;
}
.hhh>>>.el-col-24 .d2-container-full{
  border: none !important;
}
.avatar-uploader .el-upload {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
