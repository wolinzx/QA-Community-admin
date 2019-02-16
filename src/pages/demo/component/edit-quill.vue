<template>
  <d2-container :filename="filename">
    <d2-quill
      style="min-height: 200px;"
      v-model="content"
      @text-change="textChangeHandler"
      @selection-change="selectionChangeHandler"
      @editor-change="editorChangeHandler"/>
    <!-- <el-button
      type="primary"
      @click="handleAddRow">
      添加一行
    </el-button> -->
    <!-- <el-card shadow="never" class="d2-card d2-mt">
      <d2-highlight :code="value" format-html/>
    </el-card> -->
  </d2-container>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      require: true
    }
  },
  data () {
    return {
      filename: __filename,
      content: ''
    }
  },
  mounted () {
    this.content = this.value
    console.log(this.value)
  },
  methods: {
    handleAddRow () {
      this.content += '<p style="color: #409EFF;">我是新增的行</p>'
    },
    textChangeHandler (delta, oldDelta, source) {
      this.$emit('input', this.content)
      // console.log(delta, oldDelta, source)
      // console.groupEnd()
    },
    selectionChangeHandler (range, oldRange, source) {
      // console.group('QuillEditor selectionChangeHandler')
      // console.log(range, oldRange, source)
      // console.groupEnd()
    },
    editorChangeHandler (eventName, ...args) {
      // console.group('QuillEditor editorChangeHandler')
      // console.log(eventName, args)
      // console.groupEnd()
    }
  }
}
</script>
