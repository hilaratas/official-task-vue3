<template>
  <form action="#" id="railage" class="form"
        :class="{'is-loading': pageLoading}" @submit.prevent="onSubmit"
        autocomplete="off"
  >
    <div class="form__row">
      <fieldset class="form__fieldset">
        <legend class="title--h5">Выберите тип вагона для перевозки</legend>
        <div class="grid grid--gap-15px">
          <div v-for="c in carriageConfig" class="grid__col grid__col--auto">
            <railage-carriage :value="c.value" :label="c.label" v-model="railage.carriage" :is-checked="c.default"></railage-carriage>
          </div>
        </div>
      </fieldset>
      <div v-if="v$.railage.carriage.$errors.length" class="form__row form__row--mt-10px">
        <small class="control-error">Выберите тип вагона</small>
      </div>
    </div>
    <div class="form__row">
      <fieldset class="form__fieldset">
        <legend class="title--h5">Выберите срочность</legend>
        <div class="form">
          <div v-for="u in urgencyConfig" class="form__row form__row--mt-10px">
            <app-radio :label="u.label" :value="u.value" name="railage-urgency" v-model="railage.urgency" :is-checked="u.default"></app-radio>
          </div>
        </div>
      </fieldset>
      <div v-if="v$.railage.urgency.$errors.length" class="form__row form__row--mt-10px">
        <small class="control-error">Выберите срочность</small>
      </div>
    </div>
    <div class="form__row">
      <fieldset class="form__fieldset">
        <legend class="title--h5">Выберите пункт отгрузки</legend>
        <div class="grid">
          <div class="grid__col">
            <vue-dadata3 v-model="railage.from" :token="dadataToken" @on-selected="onSelectFrom" @input="onInputFrom"></vue-dadata3>
          </div>
        </div>
      </fieldset>
      <div v-if="v$.railageFrom.$errors.length" class="form__row form__row--mt-10px">
        <small class="control-error">Выберите пункт отгрузки из выпадающего списка адресов</small>
      </div>
    </div>
    <div class="form__row">
      <fieldset class="form__fieldset">
        <label class="title--h5" for="railage-to">Выберите пункт доставки</label>
        <div class="grid">
          <div class="grid__col">
            <vue-dadata3 v-model="railage.to" :token="dadataToken" @on-selected="onSelectTo" @input="onInputTo"></vue-dadata3>
          </div>
        </div>
      </fieldset>
      <div v-if="v$.railageTo.$errors.length" class="form__row form__row--mt-10px">
        <small class="control-error">Выберите пункт доставки из выпадающего списка адресов</small>
      </div>
    </div>
    <div class="form__row">
      <div class="grid grid--gap-30px">
        <div class="grid__col grid__col--auto">
          <button type="submit" class="button">Рассчитать стоимость перевозки</button>
        </div>
        <div v-if="costStr" class="grid__col">
          <div class="title title--h5" v-html="costStr"></div>
        </div>
      </div>
    </div>
  </form>
</template>

<script setup>
  import {useStore} from "vuex";
  import {onMounted, reactive, ref} from "vue";
  import RailageCarriage from "@/components/culculator/RailageCarriage.vue"
  import AppRadio from "@/components/AppRadio.vue";
  import carriageConfig from "@/config/railage.carriage.config"
  import urgencyConfig from "@/config/railage.urgency.config"
  import { useVuelidate } from "@vuelidate/core"
  import { required } from "@vuelidate/validators"
  import { DaDataNext as VueDadata3 } from 'vue-dadata-3'
  import calcDistance from "@/utils/calcDistance";

  const store = useStore()
  const tariff = ref({})
  const tariffStorage = JSON.parse(localStorage.getItem('tariff'))
  const pageLoading = ref(true)
  const isTariffRelevant = ref(false)
  const railage = reactive({
    carriage: carriageConfig[0].value,
    urgency: urgencyConfig[0].value,
    from: "",
    to: "",
  })
  const railageTo = ref(null)
  const railageFrom = ref(null)
  const dadataToken = process.env["VUE_APP_DADATA_API_KEY"]
  let costStr = ref(0)
  const railageRules = {
    railage: {
      carriage: { required },
      urgency: { required },
    },
    railageTo: { required },
    railageFrom: { required },
  }
  const v$ = useVuelidate(railageRules, { railage, railageTo, railageFrom })
  const onInputTo = (event) => { railageTo.value = null }
  const onInputFrom = (event) => { railageFrom.value = null }
  const onSelectTo = (data) => { railageTo.value = data }
  const onSelectFrom = (data) => { railageFrom.value = data }

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
      tariff.value = tariffStorage
      return
    }

    const {result, data} = await store.dispatch('tariff/fetchTariff')
    if ( result ) {
      tariff.value = data
      store.commit("tariff/setTariff", tariff.value)
    }
    pageLoading.value = false
  })

  const onSubmit = () => {
    v$.value.$touch()
    if (v$.value.$error)
      return

    if (!railageFrom.value && !railageTo.value) {
      costStr.value = "Во время расчета произошла ошибка. <br> Повторите попытку позже"
      return
    }

    let a = {lat: +railageFrom.value.data.geo_lat, lon: +railageFrom.value.data.geo_lon}
    let b = {lat: +railageTo.value.data.geo_lat, lon: +railageTo.value.data.geo_lon}
    const distance = calcDistance(a, b)
    const carriageRatio = tariff.value.carriage[railage.carriage]
    const urgencyRatio = tariff.value.urgency[railage.urgency]
    costStr.value = `
      Расстояние для перевозки ${distance.toFixed(2)} км <br>
      Стоимость перевозки: ${(100 * carriageRatio * urgencyRatio * distance).toFixed(2)} руб.`
  }
</script>