import Vue from 'vue'
import App from './App.vue'
import JwPagination from 'jw-vue-pagination';
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import Cookies from "js-cookie";

Vue.use(Vuex);
Vue.component('jw-pagination', JwPagination);
Vue.config.productionTip = false

const store = new Vuex.Store({
  state: {
    savedtask: []
  },
  plugins: [
    createPersistedState({
      storage: {
        getItem: (key) => Cookies.get(key),
        setItem: (key, value) =>
          Cookies.set(key, value, { expires: 3, secure: true }),
        removeItem: (key) => Cookies.remove(key)
      }
    })
  ],
  mutations: {
    refresh: (state, payload) => state.savedtask = payload,
    
  }
});


new Vue({
  JwPagination,
  store,
  render: h => h(App),
}).$mount('#app')
