import { Routes } from '@angular/router';
import { bailleur_routes } from './pages/bailleur/tabs/tabs.routes';

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




  // Les routes des interfaces du bailleur

   {
    path: 'bailleur',
    loadComponent: () => import('./pages/bailleur/tabs/tabs.page').then( m => m.TabsPage),
    children: bailleur_routes
  },
  {
    path: 'update-cite',
    loadComponent: () => import('./pages/bailleur/update-cite/update-cite.page').then( m => m.UpdateCitePage)
  },
  {
    path: 'update-caracteristiques',
    loadComponent: () => import('./pages/bailleur/update-caracteristiques/update-caracteristiques.page').then( m => m.UpdateCaracteristiquesPage)
  },
  {
    path: 'update-supplements',
    loadComponent: () => import('./pages/bailleur/update-supplements/update-supplements.page').then( m => m.UpdateSupplementsPage)
  },
  {
    path: 'update-carte',
    loadComponent: () => import('./pages/bailleur/update-carte/update-carte.page').then( m => m.UpdateCartePage)
  },
  {
    path: 'update-contacts',
    loadComponent: () => import('./pages/bailleur/update-contacts/update-contacts.page').then( m => m.UpdateContactsPage)
  },
  {
    path: 'chambres-prises',
    loadComponent: () => import('./pages/bailleur/chambres-prises/chambres-prises.page').then( m => m.ChambresPrisesPage)
  },
  {
    path: 'detail-reservation',
    loadComponent: () => import('./pages/bailleur/detail-reservation/detail-reservation.page').then( m => m.DetailReservationPage)
  },



];