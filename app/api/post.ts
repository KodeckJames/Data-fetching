import axios from 'axios'

export const baseAPI = axios.create({
  baseURL: 'http://localhost:3500',
  headers: {
    'Content-Type': 'application/json',
  },
})
