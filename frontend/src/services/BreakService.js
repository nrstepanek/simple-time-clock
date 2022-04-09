import Api from '@/services/api'

export default {
  startBreak(breakStartData) {
    return Api().post('breaks/start', breakStartData);
  },
  endBreak() {
		return Api().post('breaks/end');
	}
}