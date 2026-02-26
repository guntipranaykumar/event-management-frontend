import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AppRoutes from './routes/AppRoutes'

const App = () => (
  <>
    <AppRoutes />
    <ToastContainer position="top-right" autoClose={1000} />
  </>
)

export default App
