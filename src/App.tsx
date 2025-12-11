import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { OrganizerPageLayout } from './shared/OrganizerPageLayout';
import { EventsListPage } from './pages/EventPages/EventListPage/EventsListPage';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';

function App() {

  return (
    
      <Router>
        <Routes>
          <Route index element={<LoginPage />} path='login' />
          <Route index element={<SignUpPage />} path='sign-up' />
          <Route path='organizer' element={<OrganizerPageLayout />}>
            <Route path="events" element={<EventsListPage />} />
          </Route>
        </Routes>
      </Router>
  )
}

export default App
