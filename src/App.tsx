import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { RoleBasedRouter } from "@/components/RoleBasedRouter";
import { UserRoleFixer } from '@/components/UserRoleFixer';
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Unauthorized from "./pages/Unauthorized";
import UserTypeSelection from "./pages/UserTypeSelection";
import ProfessionalTypeSelection from "./pages/ProfessionalTypeSelection";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import AdminSpectacles from "./pages/admin/AdminSpectacles";
import AdminSessions from "./pages/admin/AdminSessions";
import AdminApiKeys from "./pages/admin/AdminApiKeys";
import AdminUsers from "./pages/admin/AdminUsers";
import OrganizationsManager from "./pages/admin/OrganizationsManager";
import AdminCommunications from "./pages/admin/AdminCommunications";
import AdminAudit from "./pages/admin/AdminAudit";
import AdminStatistics from "./pages/admin/AdminStatistics";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminSetup from "./pages/admin/AdminSetup";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminInvitations from "./pages/admin/AdminInvitations";
import AdminRegistrations from '@/pages/admin/AdminRegistrations';
import { SpectacleAccessControl } from '@/components/SpectacleAccessControl';
import TeacherDashboard from '@/pages/teacher/TeacherDashboard';
import SpectacleBooking from '@/pages/teacher/SpectacleBooking';
import MyBookings from '@/pages/teacher/MyBookings';
import MyQuotes from '@/pages/teacher/MyQuotes';
import PrivateSchoolBooking from '@/pages/teacher/PrivateSchoolBooking';
import SpectacleCatalog from '@/pages/b2c/SpectacleCatalog';
import AssociationDashboard from "./pages/dashboards/AssociationDashboard";
import PartnerDashboard from "./pages/dashboards/PartnerDashboard";
import PublicSchoolBooking from "./pages/teacher/PublicSchoolBooking";
import AssociationBooking from "./pages/association/AssociationBooking";
import PartnerTicketAllocation from "./pages/partner/PartnerTicketAllocation";
import B2CDashboard from "./pages/dashboards/B2CDashboard";
import QuotesPage from "./pages/partner/QuotesPage";
import InvoicesPage from "./pages/partner/InvoicesPage";
import SupportPage from "./pages/partner/SupportPage";
import NotificationsPage from "./pages/partner/NotificationsPage";
import OffersPage from "./pages/partner/OffersPage";
import MessagesPage from "./pages/partner/MessagesPage";
import CalendarPage from "./pages/partner/CalendarPage";
import B2CBooking from "./pages/b2c/B2CBooking";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { Privacy } from "./pages/Privacy";
import { Terms } from "./pages/Terms";
import { healthCheck } from "./pages/api/health";
import AuthPero from "./pages/AuthPero";
import ReservationFlow from "./pages/ReservationFlow";
import AuthStatus from "./pages/api/auth/status";
import Spectacles from "./pages/Spectacles";
import SpectacleMinimal from "./pages/SpectacleMinimal";
import SpectacleLePetitPrinceFixed from "./pages/SpectacleLePetitPrinceFixed";
import SpectacleTaraSurLaLune from "./pages/SpectacleTaraSurLaLune";
import SpectacleEstevanico from "./pages/SpectacleEstevanico";
import SpectacleCharlotte from "./pages/SpectacleCharlotte";
import SpectacleAliceChezLesMerveilles from "./pages/SpectacleAliceChezLesMerveilles";
import MyReservations from "./pages/MyReservations";
import Payment from "./pages/Payment";

const queryClient = new QueryClient();

const App = () => {
  // Health API simulation for client-side
  if (window.location.pathname === '/api/health') {
    return (
      <div style={{ fontFamily: 'monospace', padding: '20px', backgroundColor: '#f5f5f5' }}>
        <h2>EDJS Platform Health Check</h2>
        <pre style={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px' }}>
          {JSON.stringify({
            status: "ok",
            version: "1.0.0", 
            commit: process.env.NODE_ENV === 'production' ? 'prod-build' : 'dev-build',
            timestamp: new Date().toISOString(),
            service: "EDJS Platform",
            supabase: true
          }, null, 2)}
        </pre>
      </div>
    );
  }

  // Auth status API for cross-domain requests
  if (window.location.pathname === '/api/auth/status') {
    return <AuthStatus />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <UserRoleFixer />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<UserTypeSelection />} />
              <Route path="/user-type-selection" element={<UserTypeSelection />} />
              <Route path="/professional-type-selection" element={<ProfessionalTypeSelection />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth-pero" element={<AuthPero />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/reservation/:spectacleId" element={
                <ProtectedRoute>
                  <ReservationFlow />
                </ProtectedRoute>
              } />
              <Route path="/spectacles" element={<Spectacles />} />
              <Route path="/spectacle/le-petit-prince" element={<SpectacleLePetitPrinceFixed />} />
              <Route path="/spectacle/tara-sur-la-lune" element={<SpectacleTaraSurLaLune />} />
              <Route path="/spectacle/estevanico" element={<SpectacleEstevanico />} />
              <Route path="/spectacle/charlotte" element={<SpectacleCharlotte />} />
              <Route path="/spectacle/alice-chez-les-merveilles" element={<SpectacleAliceChezLesMerveilles />} />
              <Route path="/spectacle/le-petit-prince-ar" element={<SpectacleLePetitPrinceFixed />} />
              <Route path="/spectacle/mirath-atfal" element={<SpectacleEstevanico />} />
              <Route path="/spectacle/simple-comme-bonjour" element={<SpectacleMinimal />} />
              <Route path="/spectacle/lenfant-de-larbre" element={<SpectacleMinimal />} />
              <Route path="/spectacle/antigone" element={<SpectacleMinimal />} />
              <Route path="/spectacle/alice-aux-pays-des-merveilles" element={<SpectacleAliceChezLesMerveilles />} />
              <Route path="/spectacle/casse-noisette" element={<SpectacleMinimal />} />
              <Route path="/spectacle/leau-la" element={<SpectacleMinimal />} />

              {/* Protected Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'admin_full', 'admin_spectacles', 'admin_schools', 'admin_partners', 'admin_support', 'admin_notifications', 'admin_editor']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/spectacles" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'admin_full', 'admin_spectacles', 'admin_schools', 'admin_partners', 'admin_support', 'admin_notifications', 'admin_editor']}>
                    <AdminSpectacles />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/sessions" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'admin_full', 'admin_spectacles', 'admin_schools', 'admin_partners', 'admin_support', 'admin_notifications', 'admin_editor']}>
                    <AdminSessions />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/api-keys" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'admin_full', 'admin_spectacles', 'admin_schools', 'admin_partners', 'admin_support', 'admin_notifications', 'admin_editor']}>
                    <AdminApiKeys />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'admin_full', 'admin_spectacles', 'admin_schools', 'admin_partners', 'admin_support', 'admin_notifications', 'admin_editor']}>
                    <AdminUsers />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/organizations" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'admin_full', 'admin_spectacles', 'admin_schools', 'admin_partners', 'admin_support', 'admin_notifications', 'admin_editor']}>
                    <OrganizationsManager />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/communications" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'admin_full', 'admin_spectacles', 'admin_schools', 'admin_partners', 'admin_support', 'admin_notifications', 'admin_editor']}>
                    <AdminCommunications />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/audit" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'admin_full', 'admin_spectacles', 'admin_schools', 'admin_partners', 'admin_support', 'admin_notifications', 'admin_editor']}>
                    <AdminAudit />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/analytics" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'admin_full', 'admin_spectacles', 'admin_schools', 'admin_partners', 'admin_support', 'admin_notifications', 'admin_editor']}>
                    <AdminStatistics />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/settings" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'admin_full', 'admin_spectacles', 'admin_schools', 'admin_partners', 'admin_support', 'admin_notifications', 'admin_editor']}>
                    <AdminSettings />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected Teacher Routes */}
              <Route 
                path="/teacher" 
                element={
                  <ProtectedRoute allowedRoles={['teacher_private', 'teacher_public']}>
                    <TeacherDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teacher/new-booking" 
                element={
                  <ProtectedRoute requiredRole="teacher_private">
                    <PrivateSchoolBooking />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teacher/dashboard" 
                element={
                  <ProtectedRoute requiredRole="teacher_private">
                    <TeacherDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teacher/dashboard" 
                element={
                  <ProtectedRoute requiredRole="teacher_public">
                    <TeacherDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teacher/spectacles" 
                element={
                  <ProtectedRoute requiredRole="teacher_private">
                    <SpectacleBooking />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teacher/spectacles" 
                element={
                  <ProtectedRoute requiredRole="teacher_public">
                    <SpectacleBooking />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teacher/bookings" 
                element={
                  <ProtectedRoute requiredRole="teacher_private">
                    <MyBookings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teacher/bookings" 
                element={
                  <ProtectedRoute requiredRole="teacher_public">
                    <MyBookings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teacher/quotes" 
                element={
                  <ProtectedRoute requiredRole="teacher_private">
                    <MyQuotes />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teacher/quotes" 
                element={
                  <ProtectedRoute requiredRole="teacher_public">
                    <MyQuotes />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/teacher/public-school-booking" 
                element={
                  <ProtectedRoute requiredRole="teacher_public">
                    <PublicSchoolBooking />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected Association Routes */}
              <Route 
                path="/association" 
                element={
                  <ProtectedRoute requiredRole="association">
                    <AssociationDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/association/new-booking" 
                element={
                  <ProtectedRoute requiredRole="association">
                    <AssociationBooking />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected Partner Routes */}
              <Route 
                path="/partner" 
                element={
                  <ProtectedRoute requiredRole="partner">
                    <PartnerDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/quotes" 
                element={
                  <ProtectedRoute allowedRoles={['partner', 'b2c_user', 'b2c', 'b2b']}>
                    <QuotesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/invoices" 
                element={
                  <ProtectedRoute allowedRoles={['partner', 'b2c_user', 'b2c', 'b2b']}>
                    <InvoicesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/support" 
                element={<SupportPage />} 
              />
              <Route 
                path="/partner/support" 
                element={<SupportPage />} 
              />
              <Route 
                path="/notifications" 
                element={
                  <ProtectedRoute requiredRole="partner">
                    <NotificationsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/offers" 
                element={
                  <ProtectedRoute requiredRole="partner">
                    <OffersPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/messages" 
                element={<MessagesPage />} 
              />
              <Route 
                path="/calendar" 
                element={
                  <ProtectedRoute requiredRole="partner">
                    <CalendarPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/partner/allocate-tickets" 
                element={
                  <ProtectedRoute requiredRole="partner">
                    <PartnerTicketAllocation />
                  </ProtectedRoute>
                } 
              />
              
               {/* Admin setup (one-time) */}
              <Route 
                path="/admin/setup" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'admin_full', 'admin_spectacles', 'admin_schools', 'admin_partners', 'admin_support', 'admin_notifications', 'admin_editor']}>
                    <AdminSetup />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected B2C Routes */}
              <Route 
                path="/b2c" 
                element={
                  <ProtectedRoute allowedRoles={['b2c_user', 'b2c', 'partner', 'b2b']}>
                    <B2CDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute allowedRoles={['b2c_user', 'b2c', 'partner', 'b2b']}>
                    <B2CDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/b2c/booking" 
                element={
                  <ProtectedRoute allowedRoles={['b2c_user', 'b2c', 'partner', 'b2b']}>
                    <B2CBooking />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected Admin Booking Routes */}
              <Route 
                path="/admin/bookings" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'admin_full', 'admin_spectacles', 'admin_schools', 'admin_partners', 'admin_support', 'admin_notifications', 'admin_editor']}>
                    <AdminBookings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/invitations" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'admin_full']}>
                    <AdminInvitations />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/registrations" 
                element={
                  <ProtectedRoute allowedRoles={['super_admin', 'admin_full', 'admin_schools']}>
                    <AdminRegistrations />
                  </ProtectedRoute>
                } 
              />
              
              {/* Reservation Routes */}
              <Route 
                path="/reservation/:spectacleId" 
                element={
                  <ProtectedRoute>
                    <ReservationFlow />
                  </ProtectedRoute>
                } 
              />
              
              {/* User Pages */}
              <Route 
                path="/my-reservations" 
                element={
                  <ProtectedRoute>
                    <MyReservations />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
              {/* Spectacles Routes */}
              <Route path="/spectacles" element={<Spectacles />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
