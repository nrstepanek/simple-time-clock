import Api from '@/services/api'

export default {
  getUserDetails(userid) {
    return Api().get('users/' + userid.toString() + '/details');
  },
  getAllUserDetails() {
    return Api().get('users/details');
  },
  getUsernames() {
		return Api().get('users/usernames');
	},
	createUser(userData) {
		return Api().post('users', userData);
	},
	login(loginData) {
		return Api().post('login', loginData);
	},
	logout() {
		return Api().get('logout');
	},
	checkAuthentication() {
		return Api().post('/checkAuthentication');
	},
}