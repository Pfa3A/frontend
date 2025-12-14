import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { OrganizerPageLayout } from './shared/OrganazierPageLayout';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import CreateEventPage from './pages/EventPages/CreateEvenetPage';
import { AllEventsListPage } from './pages/EventPages/AllEventsListPage';
import { EventDetailsPage } from './pages/EventPages/EventDetailsPage';
import ProfilePage from './pages/clientPages/ProfilePage';
import { MyEventDetailsPage } from './pages/EventPages/MyEventDetailsPage';
import { EventsListPage } from './pages/EventPages/EventListPage';
import { ClientPageLayout } from './shared/ClientLayoutPage';
import CheckoutForm from './pages/clientPages/PaymentPage';
import { stripePromise } from './shared/stripe';
import { Elements } from '@stripe/react-stripe-js';
import PaymentSuccessPage from './pages/clientPages/PaymentSuccessPage';
import { HomePageLayout } from './shared/HomeLayoutPage';
import { HomePage } from './pages/HomePage';
import { TicketTransferPage } from './pages/clientPages/TransferPage';
import { MyTicketsPage } from './pages/clientPages/TicketsPage';
import { OrdersPage } from './pages/clientPages/OrdersPage';


function App() {

  return (

    <Router>
      <Routes>
        <Route index element={<LoginPage />} path='login' />
        <Route index element={<SignUpPage />} path='sign-up' />
        <Route element={<HomePageLayout />} path=''>
          <Route index element={<HomePage />} />
        </Route>

        <Route path='organizer' element={<OrganizerPageLayout />}>
          <Route path="events" element={<EventsListPage />} />
          <Route path="create-event" element={<CreateEventPage />} />
          <Route path="events/:eventId" element={<MyEventDetailsPage />} />
        </Route>
        <Route path='client' element={<ClientPageLayout />}>
          <Route path="events" element={<AllEventsListPage />} />
          <Route path="events/:eventId" element={<EventDetailsPage />} />
        </Route>

        <Route path='client' element={<ClientPageLayout />}>
          <Route path="events" />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path='client' element={<ClientPageLayout />}>
          <Route path="events" element={<AllEventsListPage />} />
          <Route path="tickets" element={<MyTicketsPage />} />
           <Route path="transfer-ticket" element={<TicketTransferPage />} />
          <Route path="events/:eventId" element={<EventDetailsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route
            path="events/:id/buy-ticket"
            element={<Elements stripe={stripePromise}>
              <CheckoutForm />
            </Elements>}
          />
          <Route path="events/:eventId/tickets-success" element={<PaymentSuccessPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App