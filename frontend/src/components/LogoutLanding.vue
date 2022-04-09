<template>
  <div>
    <v-progress-circular v-if="!loggedOut" indeterminate color="purple"></v-progress-circular>
    <div v-if="loggedOut">Succesfully logged out.</div>
  </div>
</template>

<script>
import UserService from '@/services/UserService';

export default {
  name: 'LogoutLanding',
  data: () => ({
    loggedOut: false
  }),
  methods: {
    async logout() {
      console.log('logout function');
      if (this.$store.state.username !== '') {
        const logoutResponse = await UserService.logout();
        if (logoutResponse.status === 200) {
          this.$store.commit('wipeState')
          this.loggedOut = true;
        }
      } else {
        this.$store.commit('wipeState')
        this.loggedOut = true;
      }
    }
  },
  async mounted() {
    console.log('logout mount');
    this.logout();
  }
}
</script>