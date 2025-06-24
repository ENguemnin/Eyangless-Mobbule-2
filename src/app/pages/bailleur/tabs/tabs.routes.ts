import { Routes } from "@angular/router";

export const bailleur_routes : Routes = [
  {
    path: '',
    redirectTo: 'accueil',
    pathMatch: 'full'
  },
  {
    path: 'accueil',
    loadComponent: () => import('../accueil/accueil.page').then(m => m.AccueilPage)
    
  },
  {
    path: 'macite',
    loadComponent: () => import('../ma-cite/ma-cite.page').then(m => m.MaCitePage)
  },
  {
    path: 'chambres',
    loadComponent: () => import('../chambres/chambres.page').then(m => m.ChambresPage)
  },
  {
    path: 'reservations',
    loadComponent: () => import('../reservations/reservations.page').then(m => m.ReservationsPage)
  },

]
