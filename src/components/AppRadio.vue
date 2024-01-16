<script setup>
import {computed, defineEmits} from "vue";
const emit = defineEmits(["update:modelValue"]);
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
  },
  modelValue: {
    type: String,
    required: true
  },
})
const model = computed({
  get: () => props.modelValue,
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>

<template>
  <div class="grid">
    <div class="grid__col">
      <label class="radio">
        <input type="radio" :id="name + '-' + value" :name="name" :value="value" v-model="model" :checked="isChecked">
        <span class="radio__indicator"></span>
      </label>
      <label :for="'railage-urgency-' + value">{{ label }}</label>
    </div>
  </div>
</template>