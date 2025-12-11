import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { OrganizerPageLayout } from './shared/ClientPageLayout';
import { EventsListPage } from './pages/EventPages/EventListPage/EventsListPage';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import CreateEventPage from './pages/EventPages/CreateEvenetPage';
import ProfilePage from './pages/clientPages/ProfilePage';
import { ClientPageLayout } from './shared/ClientLayoutPage';

function App() {

  return (
    
      <Router>
        <Routes>
          <Route index element={<LoginPage />} path='login' />
          <Route index element={<SignUpPage />} path='sign-up' />
          <Route path='organizer' element={<OrganizerPageLayout />}>
            <Route path="events" element={<EventsListPage />} />
            <Route path="create-event" element={<CreateEventPage />} />
          </Route>

          <Route path='client' element={<ClientPageLayout/>}>
            <Route path="events"  />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </Router>
  )
}

export default App
