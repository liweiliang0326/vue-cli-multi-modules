import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    storeProvinceEcode: null,
    storeCityEcode: "",
    storeProjectName: "",
    storeAqmToken: "",
    storeUserId: null
  },
  mutations: {
    // 设置token
    setStoreAqmToken(state, data) {
      state.storeAqmToken = data;
    },

    // 设置省公司ecode
    setStoreProvinceEcode(state, data) {
      state.storeProvinceEcode += data;
    },

    // 设置企业ecode
    setStoreCityEcode(state, data) {
      state.storeCityEcode = data;
    },

    // 设置项目名称
    setStoreProjectName(state, data) {
      state.storeProjectName = data;
    },

    // 设置userId
    setStoreUserId(state, data) {
      state.storeUserId = data;
    }

  }
})
