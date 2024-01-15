<template>
  <div class='page__wrapper'>
    <div class='page__header'>
      <the-header></the-header>
    </div>

    <div class='page__middle'>
      <router-view></router-view>
    </div>

    <div class='page__footer'>
      <div class='footer-free'></div>
      <the-footer></the-footer>
    </div>
  </div>
</template>

<script setup>
import TheHeader from "@/components/TheHeader.vue";
import TheTariff from "@/components/TheTariff.vue";
import TheFooter from "@/components/TheFooter.vue";
</script>

<style lang="scss">
</style>
