import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'

import Loader from '../../components/common/Loader'
import ErrorView from '../../components/common/ErrorView'
import {getAllSponsors} from '../../services/sponsorsApi'
import {createEvent} from '../../services/eventsApi'

const EventCreate = () => {
  const navigate = useNavigate()

  const [eventName, setEventName] = useState('')
  const [date, setDate] = useState('')
  const [sponsors, setSponsors] = useState([])
  const [selectedIds, setSelectedIds] = useState([])

  const [status, setStatus] = useState('loading') 
  const [errorMsg, setErrorMsg] = useState('')

  const fetchSponsors = async () => {
    try {
      setStatus('loading')
      setErrorMsg('')
      const data = await getAllSponsors()
      setSponsors(data)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err?.message || 'Failed to load sponsors')
      toast.error('Failed to load sponsors')
    }
  }

  useEffect(() => {
    fetchSponsors()
  }, [])

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
      const created = await createEvent(payload)
      toast.success('Event created')
      navigate(`/events/${created.eventId}`)
    } catch (err) {
      toast.error('Failed to create event')
    }
  }

  if (status === 'loading') return <Loader text="Loading sponsors..." />
  if (status === 'error') return <ErrorView message={errorMsg} onRetry={fetchSponsors} />

  return (
    <div>
      <div className="row" style={{alignItems: 'center', justifyContent: 'space-between'}}>
        <h2 style={{margin: '0 0 12px 0'}}>Create Event</h2>
        <button className="btn btn-ghost" type="button" onClick={() => navigate('/events')}>
          Back
        </button>
      </div>

      <form className="card" onSubmit={onSubmit}>
        <div style={{marginBottom: 12}}>
          <label style={{fontWeight: 700}}>Event Name</label>
          <input
            value={eventName}
            onChange={e => setEventName(e.target.value)}
            placeholder="Enter event name"
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
          <label style={{fontWeight: 700}}>Select Sponsors (optional)</label>

          {sponsors.length === 0 ? (
            <p style={{color: '#64748b'}}>No sponsors available. Create sponsors first.</p>
          ) : (
            <div
              style={{
                marginTop: 8,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 10,
              }}
            >
              {sponsors.map(sp => (
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
          <button className="btn btn-primary" type="submit">
            Create
          </button>
        </div>
      </form>
    </div>
  )
}

export default EventCreate
