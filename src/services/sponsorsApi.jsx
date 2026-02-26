import api from './api'

export const getAllSponsors = async () => {
  const res = await api.get('/api/sponsors')
  return res.data
}

export const getSponsorById = async (sponsorId) => {
  const res = await api.get(`/api/sponsors/${sponsorId}`)
  return res.data
}

export const createSponsor = async (payload) => {
  const res = await api.post('/api/sponsors', payload)
  return res.data
}

export const updateSponsor = async (sponsorId, payload) => {
  const res = await api.put(`/api/sponsors/${sponsorId}`, payload)
  return res.data
}

export const deleteSponsor = async (sponsorId) => {
  await api.delete(`/api/sponsors/${sponsorId}`)
}

export const getEventsBySponsorId = async (sponsorId) => {
  const res = await api.get(`/api/sponsors/${sponsorId}/events`)
  return res.data
}