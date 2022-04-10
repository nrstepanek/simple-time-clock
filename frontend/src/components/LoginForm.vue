<template>
	<div>
		<v-form v-model="valid">
			<v-text-field
        v-model="loginData.username"
        :rules="usernameRules"
        :disabled="formDisabled"
        label="Username"
        required
      />
			<v-text-field
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :type="showPassword ? 'text' : 'password'"
        v-model="loginData.password"
        :rules="passwordRules"
        :disabled="formDisabled"
        label="Password"
        @click:append="showPassword = !showPassword"
        required
      />
			<v-btn :disabled="!valid || formDisabled" color="success" class="mr-4" @click="submitLogin">
				Login
			</v-btn>
			<v-progress-circular v-if="showLoading" indeterminate color="purple"></v-progress-circular>
			<span>{{this.statusMessage}}</span>
		</v-form>
		<br>
		Don't have an account? <router-link to="/createUser">Create one.</router-link>
	</div>
</template>

<script>
import UserService from '@/services/UserService'
export default {
	name: 'LoginForm',
	data: () => ({
		valid: false,
		formDisabled: false,
		statusMessage: '',
		showLoading: false,
    showPassword: false,
		loginData: {
			username: '',
			password: '',
		},
		usernameRules: [
			v => /[a-zA-Z]{1,20}/.test(v) || 'Enter your username.'
		],
		passwordRules: [
			v => /.+/.test(v) || 'Enter your password.'
		],
	}),
	methods: {
		async submitLogin() {
			this.showLoading = true;
			const loginResponse = await UserService.login(this.loginData);
			if (loginResponse.data === "success") {
				this.statusMessage = "Succesfully logged in.";
				this.$router.push('dashboard');
			} else {
				this.statusMessage = loginResponse.data;
			}
			this.showLoading = false;
		},
		routeToCreateUser() {
			this.$router.push('createUser');
		}
	}
}
</script>