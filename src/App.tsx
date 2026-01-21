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
import UpdateEventPage from './pages/EventPages/UpdateEventPage';
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
import { ResalePage } from './pages/clientPages/ResalePage';
import DashboardPage from './pages/DashboardPage';
import { AdminPageLayout } from './shared/AdminLayoutPage';
import { UsersListPage } from './pages/AdminPages/UsersListPage';
import { CreateOrganizerPage } from './pages/AdminPages/CreateOrganizerPage';


import { AuthLayout } from './shared/AuthLayout';

function App() {

  return (

    <Router>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
        </Route>

        {/* We keep the index route as login for now if desired, OR we make Home the index */}
        {/* Let's make Home the index as it makes more sense for a landing page */}
        <Route element={<HomePageLayout />} path=''>
          <Route index element={<HomePage />} />
        </Route>


        <Route path='organizer' element={<OrganizerPageLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="events" element={<EventsListPage />} />
          <Route path="create-event" element={<CreateEventPage />} />
          <Route path="events/:eventId" element={<MyEventDetailsPage />} />
          <Route path="events/:eventId/edit" element={<UpdateEventPage />} />
        </Route>

        <Route path='client' element={<ClientPageLayout />}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="events" element={<AllEventsListPage />} />
          <Route path="tickets" element={<MyTicketsPage />} />
          <Route path="resale" element={<ResalePage />} />
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

        <Route path='admin' element={<AdminPageLayout />}>
          <Route path="users" element={<UsersListPage />} />
          <Route path="create-organizer" element={<CreateOrganizerPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App