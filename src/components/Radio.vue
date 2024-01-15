<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  isChecked: {
    type: Boolean,
    required: false
  }
})
</script>

<template>
  <div class="grid">
    <div class="grid__col">
      <label class="radio">
        <input type="radio" :id="name + '-' + value" :name="name" :value="value" :checked="isChecked">
        <span class="radio__indicator"></span>
      </label>
      <label :for="'railage-urgency-' + value">{{ label }}</label>
    </div>
  </div>
</template>