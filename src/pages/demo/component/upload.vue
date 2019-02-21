<template>
  <div>
    <el-upload
      ref="upload"
      class="avatar-uploader"
      action="/img/uploadTopicAvatar"
      :show-file-list="false"
      :on-preview="handleAvatarPreview"
      :on-success="handleAvatarSuccess"
      :auto-upload="false"
      :on-change="handleChange"
      :data="{ topicName: topicName }">
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
export default {
  props: {
    value: String,
    topicName: String
  },
  data () {
    return {
      imageUrl: ''
    }
  },
  mounted () {
    this.imageUrl = this.value
    console.log(this.topicName)
  },
  methods: {
    handleAvatarSuccess (res, file) {
      this.$emit('input', 'success')
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
