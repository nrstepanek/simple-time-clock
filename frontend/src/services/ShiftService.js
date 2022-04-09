import Api from '@/services/api'

export default {
  startShift() {
    return Api().post('shifts/start');
  },
  endShift() {
		return Api().post('shifts/end');
	}
}