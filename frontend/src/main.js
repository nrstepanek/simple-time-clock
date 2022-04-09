import Vue from 'vue'
import VueCookies from 'vue-cookies';
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'

Vue.config.productionTip = false

Vue.use(VueCookies);

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
