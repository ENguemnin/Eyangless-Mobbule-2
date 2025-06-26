import { Component, OnInit, OnDestroy } from '@angular/core';
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
  IonSpinner,
  IonToast,
  AlertController,
  LoadingController,
  ToastController
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
import { Subscription, Subject  } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil  } from 'rxjs/operators';

// Imports des services et modèles
import { CityService } from '../../../services/city.service';
import { Cite } from '../../../models/city.models';

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

      <!-- Indicateur de chargement -->
      <div class="loading-container" *ngIf="isLoading">
        <ion-spinner name="crescent" color="primary"></ion-spinner>
        <p>Chargement des cités...</p>
      </div>

      <!-- État de recherche vide -->
      <div class="search-empty-state" *ngIf="showSearch && !searchTerm && !showSearchResults && !isLoading">
        <div class="empty-content">
          <div class="arrow-up">
            <ion-icon name="chevron-forward-outline"></ion-icon>
          </div>
          <p>Saisissez votre recherche ici</p>
        </div>
      </div>

      <!-- Résultats de recherche -->
      <div class="search-results" *ngIf="showSearchResults && searchResults.length > 0 && !isLoading">
        <div class="results-header">
          <h3>Résultats de la recherche ({{ searchResults.length }})</h3>
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
              <p>{{ city.totalRooms }} chambres • {{ city.location }}</p>
              <p *ngIf="city.availableRooms && city.availableRooms > 0" class="available-text">
                {{ city.availableRooms }} chambre(s) disponible(s)
              </p>
            </div>
            <ion-icon name="chevron-forward-outline" slot="end" color="medium"></ion-icon>
          </ion-item>
        </ion-list>
      </div>

      <!-- Aucun résultat -->
      <div class="no-results" *ngIf="showSearchResults && searchResults.length === 0 && searchTerm && !isLoading">
        <div class="no-results-content">
          <div class="search-icon">
            <ion-icon name="search-outline"></ion-icon>
          </div>
          <h3>Aucun résultat pour votre recherche</h3>
          <p>"{{ searchTerm }}"</p>
          <ion-button fill="outline" color="primary" (click)="clearSearch()">
            Effacer la recherche
          </ion-button>
        </div>
      </div>

      <!-- Liste des cités -->
      <div class="cities-list" *ngIf="!showSearch || (!showSearchResults && !searchTerm)">
        <ion-list class="cities-main-list" *ngIf="!isLoading">
          <div
            *ngFor="let city of filteredCities; trackBy: trackByCity"
            class="city-card-container"
          >
            <ion-card class="city-card" button (click)="selectCity(city)">
              <div class="city-image-container">
                <ion-img
                  [src]="city.image"
                  [alt]="city.name"
                  class="city-image"
                  (ionError)="onImageError($event)"
                ></ion-img>
                <div class="city-overlay">
                  <div class="city-rating" *ngIf="city.rating && city.rating > 0">
                    <ion-icon name="star" color="warning"></ion-icon>
                    <span>{{ city.rating }}</span>
                  </div>
                  <div class="city-status" *ngIf="city.status && city.status.length > 0">
                    <ion-chip
                      *ngFor="let status of city.status.slice(0, 1)"
                      [color]="getStatusColor(status)"
                      size="small"
                    >
                      {{ status }}
                    </ion-chip>
                  </div>
                  <div class="verified-badge" *ngIf="city.verified">
                    <ion-icon name="shield-checkmark-outline" color="success"></ion-icon>
                  </div>
                </div>
              </div>

              <ion-card-content class="city-info">
                <div class="city-header">
                  <div class="city-name-section">
                    <h3>{{ city.name }}</h3>
                    <p class="city-location" *ngIf="city.location">
                      <ion-icon name="location-outline"></ion-icon>
                      {{ city.location }}
                    </p>
                  </div>
                  <ion-icon name="chevron-forward-outline" color="medium"></ion-icon>
                </div>

                <div class="city-details">
                  <div class="rooms-info">
                    <p class="city-rooms">
                      <ion-icon name="bed-outline"></ion-icon>
                      {{ city.totalRooms }} chambre(s)
                    </p>
                    <div class="city-availability" *ngIf="city.availableRooms && city.availableRooms > 0">
                      <span class="available-count">{{ city.availableRooms }} libre(s)</span>
                    </div>
                  </div>

                  <div class="price-info" *ngIf="city.price">
                    <span class="price-amount">{{ city.price.amount | currency:'XAF':'symbol':'1.0-0' }}</span>
                    <span class="price-period">/{{ city.price.period }}</span>
                  </div>
                </div>

                <p class="city-description" *ngIf="city.subtitle">{{ city.subtitle }}</p>
              </ion-card-content>
            </ion-card>
          </div>
        </ion-list>

        <!-- Message si aucune cité -->
        <div class="empty-cities" *ngIf="filteredCities.length === 0 && !isLoading">
          <div class="empty-content">
            <ion-icon name="business-outline" color="medium"></ion-icon>
            <h3>Aucune cité trouvée</h3>
            <p *ngIf="selectedFilter !== 'tout'">Essayez de modifier vos filtres</p>
            <p *ngIf="selectedFilter === 'tout'">Aucune cité n'est disponible pour le moment</p>
            <ion-button fill="outline" color="primary" (click)="refreshCities()">
              Actualiser
            </ion-button>
          </div>
        </div>

        <!-- Infinite scroll -->
        <ion-infinite-scroll
          (ionInfinite)="loadMoreCities($event)"
          [disabled]="!hasMoreCities || isLoading"
          *ngIf="filteredCities.length > 0"
        >
          <ion-infinite-scroll-content></ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </div>

      <!-- Message d'erreur -->
      <ion-toast
        [isOpen]="showError"
        [message]="errorMessage"
        duration="5000"
        color="danger"
        position="top"
        (didDismiss)="showError = false"
      ></ion-toast>
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
// Variables de couleurs
:root {
  --primary-color: #3880ff;
  --primary-light: #5598ff;
  --primary-dark: #2266ee;
  --success-color: #2dd36f;
  --warning-color: #ffc409;
  --danger-color: #eb445a;
  --light-color: #f4f5f8;
  --medium-color: #92949c;
  --dark-color: #222428;
  --white-color: #ffffff;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  --shadow-hover: 0 4px 12px rgba(0, 0, 0, 0.15);
  --border-radius: 12px;
  --border-radius-small: 8px;
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
}

// Header personnalisé
ion-header {
  ion-toolbar {
    --background: var(--white-color);
    --color: var(--dark-color);
    --border-color: transparent;
    
    ion-title {
      font-weight: 600;
      font-size: 1.2rem;
    }
    
    ion-button {
      --color: var(--primary-color);
    }
  }
}

// Container de recherche
.search-container {
  padding: var(--spacing-md);
  background: var(--white-color);
  border-bottom: 1px solid var(--ion-color-light-shade);
  transform: translateY(-100%);
  opacity: 0;
  transition: all 0.3s ease-in-out;
  
  &.active {
    transform: translateY(0);
    opacity: 1;
  }
  
  .custom-searchbar {
    --background: var(--light-color);
    --border-radius: var(--border-radius);
    --box-shadow: none;
    --color: var(--dark-color);
    --placeholder-color: var(--medium-color);
    --icon-color: var(--primary-color);
    --clear-button-color: var(--medium-color);
    
    .searchbar-input-container {
      border: 2px solid transparent;
      transition: border-color 0.2s ease;
      
      &:focus-within {
        border-color: var(--primary-color);
      }
    }
  }
}

// Container de filtres
.filters-container {
  padding: var(--spacing-md);
  background: var(--white-color);
  
  .custom-segment {
    --background: var(--light-color);
    border-radius: var(--border-radius);
    padding: var(--spacing-xs);
    
    ion-segment-button {
      --color: var(--medium-color);
      --color-checked: var(--white-color);
      --background-checked: var(--primary-color);
      --indicator-color: transparent;
      --indicator-box-shadow: none;
      border-radius: var(--border-radius-small);
      margin: 0 2px;
      font-size: 0.9rem;
      font-weight: 500;
      min-height: 36px;
      transition: all 0.2s ease;
      
      &.segment-button-checked {
        transform: translateY(-1px);
        box-shadow: var(--shadow);
      }
      
      ion-label {
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}

// États de chargement et vides
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  
  ion-spinner {
    margin-bottom: var(--spacing-md);
  }
  
  p {
    color: var(--medium-color);
    margin: 0;
  }
}

.search-empty-state,
.empty-cities,
.no-results {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  min-height: 300px;
  
  .empty-content,
  .no-results-content {
    text-align: center;
    max-width: 300px;
    
    .arrow-up,
    .search-icon {
      font-size: 3rem;
      color: var(--medium-color);
      margin-bottom: var(--spacing-md);
      
      ion-icon {
        transform: rotate(-90deg);
      }
    }
    
    .search-icon ion-icon {
      transform: none;
    }
    
    ion-icon {
      font-size: 3rem;
      color: var(--medium-color);
      margin-bottom: var(--spacing-md);
    }
    
    h3 {
      color: var(--dark-color);
      font-weight: 600;
      margin-bottom: var(--spacing-sm);
    }
    
    p {
      color: var(--medium-color);
      margin-bottom: var(--spacing-lg);
      line-height: 1.5;
    }
    
    ion-button {
      --border-radius: var(--border-radius);
    }
  }
}

// Résultats de recherche
.search-results {
  padding: var(--spacing-md);
  
  .results-header {
    margin-bottom: var(--spacing-md);
    
    h3 {
      color: var(--dark-color);
      font-weight: 600;
      margin: 0;
      font-size: 1.1rem;
    }
  }
  
  .search-results-list {
    background: transparent;
    
    .search-result-item {
      --background: var(--white-color);
      --border-radius: var(--border-radius);
      margin-bottom: var(--spacing-sm);
      box-shadow: var(--shadow);
      transition: all 0.2s ease;
      
      &:hover {
        box-shadow: var(--shadow-hover);
        transform: translateY(-1px);
      }
      
      .search-result-content {
        flex: 1;
        
        h4 {
          color: var(--dark-color);
          font-weight: 600;
          margin: 0 0 var(--spacing-xs) 0;
          font-size: 1rem;
        }
        
        p {
          color: var(--medium-color);
          margin: 0;
          font-size: 0.9rem;
          
          &.available-text {
            color: var(--success-color);
            font-weight: 500;
          }
        }
      }
    }
  }
}

// Liste principale des cités
.cities-list {
  padding: var(--spacing-md);
  
  .cities-main-list {
    background: transparent;
    
    .city-card-container {
      margin-bottom: var(--spacing-lg);
    }
  }
}

// Cartes des cités
.city-card {
  --background: var(--white-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow);
  margin: 0;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: var(--shadow-hover);
    transform: translateY(-2px);
  }
  
  .city-image-container {
    position: relative;
    height: 200px;
    overflow: hidden;
    
    .city-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    
    &:hover .city-image {
      transform: scale(1.05);
    }
    
    .city-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 50%, rgba(0,0,0,0.3) 100%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: var(--spacing-md);
      
      .city-rating {
        align-self: flex-start;
        background: rgba(0, 0, 0, 0.7);
        color: var(--white-color);
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--border-radius);
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        font-size: 0.9rem;
        font-weight: 600;
        
        ion-icon {
          font-size: 1rem;
        }
      }
      
      .city-status {
        align-self: flex-end;
        display: flex;
        gap: var(--spacing-xs);
        
        ion-chip {
          --background: rgba(255, 255, 255, 0.9);
          --color: var(--dark-color);
          font-size: 0.8rem;
          font-weight: 500;
          height: 24px;
        }
      }
      
      .verified-badge {
        position: absolute;
        top: var(--spacing-md);
        right: var(--spacing-md);
        background: var(--success-color);
        color: var(--white-color);
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        ion-icon {
          font-size: 1.2rem;
        }
      }
    }
  }
  
  .city-info {
    padding: var(--spacing-md);
    
    .city-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-md);
      
      .city-name-section {
        flex: 1;
        
        h3 {
          color: var(--dark-color);
          font-weight: 600;
          margin: 0 0 var(--spacing-xs) 0;
          font-size: 1.2rem;
          line-height: 1.3;
        }
        
        .city-location {
          display: flex;
          align-items: center;
          color: var(--medium-color);
          margin: 0;
          font-size: 0.9rem;
          gap: var(--spacing-xs);
          
          ion-icon {
            font-size: 1rem;
          }
        }
      }
      
      > ion-icon {
        color: var(--medium-color);
        font-size: 1.2rem;
        margin-top: var(--spacing-xs);
      }
    }
    
    .city-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-md);
      
      .rooms-info {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
        
        .city-rooms {
          display: flex;
          align-items: center;
          color: var(--dark-color);
          margin: 0;
          font-size: 0.9rem;
          font-weight: 500;
          gap: var(--spacing-xs);
          
          ion-icon {
            font-size: 1rem;
            color: var(--primary-color);
          }
        }
        
        .city-availability {
          .available-count {
            background: var(--success-color);
            color: var(--white-color);
            padding: 2px var(--spacing-sm);
            border-radius: var(--border-radius);
            font-size: 0.8rem;
            font-weight: 500;
          }
        }
      }
      
      .price-info {
        text-align: right;
        
        .price-amount {
          color: var(--primary-color);
          font-weight: 700;
          font-size: 1.2rem;
        }
        
        .price-period {
          color: var(--medium-color);
          font-size: 0.9rem;
        }
      }
    }
    
    .city-description {
      color: var(--medium-color);
      margin: 0;
      font-size: 0.9rem;
      line-height: 1.4;
    }
  }
}

// Footer personnalisé
ion-footer {
  .custom-tab-bar {
    --background: var(--white-color);
    --border: 1px solid var(--ion-color-light-shade);
    height: 60px;
    
    ion-tab-button {
      --color: var(--medium-color);
      --color-selected: var(--primary-color);
      --ripple-color: var(--primary-color);
      flex-direction: column;
      gap: var(--spacing-xs);
      
      &.active {
        --color: var(--primary-color);
        
        ion-icon {
          transform: translateY(-2px);
        }
        
        ion-label {
          font-weight: 600;
        }
      }
      
      ion-icon {
        font-size: 1.3rem;
        transition: transform 0.2s ease;
      }
      
      ion-label {
        font-size: 0.8rem;
        margin: 0;
      }
    }
  }
}

// Toast personnalisé
ion-toast {
  --border-radius: var(--border-radius);
  --box-shadow: var(--shadow-hover);
}

// Animations
@keyframes slideInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

.city-card {
  animation: slideInUp 0.5s ease forwards;
}

.city-rating {
  animation: pulse 2s ease-in-out infinite;
}

// Responsive design
@media (max-width: 576px) {
  .filters-container {
    .custom-segment {
      ion-segment-button {
        font-size: 0.8rem;
        
        ion-label {
          padding: 0 var(--spacing-xs);
        }
      }
    }
  }
  
  .city-card {
    .city-image-container {
      height: 180px;
    }
    
    .city-info {
      padding: var(--spacing-sm);
      
      .city-header {
        .city-name-section h3 {
          font-size: 1.1rem;
        }
      }
      
      .city-details {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-sm);
        
        .price-info {
          text-align: left;
          align-self: flex-end;
        }
      }
    }
  }
}

@media (min-width: 768px) {
  .cities-list {
    .cities-main-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-md);
      
      .city-card-container {
        margin-bottom: 0;
      }
    }
  }
}

@media (min-width: 1024px) {
  .cities-list {
    .cities-main-list {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}

// Dark mode support
@media (prefers-color-scheme: dark) {
  :root {
    --white-color: #1e1e1e;
    --light-color: #2a2a2a;
    --dark-color: #ffffff;
    --medium-color: #a0a0a0;
    --shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    --shadow-hover: 0 4px 12px rgba(0, 0, 0, 0.4);
  }
}  `],
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
    IonSpinner,
    IonToast
  ]
})
export class CitiesPage implements OnInit, OnDestroy {
  // Propriétés de données
  cities: Cite[] = [];
  filteredCities: Cite[] = [];
  searchResults: Cite[] = [];

  // Propriétés d'état
  isLoading = false;
  showSearch = false;
  showSearchResults = false;
  showError = false;
  errorMessage = '';

  // Propriétés de recherche et filtrage
  searchTerm = '';
  selectedFilter: 'tout' | 'en-construction' | 'securite' | 'meublee' = 'tout';

  // Pagination
  currentPage = 0;
  pageSize = 10;
  hasMoreCities = true;

  // Gestion des souscriptions
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();
  private subscriptions: Subscription[] = [];

  constructor(
    private cityService: CityService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    // Ajouter les icônes
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

    // Configuration de la recherche avec debounce
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(searchTerm => {
      this.performSearch(searchTerm);
    });
  }

  ngOnInit() {
    this.loadInitialData();
    this.setupSubscriptions();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Configuration des souscriptions aux observables
   */
  private setupSubscriptions() {
    // Souscription aux cités
    const citiesSubscription = this.cityService.cites$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(cities => {
      this.cities = cities;
      this.applyFilter();
    });

    // Souscription au loading
    const loadingSubscription = this.cityService.loading$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(loading => {
      this.isLoading = loading;
    });

    this.subscriptions.push(citiesSubscription, loadingSubscription);
  }

  /**
   * Chargement initial des données
   */
  private async loadInitialData() {
    try {
      const loading = await this.loadingController.create({
        message: 'Chargement des cités...',
        spinner: 'crescent'
      });
      await loading.present();

      this.cityService.getAllCites(0, this.pageSize).subscribe({
        next: (response) => {
          this.hasMoreCities = !response.last;
          loading.dismiss();
        },
        error: (error) => {
          console.error('Erreur lors du chargement des cités:', error);
          this.showErrorMessage('Erreur lors du chargement des cités');
          loading.dismiss();
        }
      });
    } catch (error) {
      console.error('Erreur lors de la création du loading:', error);
    }
  }

  /**
   * Gestion de la recherche
   */
  toggleSearch() {
    this.showSearch = !this.showSearch;
    if (!this.showSearch) {
      this.clearSearch();
    }
  }

  onSearch(event: any) {
    const searchTerm = event.target.value?.trim() || '';
    this.searchTerm = searchTerm;

    if (searchTerm) {
      this.searchSubject.next(searchTerm);
    } else {
      this.showSearchResults = false;
      this.searchResults = [];
    }
  }

  private performSearch(searchTerm: string) {
    if (!searchTerm.trim()) {
      this.showSearchResults = false;
      this.searchResults = [];
      return;
    }

    this.cityService.searchCites(searchTerm).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.showSearchResults = true;
      },
      error: (error) => {
        console.error('Erreur lors de la recherche:', error);
        this.showErrorMessage('Erreur lors de la recherche');
      }
    });
  }

  clearSearch() {
    this.searchTerm = '';
    this.showSearchResults = false;
    this.searchResults = [];
    this.showSearch = false;
  }

  /**
   * Gestion des filtres
   */
  onFilterChange(event: any) {
    this.selectedFilter = event.detail.value;
    this.applyFilter();
  }

  private applyFilter() {
    this.cityService.filterCitesByCategory(this.selectedFilter).subscribe({
      next: (filteredCities) => {
        this.filteredCities = filteredCities;
      },
      error: (error) => {
        console.error('Erreur lors du filtrage:', error);
        this.showErrorMessage('Erreur lors du filtrage des cités');
      }
    });
  }

  /**
   * Gestion de la pagination et du rafraîchissement
   */
  async handleRefresh(event: any) {
    try {
      this.currentPage = 0;
      this.hasMoreCities = true;

      this.cityService.getAllCites(0, this.pageSize).subscribe({
        next: (response) => {
          this.hasMoreCities = !response.last;
          event.target.complete();
        },
        error: (error) => {
          console.error('Erreur lors du rafraîchissement:', error);
          this.showErrorMessage('Erreur lors du rafraîchissement');
          event.target.complete();
        }
      });
    } catch (error) {
      console.error('Erreur lors du rafraîchissement:', error);
      event.target.complete();
    }
  }

  loadMoreCities(event: any) {
    if (!this.hasMoreCities || this.isLoading) {
      event.target.complete();
      return;
    }

    this.currentPage++;

    this.cityService.getAllCites(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.hasMoreCities = !response.last;
        event.target.complete();
      },
      error: (error) => {
        console.error('Erreur lors du chargement de plus de cités:', error);
        this.currentPage--; // Revenir à la page précédente en cas d'erreur
        this.showErrorMessage('Erreur lors du chargement');
        event.target.complete();
      }
    });
  }

  refreshCities() {
    this.currentPage = 0;
    this.hasMoreCities = true;
    this.cityService.refreshCites();
  }

  /**
   * Navigation et sélection
   */
  selectCity(city: Cite) {
    if (city.id) {
      this.router.navigate(['/city-details', city.id]);
    } else {
      this.showErrorMessage('Impossible d\'ouvrir les détails de cette cité');
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  /**
   * Utilitaires pour les templates
   */
  trackByCity(index: number, city: Cite): string {
    return city.id || index.toString();
  }

  getStatusColor(status: string): string {
    const statusColorMap: { [key: string]: string } = {
      'En construction': 'warning',
      'Sécurisé': 'success',
      'Meublé': 'secondary',
      'Vérifiée': 'success',
      'Nouveau': 'primary',
      'Populaire': 'tertiary'
    };

    return statusColorMap[status] || 'medium';
  }

  onImageError(event: any) {
    // Image de secours en cas d'erreur de chargement
    const fallbackImages = [
      'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1449824/pexels-photo-1449824.jpeg?auto=compress&cs=tinysrgb&w=800'
    ];

    event.target.src = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  }

  /**
   * Gestion des erreurs et notifications
   */
  private showErrorMessage(message: string) {
    this.errorMessage = message;
    this.showError = true;
  }

  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
