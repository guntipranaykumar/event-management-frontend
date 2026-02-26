import axios from 'axios'

const api = axios.create({
  baseURL: 'https://d2cujn41htmykc.cloudfront.net',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api