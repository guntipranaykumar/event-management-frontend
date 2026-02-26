import {useEffect, useMemo, useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'

import ConfirmModal from '../../components/common/ConfirmModal'
import Loader from '../../components/common/Loader'
import ErrorView from '../../components/common/ErrorView'
import EventCard from '../../components/events/EventCard'

import {getAllEvents, deleteEvent} from '../../services/eventsApi'

const normalize = value =>
  (value || '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')

const normalizeDate = value => (value || '').toString().trim()

const EventsList = () => {
  const navigate = useNavigate()

  const [events, setEvents] = useState([])
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const [searchName, setSearchName] = useState('')
  const [filterDate, setFilterDate] = useState('')

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

  const filteredEvents = useMemo(() => {
    const q = normalize(searchName)
    const d = normalizeDate(filterDate)

    return events.filter(each => {
      const nameOk = q ? normalize(each?.eventName).includes(q) : true
      const dateOk = d ? normalizeDate(each?.date) === d : true
      return nameOk && dateOk
    })
  }, [events, searchName, filterDate])

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

  const clearFilters = () => {
    setSearchName('')
    setFilterDate('')
  }

  return (
    <div>
      <div className="row" style={{alignItems: 'center', justifyContent: 'space-between'}}>
        <h2 style={{margin: '0 0 12px 0'}}>Events</h2>

        <button className="btn btn-primary" type="button" onClick={() => navigate('/events/new')}>
          + Create Event
        </button>
      </div>

      <div className="card" style={{marginBottom: 12}}>
        <div className="row" style={{justifyContent: 'space-between', alignItems: 'center'}}>
          <input
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            placeholder="Search by event name..."
            style={{
              width: 'min(360px, 100%)',
              padding: 10,
              borderRadius: 10,
              border: '1px solid var(--border)',
              outline: 'none',
            }}
          />

          <input
            type="date"
            value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
            style={{
              padding: 10,
              borderRadius: 10,
              border: '1px solid var(--border)',
              outline: 'none',
            }}
          />

          <button className="btn btn-ghost" type="button" onClick={clearFilters}>
            Clear
          </button>
        </div>
      </div>

      {status === 'loading' ? <Loader text="Loading events..." /> : null}
      {status === 'error' ? <ErrorView message={errorMsg} onRetry={fetchEvents} /> : null}

      {status === 'success' && filteredEvents.length === 0 ? (
        <div className="card" style={{textAlign: 'center'}}>
          <p style={{margin: 0, color: 'var(--muted)'}}>No events found.</p>
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
