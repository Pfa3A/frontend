import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { OrganizerPageLayout } from './shared/OrganizerPageLayout';
import { EventsListPage } from './pages/EventPages/EventListPage/EventsListPage';

function App() {

  return (
    
      <Router>
        <Routes>
          <Route path='/organization' element={<OrganizerPageLayout />}>
            <Route path="events" element={<EventsListPage />} />
          </Route>
        </Routes>
      </Router>
  )
}

export default App
