<template>
  <div>
    <v-progress-circular v-if="!loggedOut" indeterminate color="purple"></v-progress-circular>
    <div v-if="loggedOut">Succesfully logged out. <router-link to="/login">Login again.</router-link></div>
  </div>
</template>

<script>
import UserService from '@/services/UserService';

export default {
  name: 'LogoutLanding',
  data: () => ({
    loggedOut: false,
    userid: -1
  }),
  methods: {
    async logout() {
      if (this.userid) {
        const logoutResponse = await UserService.logout();
        if (logoutResponse.status === 200) {
          this.$cookies.remove('username');
          this.$cookies.remove('userid');
          this.$cookies.remove('admin');
          this.loggedOut = true;
        }
      } else {
        this.loggedOut = true;
      }
    }
  },
  async mounted() {
    if (this.$cookies.get('userid')) {
      this.userid = this.$cookies.get('userid');
    }
    this.logout();
  }
}
</script>