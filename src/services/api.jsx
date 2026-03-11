import axios from 'axios'

const api = axios.create({
  baseURL: 'http://ec2-40-192-36-159.ap-south-2.compute.amazonaws.com',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api