import Vue from 'vue'
import VueCookies from 'vue-cookies';
import Vuex from 'vuex';
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'

Vue.config.productionTip = false

Vue.use(VueCookies);
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		username: '',
    userid: -1
	},
	mutations: {
		setUsername(state, username) {
			state.username = username;
		},
    setUserid(state, id) {
      state.id = id;
    },
    wipeState(state) {
      state.username = '',
      state.id = -1
    }
	}
})

new Vue({
  vuetify,
  router,
  store: store,
  render: h => h(App)
}).$mount('#app')
