import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonItem,
  IonThumbnail,
  IonImg,
  IonIcon,
  IonBadge,
  IonButton,
  IonChip,
  IonModal,
  IonFooter,
  IonTabBar,
  IonTabButton,
  IonNote,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonRefresher,
  IonRefresherContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  menuOutline,
  searchOutline,
  closeOutline,
  starOutline,
  star,
  locationOutline,
  homeOutline,
  businessOutline,
  mapOutline,
  personOutline,
  chevronForwardOutline,
  filterOutline,
  constructOutline,
  shieldCheckmarkOutline,
  bedOutline,
} from 'ionicons/icons';

interface City {
  id: number;
  name: string;
  subtitle: string;
  image: string;
  rating: number;
  totalRooms: number;
  availableRooms: number;
  status: string[];
  category: 'tout' | 'en-construction' | 'securite' | 'meublee';
  price: {
    amount: number;
    period: string;
  };
  location: string;
  verified: boolean;
}

@Component({
  selector: 'app-cities',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Liste des cités</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" color="primary" (click)="toggleSearch()">
            <ion-icon slot="icon-only" [name]="showSearch ? 'close-outline' : 'search-outline'"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" (ionRefresh)="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- Barre de recherche -->
      <div class="search-container" [class.active]="showSearch">
        <ion-searchbar
          [(ngModel)]="searchTerm"
          (ionInput)="onSearch($event)"
          placeholder="Rechercher..."
          debounce="300"
          show-clear-button="focus"
          class="custom-searchbar"
        ></ion-searchbar>
      </div>

      <!-- Filtres -->
      <div class="filters-container" *ngIf="!showSearchResults">
        <ion-segment [(ngModel)]="selectedFilter" (ionChange)="onFilterChange($event)" class="custom-segment">
          <ion-segment-button value="tout">
            <ion-label>Tout</ion-label>
          </ion-segment-button>
          <ion-segment-button value="en-construction">
            <ion-label>En construction</ion-label>
          </ion-segment-button>
          <ion-segment-button value="securite">
            <ion-label>Sécurité</ion-label>
          </ion-segment-button>
          <ion-segment-button value="meublee">
            <ion-label>Meublée</ion-label>
          </ion-segment-button>
        </ion-segment>
      </div>

      <!-- État de recherche vide -->
      <div class="search-empty-state" *ngIf="showSearch && !searchTerm && !showSearchResults">
        <div class="empty-content">
          <div class="arrow-up">
            <ion-icon name="chevron-forward-outline"></ion-icon>
          </div>
          <p>Saisissez votre recherche ici</p>
        </div>
      </div>

      <!-- Résultats de recherche -->
      <div class="search-results" *ngIf="showSearchResults && searchResults.length > 0">
        <div class="results-header">
          <h3>Résultats de la recherche</h3>
        </div>
        <ion-list class="search-results-list">
          <ion-item
            *ngFor="let city of searchResults; trackBy: trackByCity"
            button
            (click)="selectCity(city)"
            class="search-result-item"
          >
            <div class="search-result-content">
              <h4>{{ city.name }}</h4>
              <p>{{ city.totalRooms }} chambres</p>
            </div>
            <ion-icon name="chevron-forward-outline" slot="end" color="medium"></ion-icon>
          </ion-item>
        </ion-list>
      </div>

      <!-- Aucun résultat -->
      <div class="no-results" *ngIf="showSearchResults && searchResults.length === 0 && searchTerm">
        <div class="no-results-content">
          <div class="search-icon">
            <ion-icon name="search-outline"></ion-icon>
          </div>
          <h3>Aucun résultat pour votre recherche</h3>
          <p>"{{ searchTerm }}"</p>
        </div>
      </div>

      <!-- Liste des cités -->
      <div class="cities-list" *ngIf="!showSearch || (!showSearchResults && !searchTerm)">
        <ion-list class="cities-main-list">
          <div
            *ngFor="let city of filteredCities; trackBy: trackByCity"
            class="city-card-container"
          >
            <ion-card class="city-card" button (click)="selectCity(city)">
              <div class="city-image-container">
                <ion-img [src]="city.image" [alt]="city.name" class="city-image"></ion-img>
                <div class="city-overlay">
                  <div class="city-rating">
                    <ion-icon name="star" color="warning"></ion-icon>
                    <span>{{ city.rating }}</span>
                  </div>
                  <div class="city-status" *ngIf="city.status.length > 0">
                    <ion-chip
                      *ngFor="let status of city.status.slice(0, 1)"
                      [color]="getStatusColor(status)"
                      size="small"
                    >
                      {{ status }}
                    </ion-chip>
                  </div>
                </div>
              </div>

              <ion-card-content class="city-info">
                <div class="city-header">
                  <h3>{{ city.name }}</h3>
                  <ion-icon name="chevron-forward-outline" color="medium"></ion-icon>
                </div>
                <div class="city-details">
                  <p class="city-rooms">{{ city.totalRooms }} chambres</p>
                  <div class="city-availability" *ngIf="city.availableRooms > 0">
                    <span class="available-count">{{ city.availableRooms }} chambres libres</span>
                  </div>
                </div>
              </ion-card-content>
            </ion-card>
          </div>
        </ion-list>

        <!-- Message si aucune cité -->
        <div class="empty-cities" *ngIf="filteredCities.length === 0">
          <div class="empty-content">
            <ion-icon name="business-outline" color="medium"></ion-icon>
            <h3>Aucune cité trouvée</h3>
            <p>Essayez de modifier vos filtres</p>
          </div>
        </div>

        <!-- Infinite scroll -->
        <ion-infinite-scroll (ionInfinite)="loadMoreCities($event)" [disabled]="!hasMoreCities">
          <ion-infinite-scroll-content></ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </div>
    </ion-content>

    <!-- Footer avec navigation -->
    <ion-footer class="ion-no-border">
      <ion-tab-bar class="custom-tab-bar">
        <ion-tab-button (click)="navigateTo('/home')">
          <ion-icon name="home-outline"></ion-icon>
          <ion-label>Accueil</ion-label>
        </ion-tab-button>

        <ion-tab-button class="active">
          <ion-icon name="business-outline"></ion-icon>
          <ion-label>Cités</ion-label>
        </ion-tab-button>

        <ion-tab-button (click)="navigateTo('/map')">
          <ion-icon name="map-outline"></ion-icon>
          <ion-label>Carte</ion-label>
        </ion-tab-button>

        <ion-tab-button (click)="navigateTo('/profile')">
          <ion-icon name="person-outline"></ion-icon>
          <ion-label>Mon compte</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-footer>
  `,
  styles: [`
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

    /* Header */
    ion-header ion-toolbar {
      --background: white;
      --color: var(--text-primary);
    }

    ion-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
    }

    /* Barre de recherche */
    .search-container {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
      background: white;
      border-bottom: 1px solid var(--border-color);
    }

    .search-container.active {
      max-height: 80px;
      padding: 8px 16px;
    }

    .custom-searchbar {
      --background: #f8f9fa;
      --border-radius: 12px;
      --box-shadow: none;
      --placeholder-color: var(--text-muted);
      --color: var(--text-primary);
    }

    /* Filtres */
    .filters-container {
      padding: 16px;
      background: white;
      border-bottom: 1px solid var(--border-color);
    }

    .custom-segment {
      --background: #f8f9fa;
      border-radius: 12px;
      padding: 4px;
    }

    .custom-segment ion-segment-button {
      --color: var(--text-muted);
      --color-checked: black;
      --background-checked: var(--primary-color);
      --border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      text-transform: none;
      min-height: 36px;
    }

    /* États de recherche */
    .search-empty-state,
    .no-results {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 60vh;
      padding: 20px;
    }

    .empty-content,
    .no-results-content {
      text-align: center;
      color: var(--text-muted);
    }

    .arrow-up {
      font-size: 48px;
      margin-bottom: 16px;
      transform: rotate(-90deg);
      color: var(--text-muted);
    }

    .search-icon {
      font-size: 64px;
      margin-bottom: 16px;
      color: var(--text-muted);
    }

    .empty-content p,
    .no-results-content p {
      margin: 8px 0;
      font-size: 16px;
    }

    .no-results-content h3 {
      margin: 16px 0 8px;
      font-size: 18px;
      color: var(--text-primary);
    }

    /* Résultats de recherche */
    .search-results {
      background: white;
    }

    .results-header {
      padding: 16px;
      border-bottom: 1px solid var(--border-color);
    }

    .results-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .search-results-list {
      background: white;
    }

    .search-result-item {
      --padding-start: 16px;
      --padding-end: 16px;
      --min-height: 60px;
    }

    .search-result-content h4 {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .search-result-content p {
      margin: 0;
      font-size: 14px;
      color: var(--text-secondary);
    }

    /* Liste des cités */
    .cities-list {
      background:rgb(255, 255, 255);
      min-height: calc(100vh - 200px);
    }

    .cities-main-list {
      background: transparent;
      padding: 16px;
    }

    .city-card-container {
      margin-bottom: 16px;
    }

    .city-card {
      margin: 0;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: var(--shadow);
      border: 1px solid var(--border-color);
      transition: all 0.3s ease;
    }

    .city-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    .city-image-container {
      position: relative;
      height: 120px;
      overflow: hidden;
    }

    .city-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .city-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.1) 0%,
        rgba(0, 0, 0, 0.3) 100%
      );
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 12px;
    }

    .city-rating {
      background: rgba(0, 0, 0, 0.6);
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      font-weight: 600;
    }

    .city-rating ion-icon {
      font-size: 12px;
    }

    .city-status ion-chip {
      font-size: 11px;
      height: 24px;
      font-weight: 600;
    }

    .city-info {
      padding: 16px;
    }

    .city-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .city-header h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .city-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .city-rooms {
      margin: 0;
      font-size: 14px;
      color: var(--text-secondary);
    }

    .city-availability {
      text-align: right;
    }

    .available-count {
      font-size: 12px;
      color: var(--primary-color);
      font-weight: 600;
    }

    /* État vide */
    .empty-cities {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 50vh;
      padding: 20px;
    }

    .empty-cities .empty-content {
      text-align: center;
    }

    .empty-cities ion-icon {
      font-size: 64px;
      margin-bottom: 16px;
    }

    .empty-cities h3 {
      margin: 16px 0 8px;
      font-size: 18px;
      color: var(--text-primary);
    }

    .empty-cities p {
      margin: 0;
      color: var(--text-muted);
    }

    /* Footer navigation */
    .custom-tab-bar {
      --background: white;
      --border: 1px solid var(--border-color);
      height: 60px;
      padding-bottom: env(safe-area-inset-bottom);
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

    ion-tab-button ion-icon {
      font-size: 22px;
    }

    ion-tab-button ion-label {
      font-size: 11px;
      font-weight: 500;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .cities-main-list {
        padding: 12px;
      }

      .city-card-container {
        margin-bottom: 12px;
      }

      .city-image-container {
        height: 100px;
      }

      .city-info {
        padding: 12px;
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonList,
    IonItem,
    IonThumbnail,
    IonImg,
    IonIcon,
    IonBadge,
    IonButton,
    IonChip,
    IonModal,
    IonFooter,
    IonTabBar,
    IonTabButton,
    IonNote,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonRefresher,
    IonRefresherContent,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  ]
})
export class CitiesPage implements OnInit {
  showSearch = false;
  searchTerm = '';
  showSearchResults = false;
  selectedFilter: 'tout' | 'en-construction' | 'securite' | 'meublee' = 'tout';
  hasMoreCities = true;

  cities: City[] = [
    {
      id: 1,
      name: 'Digital City',
      subtitle: 'Cité moderne avec portail',
      image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg',
      rating: 4.5,
      totalRooms: 42,
      availableRooms: 3,
      status: ['Sécurisé'],
      category: 'securite',
      price: { amount: 55000, period: 'mois' },
      location: 'Eyang',
      verified: true
    },
    {
      id: 2,
      name: 'Cité Gloire glorieuse',
      subtitle: 'Une cité verte et blanche',
      image: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg',
      rating: 3.5,
      totalRooms: 42,
      availableRooms: 2,
      status: ['En construction'],
      category: 'en-construction',
      price: { amount: 45000, period: 'mois' },
      location: 'Eyang',
      verified: false
    },
    {
      id: 3,
      name: 'Cité Bevina',
      subtitle: 'Cité meublée et confortable',
      image: 'https://images.pexels.com/photos/1449824/pexels-photo-1449824.jpeg',
      rating: 4.1,
      totalRooms: 28,
      availableRooms: 5,
      status: ['Meublée'],
      category: 'meublee',
      price: { amount: 60000, period: 'mois' },
      location: 'Eyang',
      verified: true
    },
    {
      id: 4,
      name: 'Résidence Premium',
      subtitle: 'Luxe et confort',
      image: 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg',
      rating: 4.8,
      totalRooms: 35,
      availableRooms: 1,
      status: ['Sécurisé', 'Meublée'],
      category: 'securite',
      price: { amount: 75000, period: 'mois' },
      location: 'Eyang',
      verified: true
    },
    {
      id: 5,
      name: 'Cité Moderne',
      subtitle: 'Architecture contemporaine',
      image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
      rating: 4.3,
      totalRooms: 50,
      availableRooms: 8,
      status: ['En construction'],
      category: 'en-construction',
      price: { amount: 50000, period: 'mois' },
      location: 'Eyang',
      verified: false
    }
  ];

  searchResults: City[] = [];
  filteredCities: City[] = [];

  constructor(private router: Router) {
    addIcons({
      menuOutline,
      searchOutline,
      closeOutline,
      starOutline,
      star,
      locationOutline,
      homeOutline,
      businessOutline,
      mapOutline,
      personOutline,
      chevronForwardOutline,
      filterOutline,
      constructOutline,
      shieldCheckmarkOutline,
      bedOutline,
    });
  }

  ngOnInit() {
    this.applyFilter();
  }

  toggleSearch() {
    this.showSearch = !this.showSearch;
    if (!this.showSearch) {
      this.searchTerm = '';
      this.showSearchResults = false;
      this.searchResults = [];
    }
  }

  onSearch(event: any) {
    const term = event.target.value?.toLowerCase() || '';
    this.searchTerm = term;

    if (term.trim()) {
      this.showSearchResults = true;
      this.searchResults = this.cities.filter(city =>
        city.name.toLowerCase().includes(term) ||
        city.subtitle.toLowerCase().includes(term) ||
        city.location.toLowerCase().includes(term)
      );
    } else {
      this.showSearchResults = false;
      this.searchResults = [];
    }
  }

  onFilterChange(event: any) {
    this.selectedFilter = event.detail.value;
    this.applyFilter();
  }

  applyFilter() {
    if (this.selectedFilter === 'tout') {
      this.filteredCities = [...this.cities];
    } else {
      this.filteredCities = this.cities.filter(city => city.category === this.selectedFilter);
    }
  }

  selectCity(city: City) {
    this.router.navigate(['/city-details', city.id]);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'en construction':
        return 'warning';
      case 'sécurisé':
        return 'success';
      case 'meublée':
        return 'primary';
      default:
        return 'medium';
    }
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      // Simuler le rechargement des données
      this.applyFilter();
      event.target.complete();
    }, 2000);
  }

  loadMoreCities(event: any) {
    setTimeout(() => {
      // Simuler le chargement de plus de cités
      // Pour cet exemple, on désactive le chargement infini
      this.hasMoreCities = false;
      event.target.complete();
    }, 1000);
  }

  trackByCity(index: number, city: City): number {
    return city.id;
  }
}
