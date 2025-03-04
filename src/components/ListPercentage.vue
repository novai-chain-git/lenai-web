<template>
  <div class="text-[12px] text-c8">
    <template v-for="(item, key) in list" :key="item.label">
      <div class="flex justify-between items-center h-[30px]">
        <div border-b="1 solid bc1" class="h100% fyc">{{ item.label }}</div>
        <div class="font-[OrbitronMedium]">
          <span v-if="item.value" :class="{ 'text-c10': item.type === true }">{{
            `${item.value}${notation}`
          }}</span>
          <span v-else>--</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  list: {
    type: Array,
    default: ''
  },
  notation: {
    type: String,
    default: '%'
  }
});

const onSubmit = (vl) => {
  console.log(vl, '');
};
</script>

<style scoped lang="scss"></style>
