import { Routes } from "@angular/router";

export const utilisateur_routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('../home/home.page').then(m => m.HomePage)
  },
  {
    path: 'cities',
    loadComponent: () => import('../cities/cities.page').then(m => m.CitiesPage)
  },
  {
    path: 'map',
    loadComponent: () => import('../map/map.page').then(m => m.MapPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('../profile/profile.page').then(m => m.ProfilePage)
  },
  {
    path: 'city-details/:id',
    loadComponent: () => import('../city-details/city-details.page').then(m => m.CityDetailsPage)
   }
   
  // {
  //   path: 'reservations',
  //   loadComponent: () => import('../reservations/reservations.page').then(m => m.ReservationsPage)
  // },
  // {
  //   path: 'account',
  //   loadComponent: () => import('../account/account.page').then(m => m.AccountPage)
  // },
  // {
  //   path: 'settings',
  //   loadComponent: () => import('../settings/settings.page').then(m => m.SettingsPage)
  // }
];