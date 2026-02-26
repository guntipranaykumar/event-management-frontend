import {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'

import Loader from '../../components/common/Loader'
import ErrorView from '../../components/common/ErrorView'
import SponsorRow from '../../components/sponsors/SponsorRow'

import ManageSponsorsModal from '../../components/events/ManageSponsorsModal'

import {getEventById, getSponsorsByEventId, updateEvent} from '../../services/eventsApi'
import {getAllSponsors} from '../../services/sponsorsApi'

const EventDetails = () => {
  const {eventId} = useParams()
  const navigate = useNavigate()

  const [eventData, setEventData] = useState(null)
  const [sponsors, setSponsors] = useState([])

  const [status, setStatus] = useState('loading')
  const [errorMsg, setErrorMsg] = useState('')

  // manage sponsors
  const [allSponsors, setAllSponsors] = useState([])
  const [isManageOpen, setIsManageOpen] = useState(false)
  const [savingSponsors, setSavingSponsors] = useState(false)

  const fetchDetails = async () => {
    try {
      setStatus('loading')
      setErrorMsg('')

      const [eventRes, sponsorsRes] = await Promise.all([
        getEventById(eventId),
        getSponsorsByEventId(eventId),
      ])

      setEventData(eventRes)
      setSponsors(sponsorsRes)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err?.message || 'Failed to load event details')
      toast.error('Failed to load event details')
    }
  }

  useEffect(() => {
    fetchDetails()
  }, [eventId])

  const openManageSponsors = async () => {
    try {
      // load all sponsors once
      if (allSponsors.length === 0) {
        const data = await getAllSponsors()
        setAllSponsors(data)
      }
      setIsManageOpen(true)
    } catch (err) {
      toast.error('Failed to load sponsors')
    }
  }

  const saveSponsors = async selectedIds => {
    try {
      setSavingSponsors(true)

      const payload = {
        eventName: eventData.eventName,
        date: eventData.date,
        sponsors: selectedIds.map(id => ({sponsorId: id})),
      }

      await updateEvent(eventId, payload)

      toast.success('Sponsors updated')
      setIsManageOpen(false)
      fetchDetails()
    } catch (err) {
      toast.error('Failed to update sponsors')
    } finally {
      setSavingSponsors(false)
    }
  }

  if (status === 'loading') return <Loader text="Loading event details..." />
  if (status === 'error') return <ErrorView message={errorMsg} onRetry={fetchDetails} />

  return (
    <div>
      <div className="row" style={{alignItems: 'center', justifyContent: 'space-between'}}>
        <h2 style={{margin: '0 0 12px 0'}}>Event Details</h2>

        <div className="row">
          <button className="btn btn-ghost" type="button" onClick={() => navigate('/events')}>
            Back
          </button>

          <button className="btn btn-ghost" type="button" onClick={openManageSponsors}>
            Manage Sponsors
          </button>

          <button
            className="btn btn-primary"
            type="button"
            onClick={() => navigate(`/events/${eventId}/edit`)}
          >
            Edit
          </button>
        </div>
      </div>

      <div className="card" style={{marginBottom: 16}}>
        <h3 style={{marginTop: 0, marginBottom: 6}}>{eventData.eventName}</h3>
        <p style={{margin: 0, color: '#64748b'}}>
          <b>Date:</b> {eventData.date}
        </p>
        <p style={{margin: '8px 0 0 0', color: '#64748b'}}>
          <b>Event ID:</b> {eventData.eventId}
        </p>
      </div>

      <div className="card">
        <h3 style={{marginTop: 0}}>Sponsors</h3>

        {sponsors.length === 0 ? (
          <p style={{color: '#64748b', margin: 0}}>No sponsors linked to this event.</p>
        ) : (
          <div className="row">
            {sponsors.map(sp => (
              <div key={sp.sponsorId} style={{flex: '1 1 260px'}}>
                <SponsorRow sponsor={sp} />
              </div>
            ))}
          </div>
        )}
      </div>

      <ManageSponsorsModal
        isOpen={isManageOpen}
        allSponsors={allSponsors}
        initialSelectedIds={sponsors.map(s => s.sponsorId)}
        onClose={() => setIsManageOpen(false)}
        onSave={saveSponsors}
        saving={savingSponsors}
      />
    </div>
  )
}

export default EventDetails
