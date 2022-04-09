<template>
  <div id="app">
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click="showNavBar()"></v-app-bar-nav-icon>
      <v-toolbar-title>Simple Time Application</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list nav dense>
        <v-list-item-group v-model="group" active-class="deep-purple--text text--accent-4">
          <v-list-item @click="routeToDashboard">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item>
          <v-list-item @click="routeToLogout">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container>
          <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
  </div>
</template>

<script>
import UserService from '@/services/UserService';

export default {
  name: 'App',
  data: () => ({
    currentRoute: window.location.pathname,
    drawer: false,
    group: null,
    unauthenticatedRoutes: ['login', 'createUser']
  }),
  methods: {
      showNavBar() {
          this.drawer = true;
      },
      routeToDashboard() {
          if (this.$route.path != '/dashboard') {
              this.$router.push('dashboard');
          }
      },
      routeToLogout() {
          if (this.$route.path != '/logout') {
              this.$router.push('logout');
          }
      },
      async checkAuthentication(to) {
        const authResponse = await UserService.checkAuthentication();
        if (authResponse.data !== 'authenticated') {
          this.$cookies.remove('username');
          this.$cookies.remove('userid');
          if (to && !this.unauthenticatedRoutes.includes(to.path.substring(1))) {
            console.log('Sending to login');
            this.$router.push('login');
          }
        }
      }
  },
  mounted() {
    this.checkAuthentication(this.$route);
  },
  watch: {
    // eslint-disable-next-line
    '$route': async function(to, from) {
      this.checkAuthentication(to);
    }
  }
};
</script>

<style scoped>
</style>