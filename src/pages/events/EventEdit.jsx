import {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'

import Loader from '../../components/common/Loader'
import ErrorView from '../../components/common/ErrorView'
import {getEventById, updateEvent} from '../../services/eventsApi'
import {getAllSponsors} from '../../services/sponsorsApi'

const EventEdit = () => {
  const {eventId} = useParams()
  const navigate = useNavigate()

  const [eventName, setEventName] = useState('')
  const [date, setDate] = useState('')

  const [allSponsors, setAllSponsors] = useState([])
  const [selectedIds, setSelectedIds] = useState([])

  const [status, setStatus] = useState('loading') 
  const [errorMsg, setErrorMsg] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchData = async () => {
    try {
      setStatus('loading')
      setErrorMsg('')

      const [eventRes, sponsorsRes] = await Promise.all([
        getEventById(eventId),
        getAllSponsors(),
      ])

      setEventName(eventRes.eventName || '')
      setDate(eventRes.date || '')
      setAllSponsors(sponsorsRes)

      const preSelected = Array.isArray(eventRes.sponsors)
        ? eventRes.sponsors.map(sp => sp.sponsorId)
        : []

      setSelectedIds(preSelected)

      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err?.message || 'Failed to load event')
      toast.error('Failed to load event')
    }
  }

  useEffect(() => {
    fetchData()
  }, [eventId])

  const toggleSponsor = sponsorId => {
    setSelectedIds(prev =>
      prev.includes(sponsorId) ? prev.filter(id => id !== sponsorId) : [...prev, sponsorId],
    )
  }

  const onSubmit = async e => {
    e.preventDefault()

    if (eventName.trim() === '' || date.trim() === '') {
      toast.warn('Please enter event name and date')
      return
    }

    const payload = {
      eventName: eventName.trim(),
      date: date.trim(),
      sponsors: selectedIds.map(id => ({sponsorId: id})),
    }

    try {
      setSaving(true)
      await updateEvent(eventId, payload)
      toast.success('Event updated')
      navigate(`/events/${eventId}`)
    } catch (err) {
      toast.error('Failed to update event')
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading') return <Loader text="Loading event..." />
  if (status === 'error') return <ErrorView message={errorMsg} onRetry={fetchData} />

  return (
    <div>
      <div className="row" style={{alignItems: 'center', justifyContent: 'space-between'}}>
        <h2 style={{margin: '0 0 12px 0'}}>Edit Event</h2>

        <button className="btn btn-ghost" type="button" onClick={() => navigate(`/events/${eventId}`)}>
          Back
        </button>
      </div>

      <form className="card" onSubmit={onSubmit}>
        <div style={{marginBottom: 12}}>
          <label style={{fontWeight: 700}}>Event Name</label>
          <input
            value={eventName}
            onChange={e => setEventName(e.target.value)}
            style={{
              width: '100%',
              marginTop: 6,
              padding: 10,
              borderRadius: 10,
              border: '1px solid var(--border)',
            }}
          />
        </div>

        <div style={{marginBottom: 12}}>
          <label style={{fontWeight: 700}}>Date</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{
              width: '100%',
              marginTop: 6,
              padding: 10,
              borderRadius: 10,
              border: '1px solid var(--border)',
            }}
          />
        </div>

        <div style={{marginBottom: 12}}>
          <label style={{fontWeight: 700}}>Sponsors (optional)</label>

          {allSponsors.length === 0 ? (
            <p style={{color: '#64748b'}}>No sponsors available.</p>
          ) : (
            <div
              style={{
                marginTop: 8,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 10,
              }}
            >
              {allSponsors.map(sp => (
                <label
                  key={sp.sponsorId}
                  className="card"
                  style={{
                    padding: 10,
                    borderRadius: 10,
                    cursor: 'pointer',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{display: 'flex', gap: 10, alignItems: 'center'}}>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(sp.sponsorId)}
                      onChange={() => toggleSponsor(sp.sponsorId)}
                    />
                    <div>
                      <div style={{fontWeight: 800}}>{sp.sponsorName}</div>
                      <div style={{color: '#64748b'}}>Industry: {sp.industry}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="row" style={{justifyContent: 'flex-end'}}>
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EventEdit
