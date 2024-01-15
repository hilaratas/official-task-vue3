<template>
  <div v-if="pageLoading">
    Страница грузиться
  </div>
  <form v-else action="#" id="railage" @submit.prevent="onSubmit">
    <div class="form__row">
      <fieldset class="form__fieldset">
        <legend class="title--h5">Выберите тип вагона для перевозки</legend>
        <div class="grid grid--gap-15px">
          <div class="grid__col-6">
            <railage-carrige
              radio-value="1"
              label="Полувагон"
            ></railage-carrige>
          </div>
          <div class="grid__col-6">
            <railage-carrige
              radio-value="2"
              label="Хоппер"
            ></railage-carrige>
          </div>
          <div class="grid__col-6">
            <railage-carrige
              radio-value="3"
              label="Холодильник"
            ></railage-carrige>
          </div>
          <div class="grid__col-6">
            <railage-carrige
              radio-value="4"
              label="Крытый вагон"
            ></railage-carrige>
          </div>
          <div class="grid__col-6">
            <railage-carrige
              radio-value="5"
              label="Спец. транспорт"
            ></railage-carrige>
          </div>
        </div>
      </fieldset>
    </div>
    <div class="form__row">
      <fieldset class="form__fieldset">
        <legend class="title--h5">Выберите срочность</legend>
        <radio label="Обычная" value="standart" name="railage-urgency" :is-checked="false"></radio>
        <div style="height: 10px"></div>
        <radio label="Срочная" value="urgently" name="railage-urgency" :is-checked="false"></radio>
      </fieldset>
    </div>
    <div class="form__row">
      <fieldset class="form__fieldset">
        <legend class="title--h5">Выберите пункт отгрузки</legend>
        <div class="grid">
          <div class="grid__col">
            <input class="input" type="text" name="railage-from">
          </div>
        </div>
      </fieldset>
    </div>
    <div class="form__row">
      <fieldset class="form__fieldset">
        <legend class="title--h5">Выберите пункт доставки</legend>
        <div class="grid">
          <div class="grid__col">
            <input class="input" type="text" name="railage-to">
          </div>
        </div>
      </fieldset>
    </div>
  </form>
</template>

<script setup>
  import {useStore} from "vuex";
  import {onMounted, ref} from "vue";
  import RailageCarrige from "@/components/culculator/RailageCarrige.vue";
  import Radio from "@/components/Radio.vue";

  const store = useStore()
  const tariff = ref({})
  const tariffStorage = JSON.parse(localStorage.getItem('tariff'))
  const pageLoading = ref(true)
  const isTariffRelevant = ref(false)

  onMounted(async () => {
    let validUntil;
    let nowDate;

    if ( tariffStorage != null ) {
      validUntil = new Date (tariffStorage.validUntil)
      nowDate = Date.now()
      isTariffRelevant.value = validUntil > nowDate
    }

    if (isTariffRelevant.value) {
      pageLoading.value = false
      return
    }

    const {result, data} = await store.dispatch('tariff/fetchTariff')
    if ( result ) {
      tariff.value = data
      store.commit("tariff/setTariff", tariff.value)
    }
    pageLoading.value = false
  })

  onSubmit = () => {
    console.log("Я тут")
  }
</script>