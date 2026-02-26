const ErrorView = ({message = 'Something went wrong', onRetry}) => (
  <div className="card" style={{textAlign: 'center'}}>
    <p style={{marginTop: 0, fontWeight: 800}}>Error</p>
    <p style={{color: '#64748b'}}>{message}</p>
    {onRetry ? (
      <button className="btn btn-primary" type="button" onClick={onRetry}>
        Retry
      </button>
    ) : null}
  </div>
)

export default ErrorView
