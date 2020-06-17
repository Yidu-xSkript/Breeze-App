import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import VModal from 'vue-js-modal'

import Default from './components/Wrappers/baseLayout.vue';
import Pages from './components/Wrappers/cleanLayout.vue';

Vue.use(VModal)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.prototype.$isEmpty = function (obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
}
Vue.config.productionTip = false

Vue.component('default-layout', Default);
Vue.component('splash-layout', Pages);

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
