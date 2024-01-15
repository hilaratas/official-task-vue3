<script setup>
  const props = defineProps({
    radioValue: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    }
  })
</script>

<template>
  <label class="carriage">
    <input type="radio" name="railage-carriage" value="radioValue">
    <span class="carriage__indicator">{{label}}</span>
  </label>
</template>