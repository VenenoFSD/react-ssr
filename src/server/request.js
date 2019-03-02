import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:1201'
});

export default instance
