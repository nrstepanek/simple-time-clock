import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/LoginForm';
import TimeClock from '@/components/TimeClock';
import LogoutLanding from '@/components/LogoutLanding';
import CreateUser from '@/components/CreateUser';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'LoginForm',
      component: Login
    },
    {
      path: '/logout',
      name: 'Logout',
      component: LogoutLanding
    },
    {
      path: '/createUser',
      name: 'CreateUser',
      component: CreateUser
    },
    {
      path: '/dashboard',
      name: 'TimeClock',
      component: TimeClock
    }
  ]
})