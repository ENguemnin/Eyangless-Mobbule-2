import { Routes } from '@angular/router';
import { bailleur_routes } from './pages/bailleur/tabs/tabs.routes';
import { utilisateur_routes } from './pages/Utilisateur/tabs/tabs.routes';

export const routes: Routes = [

 // Les routes des interfaces Utilisateur
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
  {
    path: 'landing',
    loadComponent: () => import('./pages/Utilisateur/Auth/landing/landing.page').then(m => m.LandingPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/Utilisateur/Auth/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/Utilisateur/Auth/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/Utilisateur/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'cities',
    loadComponent: () => import('./pages/Utilisateur/cities/cities.page').then(m => m.CitiesPage)
  },
  {
    path: 'map',
    loadComponent: () => import('./pages/Utilisateur/map/map.page').then(m => m.MapPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/Utilisateur/profile/profile.page').then(m => m.ProfilePage)
  },

  {
    path: 'city-details/:id',
    loadComponent: () => import('./pages/Utilisateur/city-details/city-details.page').then(m => m.CityDetailsPage)
  },

  {
    path: 'code-verification',
    loadComponent: () => import('./pages/Utilisateur/Auth/code-verification/code-verification.page').then( m => m.CodeVerificationPage)
  },
  {
    path: 'phone-verification',
    loadComponent: () => import('./pages/Utilisateur/Auth/phone-verification/phone-verification.page').then( m => m.PhoneVerificationPage)
  },
  {
    path: 'user-type-selection',
    loadComponent: () => import('./pages/Utilisateur/Auth/user-type-selection/user-type-selection.page').then( m => m.UserTypeSelectionPage)
  },
  {
    path: 'user',
    loadComponent: () => import('./pages/Utilisateur/tabs/tabs.page').then((m) => m.TabsPage),
    children: utilisateur_routes
  },

  // Nouvelles routes pour le système de réservation
  {
    path: 'room-selection/:id',
    loadComponent: () => import('./pages/Utilisateur/room-selection/room-selection.page').then(m => m.RoomSelectionPage)
  },
  {
    path: 'reservation-payment',
    loadComponent: () => import('./pages/Utilisateur/reservation-payment/reservation-payment.page').then(m => m.ReservationPaymentPage)
  },
  {
    path: 'reservations',
    loadComponent: () => import('./pages/Utilisateur/reservations/reservations.page').then(m => m.ReservationsPage)
  },
  {
    path: 'reservation-details/:id',
    loadComponent: () => import('./pages/Utilisateur/reservation-details/reservation-details.page').then(m => m.ReservationDetailsPage)
  },
  // Nouvelles routes pour le système cartographique et commentaires
  {
    path: 'comments/:id',
    loadComponent: () => import('./pages/Utilisateur/comments-full/comments-full.page').then(m => m.CommentsFullPage)
  },





  // Les routes des interfaces du bailleur

];
