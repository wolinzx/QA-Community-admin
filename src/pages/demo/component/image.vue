<template>
  <div class="image">
    <img :src="value" alt="">
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      require: true
    }
  }
}
</script>

<style scoped>
.image img{
  width: 100%;
}
</style>
