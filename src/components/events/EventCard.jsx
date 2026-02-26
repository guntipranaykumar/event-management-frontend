const EventCard = ({event, onView, onEdit, onDelete}) => {
  const {eventId, eventName, date} = event

  return (
    <div className="card" style={{flex: '1 1 280px'}}>
      <h3 style={{marginTop: 0, marginBottom: 6}}>{eventName}</h3>
      <p style={{marginTop: 0, color: '#64748b'}}>
        <b>Date:</b> {date}
      </p>

      <div className="row" style={{marginTop: 10}}>
        <button className="btn btn-ghost" type="button" onClick={() => onView(eventId)}>
          View
        </button>
        <button className="btn btn-ghost" type="button" onClick={() => onEdit(eventId)}>
          Edit
        </button>
        <button className="btn btn-danger" type="button" onClick={() => onDelete(eventId)}>
          Delete
        </button>
      </div>
    </div>
  )
}

export default EventCard
