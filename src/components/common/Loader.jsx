const Loader = ({text = 'Loading...'}) => (
  <div className="card" style={{textAlign: 'center'}}>
    <p style={{margin: 0, color: '#64748b', fontWeight: 700}}>{text}</p>
  </div>
)
export default Loader
