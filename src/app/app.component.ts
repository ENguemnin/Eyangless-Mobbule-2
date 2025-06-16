import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, personOutline, settingsOutline, logOutOutline } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  template: `
    <ion-app>
      <ion-menu contentId="main-content">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Menu</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list>
            <ion-item (click)="navigate('tabs/home')" button>
              <ion-icon name="home-outline" slot="start"></ion-icon>
              <ion-label>Home</ion-label>
            </ion-item>
            <ion-item (click)="navigate('tabs/profile')" button>
              <ion-icon name="person-outline" slot="start"></ion-icon>
              <ion-label>Profile</ion-label>
            </ion-item>
            <ion-item (click)="navigate('tabs/settings')" button>
              <ion-icon name="settings-outline" slot="start"></ion-icon>
              <ion-label>Settings</ion-label>
            </ion-item>
            <ion-item (click)="logout()" button>
              <ion-icon name="log-out-outline" slot="start"></ion-icon>
              <ion-label>Logout</ion-label>
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-menu>
      
      <div class="ion-page" id="main-content">
        <ion-router-outlet></ion-router-outlet>
      </div>
    </ion-app>
  `,
  standalone: true,
  imports: [
    IonApp,
    IonRouterOutlet,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonIcon
  ],
})
export class AppComponent {
  constructor(private router: Router) {
    addIcons({ homeOutline, personOutline, settingsOutline, logOutOutline });
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.router.navigate(['/login']);
  }
}