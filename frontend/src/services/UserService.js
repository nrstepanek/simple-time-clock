import Api from '@/services/api'

export default {
    fetchUsers() {
        return Api().get('users');
    },
	fetchUsernames() {
		return Api().get('users/usernames');
	},
	fetchUserGroups(userid) {
		return Api().get('users/' + userid.toString() + '/groups')
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

	addGroup(groupData) {
		return Api().post('/groups', groupData);
	},
	fetchThisUserGroups() {
		return Api().get('user/groups')
	}
}