import {useEffect, useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'

import Loader from '../../components/common/Loader'
import ErrorView from '../../components/common/ErrorView'

import {getAllEvents} from '../../services/eventsApi'
import {getAllSponsors} from '../../services/sponsorsApi'

const toISODate = value => {
  if (!value) return ''
  const s = value.toString().trim()

  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s


  const m = s.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/)
  if (m) return `${m[3]}-${m[2]}-${m[1]}`

  return s
}

const Dashboard = () => {
  const navigate = useNavigate()
  const toastShownRef = useRef(false)

  const [status, setStatus] = useState('loading')
  const [errorMsg, setErrorMsg] = useState('')

  const [events, setEvents] = useState([])
  const [sponsors, setSponsors] = useState([])

  const fetchDashboard = async () => {
    try {
      setStatus('loading')
      setErrorMsg('')

      const [eventsRes, sponsorsRes] = await Promise.all([getAllEvents(), getAllSponsors()])

      setEvents(Array.isArray(eventsRes) ? eventsRes : [])
      setSponsors(Array.isArray(sponsorsRes) ? sponsorsRes : [])

      setStatus('success')

      if (!toastShownRef.current) {
        toast.success('Dashboard loaded')
        toastShownRef.current = true
      }
    } catch (err) {
      setStatus('error')
      setErrorMsg(err?.message || 'Failed to load dashboard data')
      toast.error('Failed to load dashboard')
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  if (status === 'loading') return <Loader text="Loading dashboard..." />
  if (status === 'error') return <ErrorView message={errorMsg} onRetry={fetchDashboard} />

  const totalEvents = events.length
  const totalSponsors = sponsors.length

  const todayISO = new Date().toISOString().slice(0, 10)

  const upcomingEvents = events
    .map(ev => ({...ev, _iso: toISODate(ev.date)}))
    .filter(ev => ev._iso && ev._iso >= todayISO)
    .sort((a, b) => (a._iso > b._iso ? 1 : -1))
    .slice(0, 5)

  const recentEvents = events
    .map(ev => ({...ev, _iso: toISODate(ev.date)}))
    .sort((a, b) => (a._iso < b._iso ? 1 : -1))
    .slice(0, 5)

  return (
    <div>
      <div className="row" style={{alignItems: 'center', justifyContent: 'space-between'}}>
        <h2 style={{margin: '0 0 12px 0'}}>Dashboard</h2>

        <div className="row">
          <button className="btn btn-ghost" type="button" onClick={() => navigate('/events')}>
            View Events
          </button>
          <button className="btn btn-ghost" type="button" onClick={() => navigate('/sponsors')}>
            View Sponsors
          </button>
        </div>
      </div>


      <div className="row" style={{marginBottom: 12}}>
        <div className="card" style={{flex: '1 1 220px'}}>
          <p style={{margin: 0, color: 'var(--muted)', fontWeight: 700}}>Total Events</p>
          <h2 style={{margin: '10px 0 0 0'}}>{totalEvents}</h2>
        </div>

        <div className="card" style={{flex: '1 1 220px'}}>
          <p style={{margin: 0, color: 'var(--muted)', fontWeight: 700}}>Total Sponsors</p>
          <h2 style={{margin: '10px 0 0 0'}}>{totalSponsors}</h2>
        </div>

        <div className="card" style={{flex: '1 1 220px'}}>
          <p style={{margin: 0, color: 'var(--muted)', fontWeight: 700}}>Upcoming Events</p>
          <h2 style={{margin: '10px 0 0 0'}}>{upcomingEvents.length}</h2>
        </div>
      </div>

      <div className="card" style={{marginBottom: 12}}>
        <h3 style={{marginTop: 0}}>Quick Actions</h3>
        <div className="row">
          <button className="btn btn-primary" type="button" onClick={() => navigate('/events/new')}>
            + Create Event
          </button>
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => navigate('/sponsors/new')}
          >
            + Create Sponsor
          </button>
        </div>
      </div>

    
      <div className="row">
        
        <div className="card" style={{flex: '1 1 420px'}}>
          <div className="row" style={{alignItems: 'center', justifyContent: 'space-between'}}>
            <h3 style={{marginTop: 0}}>Upcoming Events</h3>
            <button className="btn btn-ghost" type="button" onClick={() => navigate('/events')}>
              See all
            </button>
          </div>

          {upcomingEvents.length === 0 ? (
            <p style={{margin: 0, color: 'var(--muted)'}}>No upcoming events.</p>
          ) : (
            <div className="row" style={{flexDirection: 'column'}}>
              {upcomingEvents.map(ev => (
                <div
                  key={ev.eventId}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: '10px 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <div>
                    <p style={{margin: 0, fontWeight: 800}}>{ev.eventName}</p>
                    <p style={{margin: '4px 0 0 0', color: 'var(--muted)'}}>{ev.date}</p>
                  </div>

                  <button
                    className="btn btn-ghost"
                    type="button"
                    onClick={() => navigate(`/events/${ev.eventId}`)}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card" style={{flex: '1 1 420px'}}>
          <div className="row" style={{alignItems: 'center', justifyContent: 'space-between'}}>
            <h3 style={{marginTop: 0}}>Recent Events</h3>
            <button className="btn btn-ghost" type="button" onClick={() => navigate('/events')}>
              See all
            </button>
          </div>

          {recentEvents.length === 0 ? (
            <p style={{margin: 0, color: 'var(--muted)'}}>No events found.</p>
          ) : (
            <div className="row" style={{flexDirection: 'column'}}>
              {recentEvents.map(ev => (
                <div
                  key={ev.eventId}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: 12,
                    padding: '10px 0',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <div>
                    <p style={{margin: 0, fontWeight: 800}}>{ev.eventName}</p>
                    <p style={{margin: '4px 0 0 0', color: 'var(--muted)'}}>{ev.date}</p>
                  </div>

                  <button
                    className="btn btn-ghost"
                    type="button"
                    onClick={() => navigate(`/events/${ev.eventId}`)}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
