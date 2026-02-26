import {NavLink, useNavigate} from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            background: 'white',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
          }}
        >
          <div className="brand">Event Management</div>
        </button>

        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/events"
            className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Events
          </NavLink>

          <NavLink
            to="/sponsors"
            className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Sponsors
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
