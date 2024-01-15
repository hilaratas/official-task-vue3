<template>
  <section class="section">
    <div class="section__main-content">
      <div class="section__inner">
        <div class="container-fluid">
          <div class="row">
            <!-- Левая колонка -->
            <div class="col-sm-12">
              <!-- Основной контент -->
              <div class="section">
                <h1 class="title title--h3">Калькулятор стоимости железнодорожных перевозок.</h1>
                <railage-form></railage-form>
              </div>

              <the-tariff></the-tariff>
              <!-- Основной контент -->
            </div>
            <!-- /Левая колонка -->

          </div>
        </div>
      </div>
    </div> <!-- / .section__main-content -->

  </section>
</template>

<script>
// @ is an alias to /src

import TheTariff from "@/components/TheTariff.vue";
import RailageForm from "@/components/culculator/RailageForm.vue";

export default {
  name: 'Home',
  components: {RailageForm, TheTariff},
}
</script>
