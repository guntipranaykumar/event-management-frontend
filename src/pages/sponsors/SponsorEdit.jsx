import {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'

import Loader from '../../components/common/Loader'
import ErrorView from '../../components/common/ErrorView'
import {getSponsorById, updateSponsor} from '../../services/sponsorsApi'

const SponsorEdit = () => {
  const {sponsorId} = useParams()
  const navigate = useNavigate()

  const [sponsorName, setSponsorName] = useState('')
  const [industry, setIndustry] = useState('')

  const [status, setStatus] = useState('loading')
  const [errorMsg, setErrorMsg] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchSponsor = async () => {
    try {
      setStatus('loading')
      setErrorMsg('')
      const data = await getSponsorById(sponsorId)
      setSponsorName(data.sponsorName || '')
      setIndustry(data.industry || '')
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err?.message || 'Failed to load sponsor')
      toast.error('Failed to load sponsor')
    }
  }

  useEffect(() => {
    fetchSponsor()
  }, [sponsorId])

  const onSubmit = async e => {
    e.preventDefault()

    if (sponsorName.trim() === '' || industry.trim() === '') {
      toast.warn('Please enter sponsor name and industry')
      return
    }

    const payload = {
      sponsorName: sponsorName.trim(),
      industry: industry.trim(),
    }

    try {
      setSaving(true)
      await updateSponsor(sponsorId, payload)
      toast.success('Sponsor updated')
      navigate(`/sponsors/${sponsorId}`)
    } catch (err) {
      toast.error('Failed to update sponsor')
    } finally {
      setSaving(false)
    }
  }

  if (status === 'loading') return <Loader text="Loading sponsor..." />
  if (status === 'error') return <ErrorView message={errorMsg} onRetry={fetchSponsor} />

  return (
    <div>
      <div className="row" style={{alignItems: 'center', justifyContent: 'space-between'}}>
        <h2 style={{margin: '0 0 12px 0'}}>Edit Sponsor</h2>

        <button className="btn btn-ghost" type="button" onClick={() => navigate(`/sponsors/${sponsorId}`)}>
          Back
        </button>
      </div>

      <form className="card" onSubmit={onSubmit}>
        <div style={{marginBottom: 12}}>
          <label style={{fontWeight: 700}}>Sponsor Name</label>
          <input
            value={sponsorName}
            onChange={e => setSponsorName(e.target.value)}
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
          <label style={{fontWeight: 700}}>Industry</label>
          <input
            value={industry}
            onChange={e => setIndustry(e.target.value)}
            style={{
              width: '100%',
              marginTop: 6,
              padding: 10,
              borderRadius: 10,
              border: '1px solid var(--border)',
            }}
          />
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

export default SponsorEdit
