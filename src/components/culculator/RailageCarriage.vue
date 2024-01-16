<script setup>
import {computed, defineEmits} from "vue";
const emit = defineEmits(["update:modelValue"]);
const props = defineProps({
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
  }
})
const model = computed({
  get: () => props.modelValue,
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>

<template>
  <label class="carriage">
    <input type="radio" name="railage-carriage" :value="value" v-model="model" :checked="isChecked">
    <span class="carriage__indicator">{{label}}</span>
  </label>
</template>