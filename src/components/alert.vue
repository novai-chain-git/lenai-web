<template>
  <div class="px12 h35 bdr8 bg fyc">
    <div class="flex items-center" text="c1 11px">
      <el-icon size="13px" class="mr-[8px]"><WarningFilled /></el-icon>
      {{ title }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: ''
  }
});
</script>

<style scoped lang="scss">
.bg {
  background-image: linear-gradient(180deg, #5ac27c 0%, #b2e235 100%);
  background-image: linear-gradient(
    180deg,
    rgba(90, 194, 124, 0.12) 0%,
    rgba(178, 226, 53, 0.12) 100%
  );
}
</style>
