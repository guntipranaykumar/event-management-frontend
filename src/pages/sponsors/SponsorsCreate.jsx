import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {toast} from 'react-toastify'

import {createSponsor} from '../../services/sponsorsApi'

const SponsorCreate = () => {
  const navigate = useNavigate()

  const [sponsorName, setSponsorName] = useState('')
  const [industry, setIndustry] = useState('')

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
      const created = await createSponsor(payload)
      toast.success('Sponsor created')
      navigate(`/sponsors/${created.sponsorId}`)
    } catch (err) {
      toast.error('Failed to create sponsor')
    }
  }

  return (
    <div>
      <div className="row" style={{alignItems: 'center', justifyContent: 'space-between'}}>
        <h2 style={{margin: '0 0 12px 0'}}>Create Sponsor</h2>
        <button className="btn btn-ghost" type="button" onClick={() => navigate('/sponsors')}>
          Back
        </button>
      </div>

      <form className="card" onSubmit={onSubmit}>
        <div style={{marginBottom: 12}}>
          <label style={{fontWeight: 700}}>Sponsor Name</label>
          <input
            value={sponsorName}
            onChange={e => setSponsorName(e.target.value)}
            placeholder="Enter sponsor name"
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
            placeholder="Enter industry"
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
          <button className="btn btn-primary" type="submit">
            Create
          </button>
        </div>
      </form>
    </div>
  )
}

export default SponsorCreate
