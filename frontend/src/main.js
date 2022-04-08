import Vue from 'vue'
import VueCookies from 'vue-cookies';
import Vuex from 'vuex';
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'

Vue.config.productionTip = false

Vue.use(VueCookies);
Vue.use(Vuex)

// eslint-disable-next-line
const store = new Vuex.Store({
	state: {
		username: '',
	},
	mutations: {
		setUsername(state, username) {
			state.username = username;
		}
	}
})

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
