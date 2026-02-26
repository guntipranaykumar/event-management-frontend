import {useEffect, useMemo, useState} from 'react'

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.45)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 16,
  zIndex: 999,
}

const modalStyle = {
  width: 'min(720px, 96%)',
  background: 'white',
  borderRadius: 14,
  border: '1px solid var(--border)',
  padding: 16,
  maxHeight: '85vh',
  overflow: 'auto',
}

const ManageSponsorsModal = ({
  isOpen,
  allSponsors,
  initialSelectedIds,
  onClose,
  onSave,
  saving,
}) => {
  const [selectedIds, setSelectedIds] = useState(initialSelectedIds || [])
  const [search, setSearch] = useState('')

  useEffect(() => {
    setSelectedIds(initialSelectedIds || [])
  }, [initialSelectedIds, isOpen])

  const filteredSponsors = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return allSponsors
    return allSponsors.filter(
      sp =>
        sp.sponsorName?.toLowerCase().includes(q) ||
        sp.industry?.toLowerCase().includes(q),
    )
  }, [allSponsors, search])

  const toggle = id => {
    setSelectedIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]))
  }

  const selectAll = () => setSelectedIds(allSponsors.map(s => s.sponsorId))
  const clearAll = () => setSelectedIds([])

  if (!isOpen) return null

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <div className="row" style={{justifyContent: 'space-between', alignItems: 'center'}}>
          <h3 style={{margin: 0}}>Manage Sponsors</h3>
          <button className="btn btn-ghost" type="button" onClick={onClose}>
            ✕
          </button>
        </div>

        <p style={{marginTop: 8, color: '#64748b'}}>
          Select sponsors for this event and click Save.
        </p>

        <div className="row" style={{alignItems: 'center', justifyContent: 'space-between'}}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search sponsor name / industry..."
            style={{
              width: 'min(420px, 100%)',
              padding: 10,
              borderRadius: 10,
              border: '1px solid var(--border)',
            }}
          />

          <div className="row">
            <button className="btn btn-ghost" type="button" onClick={selectAll}>
              Select All
            </button>
            <button className="btn btn-ghost" type="button" onClick={clearAll}>
              Clear
            </button>
          </div>
        </div>

        <div
          style={{
            marginTop: 12,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 10,
          }}
        >
          {filteredSponsors.map(sp => (
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
                  onChange={() => toggle(sp.sponsorId)}
                />
                <div>
                  <div style={{fontWeight: 800}}>{sp.sponsorName}</div>
                  <div style={{color: '#64748b'}}>Industry: {sp.industry}</div>
                </div>
              </div>
            </label>
          ))}
        </div>

        <div className="row" style={{justifyContent: 'flex-end', marginTop: 14}}>
          <button className="btn btn-ghost" type="button" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            type="button"
            disabled={saving}
            onClick={() => onSave(selectedIds)}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ManageSponsorsModal
