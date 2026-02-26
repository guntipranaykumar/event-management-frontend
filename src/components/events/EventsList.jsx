import {useEffect, useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'

import ConfirmModal from '../../components/common/ConfirmModal'
import Loader from '../../components/common/Loader'
import ErrorView from '../../components/common/ErrorView'
import EventCard from '../../components/events/EventCard'

import {getAllEvents, deleteEvent} from '../../services/eventsApi'

const normalize = str =>
  (str || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ') 

const EventsList = () => {
  const navigate = useNavigate()

  const [events, setEvents] = useState([])
  const [status, setStatus] = useState('idle') 
  const [errorMsg, setErrorMsg] = useState('')

  const [search, setSearch] = useState('')

  const toastShownRef = useRef(false)
  const [deleteId, setDeleteId] = useState(null)

  const fetchEvents = async () => {
    try {
      setStatus('loading')
      setErrorMsg('')

      const data = await getAllEvents()
      setEvents(Array.isArray(data) ? data : [])
      setStatus('success')

      if (!toastShownRef.current) {
        toast.success('Events loaded')
        toastShownRef.current = true
      }
    } catch (err) {
      setStatus('error')
      setErrorMsg(err?.message || 'Failed to load events')
      toast.error('Failed to load events')
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const q = normalize(search)
  const filteredEvents = events.filter(each => normalize(each?.eventName).includes(q))

  const onView = id => navigate(`/events/${id}`)
  const onEdit = id => navigate(`/events/${id}/edit`)
  const onDelete = id => setDeleteId(id)

  const confirmDelete = async () => {
    try {
      await deleteEvent(deleteId)
      toast.success('Event deleted')
      setDeleteId(null)
      fetchEvents()
    } catch (err) {
      toast.error('Failed to delete event')
    }
  }

  return (
    <div>
      <div className="row" style={{alignItems: 'center', justifyContent: 'space-between'}}>
        <h2 style={{margin: '0 0 12px 0'}}>Events</h2>

        <button className="btn btn-primary" type="button" onClick={() => navigate('/events/new')}>
          + Create Event
        </button>
      </div>

      <div
        style={{
          marginBottom: 12,
          padding: 12,
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          background: '#fff',
        }}
      >
        <div style={{display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap'}}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search events by name..."
            style={{
              flex: '1 1 320px',
              padding: 10,
              borderRadius: 10,
              border: '1px solid #e2e8f0',
              outline: 'none',
            }}
          />

          <button
            className="btn btn-primary"
            type="button"
            onClick={() => {
              toast.info(`Searching: ${search || 'all'}`)
            }}
          >
            Search
          </button>

          <button className="btn btn-ghost" type="button" onClick={() => setSearch('')}>
            Clear
          </button>
        </div>

        <div style={{marginTop: 8, color: '#64748b', fontSize: 14}}>
          Total: <b>{events.length}</b> | Filtered: <b>{filteredEvents.length}</b>
        </div>
      </div>

      {status === 'loading' ? <Loader text="Loading events..." /> : null}
      {status === 'error' ? <ErrorView message={errorMsg} onRetry={fetchEvents} /> : null}

      {status === 'success' && filteredEvents.length === 0 ? (
        <div className="card" style={{textAlign: 'center'}}>
          <p style={{margin: 0, color: '#64748b'}}>No events found.</p>
        </div>
      ) : null}

      {status === 'success' && filteredEvents.length > 0 ? (
        <div className="row">
          {filteredEvents.map(each => (
            <EventCard
              key={each.eventId}
              event={each}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : null}

      {deleteId !== null ? (
        <ConfirmModal
          title="Delete Event"
          message="Are you sure you want to delete this event?"
          onCancel={() => setDeleteId(null)}
          onConfirm={confirmDelete}
          confirmText="Delete"
        />
      ) : null}
    </div>
  )
}

export default EventsList
