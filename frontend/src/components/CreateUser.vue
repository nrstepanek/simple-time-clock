<template>
  <v-form v-model="valid">
    <v-text-field v-model="userData.username" :rules="usernameRules" :disabled="formDisabled"
      :error-messages='usernameTakenError()' label="Username" required/>
    <v-text-field v-model="userData.password" :rules="passwordRules" :disabled="formDisabled" label="Password" required/>
    <v-checkbox v-model="userData.admin" :disabled="formDisabled" label="Admin Account"/>
    <v-btn :disabled="!valid || formDisabled" color="success" class="mr-4" @click="submitUser">
      Submit
    </v-btn>
    <span>{{statusMessage}}</span>
  </v-form>
</template>

<script>
import UserService from '@/services/UserService'

export default {
  name: 'CreateUser',
  data: () => ({
    valid: false,
    formDisabled: false,
    statusMessage: '',
    userData: {
      username: '',
      password: '',
      admin: false,
    },
    takenUsernames: [],
    usernameRules: [
      v => /[a-zA-Z]{1,20}/.test(v) || 'Username must be 1-20 characters, alphabet only.'
    ],
    passwordRules: [
      v => /.+/.test(v) || 'Need a password.'
    ],
  }),
  mounted() {
    this.getUsernames();
  },
  methods: {
    async getUsernames() {
      const usernameResponse = await UserService.getUsernames();
      this.takenUsernames = usernameResponse.data;
    },
    async submitUser() {
      this.formDisabled = true;
      const createResponse = await UserService.createUser(this.userData);
      if (createResponse.status === 200) {
        this.statusMessage = "User created.";
        setTimeout(() => {
          this.$router.push('/login');
        }, 1000);
      } else {
        this.statusMessage = "Error creating user.";
      }
    },
    async clearForm() {
      this.userData.username = '';
      this.userData.password = '';
      this.userData.first_name = '';
      this.userData.last_name = '';
    },
    usernameTakenError() {
      return (!this.takenUsernames.includes(this.userData.username)) ? '' : 'This username is already taken.';
    }
  }
}
</script>