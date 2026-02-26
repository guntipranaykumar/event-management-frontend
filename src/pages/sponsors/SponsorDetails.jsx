import {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'

import Loader from '../../components/common/Loader'
import ErrorView from '../../components/common/ErrorView'
import {getEventsBySponsorId, getSponsorById} from '../../services/sponsorsApi'

const SponsorDetails = () => {
  const {sponsorId} = useParams()
  const navigate = useNavigate()

  const [sponsor, setSponsor] = useState(null)
  const [events, setEvents] = useState([])

  const [status, setStatus] = useState('loading')
  const [errorMsg, setErrorMsg] = useState('')

  const fetchDetails = async () => {
    try {
      setStatus('loading')
      setErrorMsg('')

      const [sponsorRes, eventsRes] = await Promise.all([
        getSponsorById(sponsorId),
        getEventsBySponsorId(sponsorId),
      ])

      setSponsor(sponsorRes)
      setEvents(eventsRes)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err?.message || 'Failed to load sponsor details')
      toast.error('Failed to load sponsor details')
    }
  }

  useEffect(() => {
    fetchDetails()
  }, [sponsorId])

  if (status === 'loading') return <Loader text="Loading sponsor details..." />
  if (status === 'error') return <ErrorView message={errorMsg} onRetry={fetchDetails} />

  return (
    <div>
      <div className="row" style={{alignItems: 'center', justifyContent: 'space-between'}}>
        <h2 style={{margin: '0 0 12px 0'}}>Sponsor Details</h2>

        <div className="row">
          <button className="btn btn-ghost" type="button" onClick={() => navigate('/sponsors')}>
            Back
          </button>

          <button
            className="btn btn-primary"
            type="button"
            onClick={() => navigate(`/sponsors/${sponsorId}/edit`)}
          >
            Edit
          </button>
        </div>
      </div>

      <div className="card" style={{marginBottom: 16}}>
        <h3 style={{marginTop: 0, marginBottom: 6}}>{sponsor.sponsorName}</h3>
        <p style={{margin: 0, color: '#64748b'}}>
          <b>Industry:</b> {sponsor.industry}
        </p>
        <p style={{margin: '8px 0 0 0', color: '#64748b'}}>
          <b>Sponsor ID:</b> {sponsor.sponsorId}
        </p>
      </div>

      <div className="card">
        <h3 style={{marginTop: 0}}>Events Sponsored</h3>

        {events.length === 0 ? (
          <p style={{margin: 0, color: '#64748b'}}>No events linked to this sponsor.</p>
        ) : (
          <div className="row">
            {events.map(ev => (
              <div key={ev.eventId} className="card" style={{flex: '1 1 280px'}}>
                <h4 style={{marginTop: 0, marginBottom: 6}}>{ev.eventName}</h4>
                <p style={{margin: 0, color: '#64748b'}}>
                  <b>Date:</b> {ev.date}
                </p>

                <div className="row" style={{marginTop: 10}}>
                  <button
                    className="btn btn-ghost"
                    type="button"
                    onClick={() => navigate(`/events/${ev.eventId}`)}
                  >
                    View Event
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SponsorDetails
