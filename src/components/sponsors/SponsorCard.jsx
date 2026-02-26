// const SponsorCard = ({sponsor, onView, onEdit, onDelete}) => {
//   const {sponsorId, sponsorName, industry} = sponsor

//   return (
//     <div className="card" style={{flex: '1 1 280px'}}>
//       <h3 style={{marginTop: 0, marginBottom: 6}}>{sponsorName}</h3>
//       <p style={{margin: 0, color: '#64748b'}}>
//         <b>Industry:</b> {industry}
//       </p>

//       <div className="row" style={{marginTop: 10}}>
//         <button className="btn btn-ghost" type="button" onClick={() => onView(sponsorId)}>
//           View
//         </button>
//         <button className="btn btn-ghost" type="button" onClick={() => onEdit(sponsorId)}>
//           Edit
//         </button>
//         <button className="btn btn-danger" type="button" onClick={() => onDelete(sponsorId)}>
//           Delete
//         </button>
//       </div>
//     </div>
//   )
// }

// export default SponsorCard

const SponsorCard = ({sponsor, onView, onEdit, onDelete}) => {
  const {sponsorId, sponsorName, industry} = sponsor

  return (
    <div className="card" style={{flex: '1 1 280px'}}>
      <h3 style={{marginTop: 0, marginBottom: 6}}>{sponsorName}</h3>
      <p style={{margin: 0, color: '#64748b'}}>
        <b>Industry:</b> {industry}
      </p>

      <div className="row" style={{marginTop: 10}}>
        <button className="btn btn-ghost" type="button" onClick={() => onView(sponsorId)}>
          View
        </button>
        <button className="btn btn-ghost" type="button" onClick={() => onEdit(sponsorId)}>
          Edit
        </button>
        <button className="btn btn-danger" type="button" onClick={() => onDelete(sponsorId)}>
          Delete
        </button>
      </div>
    </div>
  )
}

export default SponsorCard

