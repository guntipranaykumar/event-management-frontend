const SponsorRow = ({sponsor}) => {
  return (
    <div
      className="card"
      style={{
        padding: 12,
        borderRadius: 10,
        border: '1px solid var(--border)',
      }}
    >
      <p style={{margin: 0, fontWeight: 800}}>{sponsor.sponsorName}</p>
      <p style={{margin: '6px 0 0 0', color: '#64748b'}}>
        Industry: {sponsor.industry}
      </p>
    </div>
  )
}

export default SponsorRow
