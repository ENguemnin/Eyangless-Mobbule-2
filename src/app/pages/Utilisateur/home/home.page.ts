import {
  Component,
  AfterViewInit,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuController } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonMenu,
  IonMenuButton,
  IonApp,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLabel,
  IonItem,
  IonList,
  IonSearchbar,
  IonCard,
  IonCardContent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  menuOutline,
  closeOutline,
  searchOutline,
  personCircleOutline,
  homeOutline,
  mapOutline,
  bookmarkOutline,
  personOutline,
  starOutline,
  star,
  settingsOutline,
} from 'ionicons/icons';

interface City {
  id: number;
  name: string;
  subtitle: string;
  image: string;
  rating: number;
  category?: string;
  progress?: number;
  availableRooms?: number;
}

@Component({
  selector: 'app-home',
  template: `
    <ion-app>
      <!-- Menu latéral -->
      <ion-menu side="start" menuId="main-menu" contentId="main-content">
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
            <div class="menu-item active" (click)="navigateTo('/home')">
              <span>Accueil</span>
            </div>
            <div class="menu-item" (click)="navigateTo('/cities')">
              <span>Cités</span>
            </div>
            <div class="menu-item" (click)="navigateTo('/map')">
              <span>Carte</span>
            </div>
            <div class="menu-item" (click)="navigateTo('/reservations')">
              <span>Mes réservations</span>
            </div>
            <div class="menu-item" (click)="navigateTo('/account')">
              <span>Mon compte</span>
            </div>
            <div class="menu-item" (click)="navigateTo('/settings')">
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

      <!-- Contenu principal -->
      <div id="main-content" class="main-wrapper">
        <!-- Header -->
        <ion-header class="custom-header">
          <ion-toolbar class="main-toolbar">
            <div class="header-content">
              <div class="menu-icon" (click)="openMenu()">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <h1 class="brand-title">EyangLess</h1>
              <div class="header-actions">
                <ion-icon
                  name="search-outline"
                  class="action-icon"
                  (click)="toggleSearch()"
                ></ion-icon>
                <div class="profile-icon" (click)="goToProfile()">
                  <ion-icon name="person-circle-outline"></ion-icon>
                </div>
              </div>
            </div>

            <!-- Barre de recherche (masquée par défaut) -->
            <div class="search-container" [class.active]="showSearch">
              <ion-searchbar
                (ionInput)="onSearch($event)"
                placeholder="Rechercher une cité..."
                debounce="300"
                show-clear-button="focus"
              >
              </ion-searchbar>
            </div>
          </ion-toolbar>
        </ion-header>

        <ion-content class="main-content" [scrollEvents]="true">
          <!-- Section Les cités les plus visitées -->
          <div class="section">
            <div class="section-header">
              <h2>Les cités les plus visitées</h2>
              <span class="voir-plus" (click)="viewMoreMostVisited()"
                >Voir plus ></span
              >
            </div>

            <!-- Slider horizontal avec Swiper -->
            <swiper-container
              [slidesPerView]="1.2"
              [spaceBetween]="16"
              [loop]="false"
              class="most-visited-swiper"
            >
              <swiper-slide
                *ngFor="let city of mostVisitedCities; trackBy: trackByCity"
              >
                <div class="city-card large" (click)="selectCity(city)">
                  <div
                    class="city-image"
                    [style.background-image]="'url(' + city.image + ')'"
                  >
                    <div class="city-badge" *ngIf="city.category">
                      {{ city.category }}
                    </div>
                    <div class="city-rating">
                      <ion-icon name="star"></ion-icon>
                      <span>{{ city.rating }}</span>
                    </div>
                  </div>
                  <div class="city-info">
                    <h3>{{ city.name }}</h3>
                    <p>{{ city.subtitle }}</p>
                  </div>
                </div>
              </swiper-slide>
            </swiper-container>
          </div>

          <!-- Section Les cités achevées -->
          <div class="section">
            <div class="section-header">
              <h2>Les cités achevées</h2>
              <span class="voir-plus" (click)="viewMoreCompleted()"
                >Voir plus ></span
              >
            </div>

            <swiper-container
              [slidesPerView]="1.5"
              [spaceBetween]="12"
              [loop]="false"
              class="completed-swiper"
            >
              <swiper-slide
                *ngFor="let city of completedCities; trackBy: trackByCity"
              >
                <div class="city-card" (click)="selectCity(city)">
                  <div
                    class="city-image"
                    [style.background-image]="'url(' + city.image + ')'"
                  >
                    <div class="city-badge" *ngIf="city.availableRooms">
                      {{ city.availableRooms }} Chambres libres
                    </div>
                    <div class="city-rating">
                      <ion-icon name="star"></ion-icon>
                      <span>{{ city.rating }}</span>
                    </div>
                  </div>
                  <div class="city-info">
                    <h3>{{ city.name }}</h3>
                    <p>{{ city.subtitle }}</p>
                  </div>
                </div>
              </swiper-slide>
            </swiper-container>
          </div>

          <!-- Section Des chambres disponibles -->
          <div class="section">
            <div class="section-header">
              <h2>Des chambres disponibles</h2>
              <span class="voir-plus" (click)="viewMoreAvailable()"
                >Voir plus ></span
              >
            </div>

            <swiper-container
              [slidesPerView]="1.5"
              [spaceBetween]="12"
              [loop]="false"
              class="available-swiper"
            >
              <swiper-slide
                *ngFor="let city of availableCities; trackBy: trackByCity"
              >
                <div class="city-card" (click)="selectCity(city)">
                  <div
                    class="city-image"
                    [style.background-image]="'url(' + city.image + ')'"
                  >
                    <div class="city-badge" *ngIf="city.availableRooms">
                      {{ city.availableRooms }} Chambres libres
                    </div>
                    <div class="city-rating">
                      <ion-icon name="star"></ion-icon>
                      <span>{{ city.rating }}</span>
                    </div>
                  </div>
                  <div class="city-info">
                    <h3>{{ city.name }}</h3>
                    <p>{{ city.subtitle }}</p>
                  </div>
                </div>
              </swiper-slide>
            </swiper-container>

            <button class="see-all-button" (click)="viewAllCities()">
              Voir toutes les cités disponibles
            </button>
            <br> <br> <br>


          </div>

        </ion-content>
      </div>
    </ion-app>

    <!-- Footer avec navigation fixé en bas -->
    <!-- <ion-footer class="ion-no-border fixed-footer">
      <ion-tab-bar class="custom-tab-bar">
        <ion-tab-button  class="active" [class.active]="isActive('/home')" (click)="navigateTo('/home')">
          <ion-icon name="home-outline"></ion-icon>
          <ion-label>Accueil</ion-label>
        </ion-tab-button>

        <ion-tab-button [class.active]="isActive('/cities')" (click)="navigateTo('/cities')">
          <ion-icon name="business-outline"></ion-icon>
          <ion-label>Cités</ion-label>
        </ion-tab-button>

        <ion-tab-button [class.active]="isActive('/map')" (click)="navigateTo('/map')">
          <ion-icon name="map-outline"></ion-icon>
          <ion-label>Carte</ion-label>
        </ion-tab-button>

        <ion-tab-button [class.active]="isActive('/profile') || isActive('/account')" (click)="navigateTo('/profile')">
          <ion-icon name="person-outline"></ion-icon>
          <ion-label>Mon compte</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-footer> -->
  `,
  styles: [
    `
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
        display: block;
        height: 100%;
        width: 100%;
      }

      /* Reset Ionic */
      ion-app {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          sans-serif;
        background: var(--background) !important;
        color: var(--text-primary) !important;
      }

      /* Wrapper principal */
      .main-wrapper {
        position: relative;
        height: 100vh;
        width: 100%;
        background: var(--background);
        overflow: hidden;
      }

      /* Menu latéral */
      ion-menu {
        --width: 300px;
        z-index: 9999;
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
        z-index: 1000;
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
        position: relative;
        z-index: 100;
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
        position: relative;
        z-index: 100;
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

      /* Header */
      .custom-header {
        position: sticky;
        top: 0;
        z-index: 1000;
        --background: var(--background);
        background: var(--background);
        box-shadow: none;
        border-bottom: none;
      }

      .main-toolbar {
        --background: var(--background);
        --color: var(--text-primary);
        padding: 8px 0;
        --min-height: 60px;
        background: var(--background) !important;
      }

      .header-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        width: 100%;
        background: var(--background);
        position: relative;
        z-index: 100;
      }

      .menu-icon {
        display: flex;
        flex-direction: column;
        gap: 3px;
        cursor: pointer;
        width: 24px;
        height: 18px;
        justify-content: space-between;
        transition: transform 0.2s ease;
        position: relative;
        z-index: 101;
      }

      .menu-icon:hover {
        transform: scale(1.1);
      }

      .menu-icon span {
        width: 100%;
        height: 2px;
        background: var(--primary-color);
        border-radius: 1px;
        transition: all 0.3s ease;
      }

      .brand-title {
        font-size: 24px;
        font-weight: 700;
        color: var(--primary-color);
        margin: 0;
        flex: 1;
        text-align: center;
      }

      .header-actions {
        display: flex;
        gap: 16px;
        align-items: center;
        position: relative;
        z-index: 100;
      }

      .action-icon {
        font-size: 24px;
        color: var(--text-muted);
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
        z-index: 101;
      }

      .action-icon:hover {
        color: var(--primary-color);
        transform: scale(1.1);
      }

      .profile-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.2s ease;
        position: relative;
        z-index: 101;
      }

      .profile-icon:hover {
        transform: scale(1.1);
      }

      .profile-icon ion-icon {
        font-size: 28px;
        color: var(--text-muted);
        transition: color 0.2s ease;
      }

      .profile-icon:hover ion-icon {
        color: var(--primary-color);
      }

      /* Barre de recherche */
      .search-container {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;
        padding: 0 16px;
        position: relative;
        z-index: 100;
      }

      .search-container.active {
        max-height: 80px;
        padding: 8px 16px;
      }

      ion-tab-button {
      --color: var(--text-muted);
      --color-selected: var(--primary-color);
      font-size: 12px;
      flex-direction: column;
      gap: 4px;
    }

    ion-tab-button.active {
      --color: var(--primary-color);
    }


      .search-container ion-searchbar {
        --background: #f8f9fa;
        --border-radius: 12px;
        --box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      /* Contenu principal */
      .main-content {
        --background: var(--background) !important;
        background: var(--background) !important;
        --padding-bottom: 20px;
        height: calc(100vh - 60px);
        overflow-y: auto;
        position: relative;
        z-index: 1;
        padding-bottom: 70px; /* Laisse la place au footer */
      }

      .section {
        padding: 20px 16px;
        background: var(--background);
        position: relative;
        z-index: 10;
      }

      .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        position: relative;
        z-index: 100;
      }

      .section-header h2 {
        font-size: 18px;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
      }

      .voir-plus {
        color: var(--secondary-color);
        font-size: 14px;
        cursor: pointer;
        transition: color 0.2s ease;
        position: relative;
        z-index: 101;
      }

      .voir-plus:hover {
        color: var(--primary-color);
        text-decoration: underline;
      }

      /* Swiper Containers */
      .most-visited-swiper,
      .completed-swiper,
      .available-swiper {
        width: 100%;
        padding: 10px 0 20px 0;
        position: relative;
        z-index: 10;
      }

      /* Swiper slides */
      swiper-slide {
        height: auto;
        display: flex;
        align-items: stretch;
      }

      /* Cards des cités */
      .city-card {
        width: 100%;
        border-radius: 12px;
        overflow: hidden;
        background: var(--background);
        box-shadow: var(--shadow);
        border: 1px solid var(--border-color);
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        z-index: 10;
      }

      .city-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
      }

      .city-card.large {
        min-height: 280px;
      }

      .city-image {
        height: 140px;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 12px;
      }

      .city-badge {
        background: #fcd34d;
        color: #92400e;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
      }

      .city-rating {
        background: rgba(0, 0, 0, 0.6);
        color: var(--background);
        padding: 4px 8px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
      }

      .city-rating ion-icon {
        font-size: 12px;
        color: #fcd34d;
      }

      .city-info {
        padding: 12px;
        background: var(--background);
      }

      .city-info h3 {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 4px 0;
      }

      .city-info p {
        font-size: 12px;
        color: var(--text-secondary);
        margin: 0;
      }

      .see-all-button {
        width: 100%;
        padding: 16px;
        background: var(--primary-color);
        border: none;
        border-radius: 12px;
        color: var(--background);
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        z-index: 10;
        margin-top: 20px;
      }

      .see-all-button:hover {
        background: #17b890;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(29, 209, 161, 0.3);
      }

      /* Animations et transitions */
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .section {
        animation: slideIn 0.5s ease-out;
      }

      /* Media queries */
      @media (max-width: 375px) {
        .header-content {
          padding: 0 12px;
        }

        .section {
          padding: 16px 12px;
        }

        .city-card {
          min-width: 180px;
        }

        .city-card.large {
          min-width: 220px;
        }
      }

      /* Corrections supplémentaires pour l'interactivité */
      .scroll-content,
      .inner-scroll,
      ion-content,
      .content-area {
        background: var(--background) !important;
        background-color: var(--background) !important;
      }

      /* Fixes pour les z-index et pointer-events */
      ion-app * {
        pointer-events: auto;
      }

      /* Loading states */
      .loading {
        opacity: 0.7;
        pointer-events: none;
      }

      .fixed-footer {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;
        background: white;
      }
    `,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    IonMenu,
    IonMenuButton,
    IonApp,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonLabel,
    IonItem,
    IonList,
    IonSearchbar,
    IonCard,
    IonCardContent,
  ],
})
export class HomePage implements AfterViewInit, OnInit {
  showSearch = false;
  searchTerm = '';

  mostVisitedCities: City[] = [
    {
      id: 1,
      name: 'Cité Bévina',
      subtitle: 'Cité moderne avec portail',
      image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg',
      rating: 4.1,
      category: '03 Chambres libres',
    },
    {
      id: 2,
      name: 'Mini cité la Grâce',
      subtitle: 'Une cité verte et blanche',
      image:
        'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg',
      rating: 4.15,
      category: '02 Chambres libres',
    },
  ];

  completedCities: City[] = [
    {
      id: 3,
      name: 'Cité Bévina',
      subtitle: 'Cité moderne avec portail',
      image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg',
      rating: 4.1,
      availableRooms: 3,
    },
    {
      id: 4,
      name: 'Mini cité la Grâce',
      subtitle: 'Une cité verte et blanche',
      image:
        'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg',
      rating: 4.15,
      availableRooms: 2,
    },
  ];

  availableCities: City[] = [
    {
      id: 5,
      name: 'Cité Moderne',
      subtitle: 'Architecture contemporaine',
      image:
        'https://images.pexels.com/photos/1449824/pexels-photo-1449824.jpeg',
      rating: 4.3,
      availableRooms: 5,
    },
    {
      id: 6,
      name: 'Résidence Premium',
      subtitle: 'Luxe et confort',
      image:
        'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg',
      rating: 4.5,
      availableRooms: 2,
    },
  ];

  constructor(
    private router: Router,
    private menuController: MenuController,
    private route: ActivatedRoute
  ) {
    addIcons({
      menuOutline,
      closeOutline,
      searchOutline,
      personCircleOutline,
      homeOutline,
      mapOutline,
      bookmarkOutline,
      personOutline,
      starOutline,
      star,
      settingsOutline,
    });
    register();
  }

  ngOnInit() {}

  ngAfterViewInit() {}

  async openMenu() {
    await this.menuController.open('main-menu');
  }

  async closeMenu() {
    await this.menuController.close('main-menu');
  }

  // Remplace la méthode navigateTo pour ne pas fermer le menu lors d'un clic sur le tab bar
  async navigateTo(route: string) {
    this.router.navigate([route]);
  }

  async disconnect() {
    await this.closeMenu();
    this.router.navigate(['/login']);
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
    if (this.showSearch) {
      setTimeout(() => {
        const searchBar = document.querySelector('ion-searchbar') as any;
        if (searchBar && searchBar.setFocus) {
          searchBar.setFocus();
        }
      }, 100);
    }
  }

  onSearch(event: any) {
    const term = event.target.value?.toLowerCase() || '';
    this.searchTerm = term;
  }

  goToProfile() {
    this.router.navigate(['/account']);
  }

  selectCity(city: City) {
    this.router.navigate(['/city-details', city.id]);
  }

  viewMoreMostVisited() {
    this.router.navigate(['/cities'], {
      queryParams: { filter: 'most-visited' },
    });
  }

  viewMoreCompleted() {
    this.router.navigate(['/cities'], {
      queryParams: { filter: 'completed' },
    });
  }

  viewMoreAvailable() {
    this.router.navigate(['/cities'], {
      queryParams: { filter: 'available' },
    });
  }

  viewAllCities() {
    this.router.navigate(['/cities']);
  }

  trackByCity(index: number, city: City): number {
    return city.id;
  }

  // Ajoute une méthode pour déterminer l'onglet actif
  isActive(route: string): boolean {
    // Pour /account et /profile, considère les deux comme "Mon compte"
    if (route === '/profile' || route === '/account') {
      return this.router.url.startsWith('/profile') || this.router.url.startsWith('/account');
    }
    return this.router.url.startsWith(route);
  }
}


