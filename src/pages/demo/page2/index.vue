<template>
  <d2-container>
    <template slot="header">添加话题</template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" v-loading="loading">
      <el-form-item label="话题名称" prop="topicName">
        <el-input v-model="ruleForm.topicName" style="width: 300px"></el-input>
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
          :data="{ topicName: ruleForm.topicName }">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="话题描述" prop="topicDescribe">
        <d2-quill
          style="min-height: 200px;"
          v-model="ruleForm.topicDescribe"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即添加</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </d2-container>
</template>

<script>
import { addTopicGet, getTopicDetailGet } from '@/api/sys.topic'
export default {
  data () {
    let validatePass = (rule, value, callback) => {
      getTopicDetailGet({
        topicName: value
      }).then(res => {
        if (res) {
          callback(new Error('该话题已存在'))
        } else {
          callback()
        }
      }).catch(err => {
        throw err
      })
    }
    return {
      ruleForm: {
        topicName: '',
        topicDescribe: ''
      },
      rules: {
        topicName: [
          { required: true, message: '请输入话题名称', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      },
      imageUrl: '',
      loading: false
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs.ruleForm.resetFields()
    },
    onSubmit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.loading = true
          addTopicGet({
            topicName: this.ruleForm.topicName,
            topicDescribe: this.ruleForm.topicDescribe
          }).then(res => {
            if (res === 'added') {
              this.$message({
                message: '该话题已存在',
                type: 'error'
              })
              this.loading = false
            } else {
              if (this.imageUrl) {
                this.$refs.upload.submit()
              } else {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.loading = false
              }
            }
          }).catch(err => {
            console.log(err)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleAvatarSuccess (res, file) {
      this.$message({
        message: '添加成功',
        type: 'success'
      })
      this.loading = false
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
        this.imageUrl = URL.createObjectURL(file.raw)
      }
      return isJPG && isLt2M
    },
    beforeAvatarUpload (file) {
    }
  }
}
</script>

<style scoped>
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
