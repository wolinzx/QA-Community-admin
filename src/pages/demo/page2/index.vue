<template>
  <d2-container>
    <template slot="header">添加话题</template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="话题名称" prop="topicName">
        <el-input v-model="ruleForm.topicName" style="width: 300px"></el-input>
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
      }
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
      addTopicGet({
        topicName: this.ruleForm.topicName,
        topicDescribe: this.ruleForm.topicDescribe
      }).then(res => {
        if (res === 'added') {
          this.$message({
            message: '该话题已存在',
            type: 'error'
          })
        } else if (res) {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
