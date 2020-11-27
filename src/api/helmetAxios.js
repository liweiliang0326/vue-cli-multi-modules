import axios from 'axios';
import store from '../store';

const http = axios.create({
  // baseURL: 'https://wis-hat.enn.cn:20020/api/v1',
  timeout: 20000
});

http.interceptors.request.use(request => {
  if (store.state.helmet.storeAqmToken) {
    request.headers.token = store.state.helmet.storeAqmToken;
  }
  // request.headers['Sec-Fetch-Mode'] = 'no-cors';
  // request.headers['Content-type'] = 'application/x-www-form-urlencoded';
  return request;
});

http.interceptors.response.use(response => {
  return response;
}, error => {
    console.log("error", error);
  return Promise.reject(error);
});

export default http;
