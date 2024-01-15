import http from '@/http';

export const tariff = {
  namespaced: true,
  state: {
    tariff: {}
  },
  getters: {
    tariff: state => state.tariff
  },
  mutations: {
    setTariff(state, tariff) {
      state.tariff = tariff
      localStorage.setItem("tariff", JSON.stringify(tariff))
    }
  },
  actions: {
    async fetchTariff({commit}){
      try {
        const {data} = await http.get(`/tarif.json`)
        if (data) {
          return {result: true, data}
        }
      } catch (e) {
        return { result: false, data: null }
      }
    }
  }
}