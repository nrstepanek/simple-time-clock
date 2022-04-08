import axios from 'axios';

const backendUrl = process.env.VUE_APP_BACKEND_URL;

export default() => {
    return axios.create({
        baseURL: backendUrl,
		withCredentials: true
    })
}