import Navbar from './Navbar'

const Layout = ({children}) => (
  <>
    <Navbar />
    <main className="container page">{children}</main>
  </>
)

export default Layout
