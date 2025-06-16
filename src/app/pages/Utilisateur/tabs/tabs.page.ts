import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonTabBar,
  IonRouterOutlet,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonTabs,
  IonMenu,
  IonApp,
  IonMenuButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  home,
  business,
  map,
  person,
  menuOutline,
  closeOutline,
  homeOutline,
  mapOutline,
  bookmarkOutline,
  personOutline,
  settingsOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  template: `
    <ion-app>
      <!-- Menu latéral -->
      <ion-menu side="start" menuId="utilisateur-menu" contentId="utilisateur-content">
        <div class="menu-container">
          <div class="menu-header">
            <h2>Menu</h2>
            <ion-icon
              name="close-outline"
              class="close-icon"
              (click)="closeMenu()"
            ></ion-icon>
          </div>

          <div class="menu-content">
            <div class="menu-item" [class.active]="isMenuItemActive('/utilisateur/home')" (click)="navigateFromMenu('/utilisateur/home')">
              <ion-icon name="home-outline"></ion-icon>
              <span>Accueil</span>
            </div>
            <div class="menu-item" [class.active]="isMenuItemActive('/utilisateur/cities')" (click)="navigateFromMenu('/utilisateur/cities')">
              <ion-icon name="bookmark-outline"></ion-icon>
              <span>Cités</span>
            </div>
            <div class="menu-item" [class.active]="isMenuItemActive('/utilisateur/map')" (click)="navigateFromMenu('/utilisateur/map')">
              <ion-icon name="map-outline"></ion-icon>
              <span>Carte</span>
            </div>
            <div class="menu-item" [class.active]="isMenuItemActive('/utilisateur/reservations')" (click)="navigateFromMenu('/utilisateur/reservations')">
              <ion-icon name="bookmark-outline"></ion-icon>
              <span>Mes réservations</span>
            </div>
            <div class="menu-item" [class.active]="isMenuItemActive('/utilisateur/account')" (click)="navigateFromMenu('/utilisateur/account')">
              <ion-icon name="person-outline"></ion-icon>
              <span>Mon compte</span>
            </div>
            <div class="menu-item" [class.active]="isMenuItemActive('/utilisateur/settings')" (click)="navigateFromMenu('/utilisateur/settings')">
              <ion-icon name="settings-outline"></ion-icon>
              <span>Paramètres</span>
            </div>
          </div>

          <div class="menu-footer">
            <button class="disconnect-button" (click)="disconnect()">
              Déconnexion
            </button>
            <p class="version">EyangLess - version 0.1.1</p>
          </div>
        </div>
      </ion-menu>

      <!-- Contenu principal avec tabs -->
      <div id="utilisateur-content" class="ion-page">
        <ion-tabs>
          <ion-router-outlet></ion-router-outlet>

          <ion-tab-bar slot="bottom" class="custom-tab-bar">
            <ion-tab-button tab="home" href="/utilisateur/home">
              <ion-icon name="home"></ion-icon>
              <ion-label>Accueil</ion-label>
            </ion-tab-button>

            <ion-tab-button tab="cities" href="/utilisateur/cities">
              <ion-icon name="bookmark-outline"></ion-icon>
              <ion-label>Cités</ion-label>
            </ion-tab-button>

            <ion-tab-button tab="map" href="/utilisateur/map">
              <ion-icon name="map-outline"></ion-icon>
              <ion-label>Carte</ion-label>
            </ion-tab-button>

            <ion-tab-button tab="profile" href="/utilisateur/profile">
              <ion-icon name="person-outline"></ion-icon>
              <ion-label>Profil</ion-label>
            </ion-tab-button>
          </ion-tab-bar>
        </ion-tabs>
      </div>
    </ion-app>
  `,
  styles: [`
    /* Variables CSS */
    :host {
      --primary-color: #1dd1a1;
      --secondary-color: #3b82f6;
      --text-primary: #374151;
      --text-secondary: #6b7280;
      --text-muted: #9ca3af;
      --background: #ffffff;
      --border-color: #e5e7eb;
      --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    /* App container */
    ion-app {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    /* Menu latéral */
    ion-menu {
      --width: 300px;
    }

    .menu-container {
      height: 100%;
      background: var(--background);
      display: flex;
      flex-direction: column;
      padding: 0;
    }

    .menu-header {
      padding: 60px 20px 20px;
      background: var(--background);
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f0f0f0;
    }

    .menu-header h2 {
      font-size: 24px;
      font-weight: 700;
      color: var(--primary-color);
      margin: 0;
    }

    .close-icon {
      font-size: 24px;
      color: var(--primary-color);
      cursor: pointer;
      transition: transform 0.2s ease;
    }

    .close-icon:hover {
      transform: scale(1.1);
    }

    .menu-content {
      flex: 1;
      padding: 20px 0;
    }

    .menu-item {
      padding: 16px 20px;
      font-size: 16px;
      color: var(--text-primary);
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .menu-item.active {
      background: var(--primary-color);
      color: var(--background);
      border-radius: 12px;
      margin: 0 20px;
      font-weight: 600;
    }

    .menu-item:hover:not(.active) {
      background: #f9f9f9;
      transform: translateX(5px);
    }

    .menu-item ion-icon {
      font-size: 20px;
      min-width: 20px;
    }

    .menu-footer {
      padding: 20px;
      border-top: 1px solid #f0f0f0;
    }

    .disconnect-button {
      width: 100%;
      padding: 12px;
      background: transparent;
      border: 2px solid #ef4444;
      border-radius: 8px;
      color: #ef4444;
      font-weight: 600;
      cursor: pointer;
      margin-bottom: 16px;
      transition: all 0.3s ease;
    }

    .disconnect-button:hover {
      background: #ef4444;
      color: white;
    }

    .version {
      text-align: center;
      color: var(--text-muted);
      font-size: 12px;
      margin: 0;
    }

    /* Tabs personnalisés */
    .custom-tab-bar {
      --background: var(--background);
      --border: 1px solid var(--border-color);
      height: 60px;
      padding-bottom: env(safe-area-inset-bottom);
    }

    ion-tab-button {
      --color: var(--text-muted);
      --color-selected: var(--primary-color);
      --ripple-color: var(--primary-color);
      font-size: 12px;
    }

    ion-tab-button.tab-selected {
      --color: var(--primary-color);
    }

    ion-tab-button ion-icon {
      font-size: 22px;
      margin-bottom: 4px;
    }

    ion-tab-button ion-label {
      font-size: 11px;
      font-weight: 500;
    }

    /* Contenu principal */
    .ion-page {
      background: var(--background);
    }

    /* Responsive */
    @media (max-width: 768px) {
      ion-menu {
        --width: 280px;
      }
      
      .menu-header {
        padding: 50px 16px 16px;
      }
      
      .menu-item {
        padding: 14px 16px;
        font-size: 15px;
      }
      
      .menu-footer {
        padding: 16px;
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonTabBar,
    IonRouterOutlet,
    IonTabButton,
    IonIcon,
    IonLabel,
    IonTabs,
    IonMenu,
    IonApp,
    IonMenuButton
  ]
})
export class TabsPage implements OnInit {
  currentUrl = '';

  constructor(
    private router: Router,
    private menuController: MenuController
  ) {
    addIcons({
      home,
      business,
      map,
      person,
      menuOutline,
      closeOutline,
      homeOutline,
      mapOutline,
      bookmarkOutline,
      personOutline,
      settingsOutline
    });
  }

  ngOnInit() {
    this.currentUrl = this.router.url;
    
    // Écouter les changements de route
    this.router.events.subscribe(() => {
      this.currentUrl = this.router.url;
    });
  }

  async closeMenu() {
    await this.menuController.close('utilisateur-menu');
  }

  async navigateFromMenu(route: string) {
    await this.closeMenu();
    this.router.navigate([route]);
  }

  async disconnect() {
    await this.closeMenu();
    this.router.navigate(['/login']);
  }

  isMenuItemActive(route: string): boolean {
    return this.currentUrl === route || this.currentUrl.startsWith(route + '/');
  }
}