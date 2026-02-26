import api from './api'

export const getAllEvents = async () => {
  const res = await api.get('/api/events')
  return res.data
}

export const getEventById = async (eventId) => {
  const res = await api.get(`/api/events/${eventId}`)
  return res.data
}

export const getSponsorsByEventId = async (eventId) => {
  const res = await api.get(`/api/events/${eventId}/sponsors`)
  return res.data
}

export const createEvent = async (payload) => {
  const res = await api.post('/api/events', payload)
  return res.data
}

export const updateEvent = async (eventId, payload) => {
  const res = await api.put(`/api/events/${eventId}`, payload)
  return res.data
}

export const deleteEvent = async (eventId) => {
  await api.delete(`/api/events/${eventId}`)
}