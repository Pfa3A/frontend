import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { OrganizerPageLayout } from './shared/OrganizerPageLayout';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/organization' element={<OrganizerPageLayout />}>

          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
