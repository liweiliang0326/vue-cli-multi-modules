import Vue from 'vue';
import Vuex from 'vuex';
import helmet from '../modules/helmet/store.js'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        helmet
    }
})
