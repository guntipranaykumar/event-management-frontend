import {Routes, Route, Navigate} from 'react-router-dom'
import Layout from '../components/layout/Layout'

import Dashboard from '../pages/dashboard/Dashboard'

import EventsList from '../pages/events/EventsList'
import EventCreate from '../pages/events/EventCreate'
import EventDetails from '../pages/events/EventDetails'
import EventEdit from '../pages/events/EventEdit'

import SponsorsList from '../pages/sponsors/SponsorsList'
import SponsorCreate from '../pages/sponsors/SponsorsCreate'
import SponsorDetails from '../pages/sponsors/SponsorDetails'
import SponsorEdit from '../pages/sponsors/SponsorEdit'

const AppRoutes = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<Dashboard />} />
     
      <Route path="/events" element={<EventsList />} />
      <Route path="/events/new" element={<EventCreate />} />
      <Route path="/events/:eventId" element={<EventDetails />} />
      <Route path="/events/:eventId/edit" element={<EventEdit />} />

    
      <Route path="/sponsors" element={<SponsorsList />} />
      <Route path="/sponsors/new" element={<SponsorCreate />} />
      <Route path="/sponsors/:sponsorId" element={<SponsorDetails />} />
      <Route path="/sponsors/:sponsorId/edit" element={<SponsorEdit />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Layout>
)

export default AppRoutes
