<template>
  <div v-if="pageLoading">
    Страница грузиться
  </div>
  <form v-else action="#" id="railage" @submit.prevent="onSubmit">
    <div class="form__row">
      <fieldset class="form__fieldset">
        <legend class="title--h5">Выберите тип вагона для перевозки</legend>
        <div class="grid grid--gap-15px">
          <div v-for="c in carriageConfig" class="grid__col-6">
            <railage-carriage :value="c.value" :label="c.label" v-model="railage.carriage" :is-checked="c.default"></railage-carriage>
          </div>
        </div>
      </fieldset>
      <div v-if="v$.carriage.$errors.length" class="form__row form__row--mt-10px">
        <small class="control-error">Выберите тип вагона</small>
      </div>
    </div>
    <div class="form__row">
      <fieldset class="form__fieldset">
        <legend class="title--h5">Выберите срочность</legend>
        <div v-for="u in urgencyConfig">
          <app-radio :label="u.label" :value="u.value" name="railage-urgency" v-model="railage.urgency" :is-checked="u.default"></app-radio>
        </div>
      </fieldset>
      <div v-if="v$.urgency.$errors.length" class="form__row form__row--mt-10px">
        <small class="control-error">Выберите срочность</small>
      </div>
    </div>
    <div class="form__row">
      <fieldset class="form__fieldset">
        <legend class="title--h5">Выберите пункт отгрузки</legend>
        <div class="grid">
          <div class="grid__col">
            <input class="input" type="text" name="railage-from" v-model="railage.from">
          </div>
        </div>
      </fieldset>
      <div v-if="v$.from.$errors.length" class="form__row form__row--mt-10px">
        <small class="control-error">Введите пункт отгрузки</small>
      </div>
    </div>
    <div class="form__row">
      <fieldset class="form__fieldset">
        <legend class="title--h5">Выберите пункт доставки</legend>
        <div class="grid">
          <div class="grid__col">
            <input class="input" type="text" name="railage-to" v-model="railage.to">
          </div>
        </div>
      </fieldset>
      <div v-if="v$.to.$errors.length" class="form__row form__row--mt-10px">
        <small class="control-error">Введите пункт доставки</small>
      </div>
    </div>
    <div class="form__row">
      <div class="grid grid--gap-30px">
        <div class="grid__col grid__col--auto">
          <button type="submit" class="button">Расчитать стоимость перевозки</button>
        </div>
        <div v-if="cost" class="grid__col">
          <div class="title title--h5">
            Стоимость перевозки: {{cost}} руб.</div>
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
  import RandomMinMax from "@/utils/randomMinMax"

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
  let cost = ref(0)

  const railageRules = {
    carriage: { required },
    urgency: { required },
    from: { required },
    to: { required },
  }
  const v$ = useVuelidate(railageRules, railage)

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

    const distance = RandomMinMax(100, 10000)
    const carriageRatio = tariff.value.carriage[railage.carriage]
    const urgencyRatio = tariff.value.urgency[railage.urgency]
    cost.value = (100 * carriageRatio * urgencyRatio * distance).toFixed(2)
  }
</script>