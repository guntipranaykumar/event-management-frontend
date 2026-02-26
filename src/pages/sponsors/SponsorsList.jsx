import {useEffect, useRef, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'

import ConfirmModal from '../../components/common/ConfirmModal'
import Loader from '../../components/common/Loader'
import ErrorView from '../../components/common/ErrorView'
import SponsorCard from '../../components/sponsors/SponsorCard'

import {getAllSponsors, deleteSponsor} from '../../services/sponsorsApi'

const SponsorsList = () => {
  const navigate = useNavigate()
  const toastShownRef = useRef(false)

  const [sponsors, setSponsors] = useState([])
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const [search, setSearch] = useState('')

  const [deleteId, setDeleteId] = useState(null)

  const fetchSponsors = async () => {
    try {
      setStatus('loading')
      setErrorMsg('')

      const data = await getAllSponsors()
      setSponsors(data)
      setStatus('success')

      // avoid double toast in dev (StrictMode)
      if (!toastShownRef.current) {
        toast.success('Sponsors loaded')
        toastShownRef.current = true
      }
    } catch (err) {
      setStatus('error')
      setErrorMsg(err?.message || 'Failed to load sponsors')
      toast.error('Failed to load sponsors')
    }
  }

  useEffect(() => {
    fetchSponsors()
  }, [])

  const filteredSponsors = sponsors.filter(each => {
    const q = search.toLowerCase()
    const name = (each.sponsorName || '').toLowerCase()
    const industry = (each.industry || '').toLowerCase()
    return name.includes(q) || industry.includes(q)
  })

  const onView = id => navigate(`/sponsors/${id}`)
  const onEdit = id => navigate(`/sponsors/${id}/edit`)
  const onDelete = id => setDeleteId(id)

  const confirmDelete = async () => {
    try {
      await deleteSponsor(deleteId)
      toast.success('Sponsor deleted')
      setDeleteId(null)
      fetchSponsors()
    } catch (err) {
      toast.error('Failed to delete sponsor')
    }
  }

  return (
    <div>
      <div className="row" style={{alignItems: 'center', justifyContent: 'space-between'}}>
        <h2 style={{margin: '0 0 12px 0'}}>Sponsors</h2>

        <button className="btn btn-primary" type="button" onClick={() => navigate('/sponsors/new')}>
          + Create Sponsor
        </button>
      </div>

      {/* Search */}
      <div className="card" style={{marginBottom: 12}}>
        <div className="row" style={{justifyContent: 'space-between', alignItems: 'center'}}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search sponsors by name or industry..."
            style={{
              width: 'min(420px, 100%)',
              padding: 10,
              borderRadius: 10,
              border: '1px solid var(--border)',
            }}
          />

          <button className="btn btn-ghost" type="button" onClick={() => setSearch('')}>
            Clear
          </button>
        </div>
      </div>

      {status === 'loading' ? <Loader text="Loading sponsors..." /> : null}
      {status === 'error' ? <ErrorView message={errorMsg} onRetry={fetchSponsors} /> : null}

      {status === 'success' && filteredSponsors.length === 0 ? (
        <div className="card" style={{textAlign: 'center'}}>
          <p style={{margin: 0, color: '#64748b'}}>No sponsors found.</p>
        </div>
      ) : null}

      {status === 'success' && filteredSponsors.length > 0 ? (
        <div className="row">
          {filteredSponsors.map(each => (
            <SponsorCard
              key={each.sponsorId}
              sponsor={each}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : null}

      {deleteId !== null ? (
        <ConfirmModal
          title="Delete Sponsor"
          message="Are you sure you want to delete this sponsor?"
          onCancel={() => setDeleteId(null)}
          onConfirm={confirmDelete}
          confirmText="Delete"
        />
      ) : null}
    </div>
  )
}

export default SponsorsList
