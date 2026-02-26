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
  width: 'min(420px, 96%)',
  background: 'white',
  borderRadius: 14,
  border: '1px solid var(--border)',
  padding: 16,
}

const ConfirmModal = ({title, message, onCancel, onConfirm, confirmText = 'Confirm'}) => {
  return (
    <div style={overlayStyle} onClick={onCancel}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <h3 style={{marginTop: 0}}>{title}</h3>
        <p style={{color: '#64748b'}}>{message}</p>

        <div className="row" style={{justifyContent: 'flex-end', marginTop: 14}}>
          <button className="btn btn-ghost" type="button" onClick={onCancel}>
            Cancel
          </button>

          <button className="btn btn-danger" type="button" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
