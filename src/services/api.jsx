import axios from 'axios'

const api = axios.create({
  baseURL: 'https://d3ka0na2j1p42k.cloudfront.net',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api