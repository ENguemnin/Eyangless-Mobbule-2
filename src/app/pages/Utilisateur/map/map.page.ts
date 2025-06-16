import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonButton,
  IonModal,
  IonFooter,
  IonTabBar,
  IonTabButton,
  AlertController,
  LoadingController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  menuOutline,
  searchOutline,
  closeOutline,
  locationOutline,
  navigateOutline,
  homeOutline,
  businessOutline,
  personOutline,
  carOutline,
  walkOutline,
  bicycleOutline
} from 'ionicons/icons';
import * as L from 'leaflet';

interface MapLocation {
  id: number;
  name: string;
  lat: number;
  lng: number;
  type: 'cite' | 'campus' | 'user';
  rooms?: number;
  available?: number;
  rating?: number;
}

interface RouteInfo {
  distance: string;
  duration: string;
  coordinates: [number, number][];
}

@Component({
  selector: 'app-map',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Carte</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" color="primary" (click)="toggleSearch()">
            <ion-icon slot="icon-only" [name]="showSearch ? 'close-outline' : 'search-outline'"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
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

      <!-- Résultats de recherche -->
      <div class="search-results" *ngIf="showSearchResults && searchResults.length > 0">
        <div class="results-header">
          <h3>Résultats de la recherche</h3>
        </div>
        <ion-list class="search-results-list">
          <ion-item 
            *ngFor="let location of searchResults"
            button
            (click)="selectLocation(location)"
            class="search-result-item"
          >
            <div class="search-result-content">
              <h4>{{ location.name }}</h4>
              <p *ngIf="location.rooms">{{ location.rooms }} chambres</p>
            </div>
            <ion-icon name="navigate-outline" slot="end" color="primary"></ion-icon>
          </ion-item>
        </ion-list>
      </div>

      <!-- Carte -->
      <div #mapContainer class="map-container" [class.with-search]="showSearch"></div>

      <!-- Panneau d'itinéraire -->
      <div class="route-panel" *ngIf="showRoutePanel">
        <div class="route-header">
          <div class="route-points">
            <div class="route-point">
              <div class="point-icon start"></div>
              <span>{{ routeStart }}</span>
            </div>
            <div class="route-line"></div>
            <div class="route-point">
              <div class="point-icon end"></div>
              <span>{{ routeEnd }}</span>
            </div>
          </div>
          <ion-button fill="clear" size="small" (click)="closeRoute()">
            <ion-icon name="close-outline" color="medium"></ion-icon>
          </ion-button>
        </div>
        
        <div class="route-info" *ngIf="currentRoute">
          <div class="route-distance">{{ currentRoute.distance }}</div>
          <div class="route-modes">
            <ion-button 
              fill="clear" 
              size="small" 
              [color]="routeMode === 'walking' ? 'primary' : 'medium'"
              (click)="changeRouteMode('walking')"
            >
              <ion-icon name="walk-outline"></ion-icon>
            </ion-button>
            <ion-button 
              fill="clear" 
              size="small" 
              [color]="routeMode === 'driving' ? 'primary' : 'medium'"
              (click)="changeRouteMode('driving')"
            >
              <ion-icon name="car-outline"></ion-icon>
            </ion-button>
          </div>
        </div>
      </div>
    </ion-content>

    <!-- Modal de sélection de destination -->
    <ion-modal [isOpen]="showDestinationModal" (didDismiss)="closeDestinationModal()">
      <ng-template>
        <div class="modal-content">
          <div class="modal-header">
            <h2>Choisir la destination</h2>
            <ion-button fill="clear" size="small" (click)="closeDestinationModal()">
              <ion-icon name="close-outline"></ion-icon>
            </ion-button>
          </div>
          <div class="destination-options">
            <ion-item button (click)="selectDestination('campus')">
              <ion-label>Le campus d'Eyang</ion-label>
            </ion-item>
            <ion-item button (click)="selectDestination('position')">
              <ion-label>Ma position</ion-label>
            </ion-item>
          </div>
        </div>
      </ng-template>
    </ion-modal>

    <!-- Footer avec navigation -->
    <ion-footer class="ion-no-border">
      <ion-tab-bar class="custom-tab-bar">
        <ion-tab-button (click)="navigateTo('/home')">
          <ion-icon name="home-outline"></ion-icon>
          <ion-label>Accueil</ion-label>
        </ion-tab-button>

        <ion-tab-button (click)="navigateTo('/cities')">
          <ion-icon name="business-outline"></ion-icon>
          <ion-label>Cités</ion-label>
        </ion-tab-button>

        <ion-tab-button class="active">
          <ion-icon name="location-outline"></ion-icon>
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
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

    /* Résultats de recherche */
    .search-results {
      position: absolute;
      top: 80px;
      left: 0;
      right: 0;
      z-index: 999;
      background: white;
      max-height: 300px;
      overflow-y: auto;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .results-header {
      padding: 12px 16px;
      border-bottom: 1px solid var(--border-color);
      background: #f8f9fa;
    }

    .results-header h3 {
      margin: 0;
      font-size: 14px;
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

    /* Carte */
    .map-container {
      height: 100%;
      width: 100%;
      transition: height 0.3s ease;
    }

    .map-container.with-search {
      height: calc(100% - 80px);
      margin-top: 80px;
    }

    /* Panneau d'itinéraire */
    .route-panel {
      position: absolute;
      top: 16px;
      left: 16px;
      right: 16px;
      z-index: 1000;
      background: white;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .route-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .route-points {
      flex: 1;
    }

    .route-point {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }

    .route-point:last-child {
      margin-bottom: 0;
    }

    .point-icon {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .point-icon.start {
      background: #10b981;
    }

    .point-icon.end {
      background: #ef4444;
    }

    .route-line {
      width: 2px;
      height: 20px;
      background: linear-gradient(to bottom, #10b981, #ef4444);
      margin-left: 5px;
      margin-bottom: 8px;
    }

    .route-point span {
      font-size: 14px;
      color: var(--text-primary);
      font-weight: 500;
    }

    .route-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .route-distance {
      font-size: 18px;
      font-weight: 600;
      color: var(--primary-color);
    }

    .route-modes {
      display: flex;
      gap: 8px;
    }

    /* Modal */
    .modal-content {
      padding: 20px;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .destination-options ion-item {
      --padding-start: 0;
      --padding-end: 0;
      --min-height: 48px;
      margin-bottom: 8px;
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
      .route-panel {
        top: 8px;
        left: 8px;
        right: 8px;
        padding: 12px;
      }

      .route-distance {
        font-size: 16px;
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
    IonList,
    IonItem,
    IonLabel,
    IonIcon,
    IonButton,
    IonModal,
    IonFooter,
    IonTabBar,
    IonTabButton
  ]
})
export class MapPage implements OnInit, AfterViewInit {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  private map!: L.Map;
  private userLocation: [number, number] = [3.8667, 11.5167]; // Yaoundé par défaut
  private routeLayer?: L.Polyline;
  private markers: L.Marker[] = [];

  showSearch = false;
  searchTerm = '';
  showSearchResults = false;
  showRoutePanel = false;
  showDestinationModal = false;
  
  routeStart = 'Ma position';
  routeEnd = '';
  routeMode: 'walking' | 'driving' = 'walking';
  currentRoute?: RouteInfo;

  locations: MapLocation[] = [
    {
      id: 1,
      name: 'Cité Bevina',
      lat: 3.8700,
      lng: 11.5200,
      type: 'cite',
      rooms: 28,
      available: 2,
      rating: 4.5
    },
    {
      id: 2,
      name: 'Cité Colonel',
      lat: 3.8650,
      lng: 11.5150,
      type: 'cite',
      rooms: 28,
      available: 5,
      rating: 4.2
    },
    {
      id: 3,
      name: 'Cité RPN',
      lat: 3.8720,
      lng: 11.5180,
      type: 'cite',
      rooms: 28,
      available: 3,
      rating: 4.0
    },
    {
      id: 4,
      name: 'City of peace',
      lat: 3.8680,
      lng: 11.5160,
      type: 'cite',
      rooms: 35,
      available: 1,
      rating: 4.8
    },
    {
      id: 5,
      name: 'INSTITUT SAINT JEAN (SITE D\'EYANG)',
      lat: 3.8620,
      lng: 11.5120,
      type: 'campus'
    }
  ];

  searchResults: MapLocation[] = [];

  constructor(
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    addIcons({
      menuOutline,
      searchOutline,
      closeOutline,
      locationOutline,
      navigateOutline,
      homeOutline,
      businessOutline,
      personOutline,
      carOutline,
      walkOutline,
      bicycleOutline
    });
  }

  ngOnInit() {
    this.getCurrentLocation();
  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  private async getCurrentLocation() {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        });
      });
      
      this.userLocation = [position.coords.latitude, position.coords.longitude];
      
      if (this.map) {
        this.updateUserLocationOnMap();
      }
    } catch (error) {
      console.warn('Géolocalisation non disponible, utilisation de la position par défaut');
    }
  }

  private initializeMap() {
    // Configuration des icônes Leaflet
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;

    // Initialisation de la carte
    this.map = L.map(this.mapContainer.nativeElement, {
      center: this.userLocation,
      zoom: 14,
      zoomControl: false
    });

    // Ajout de la couche OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Ajout du contrôle de zoom
    L.control.zoom({
      position: 'bottomright'
    }).addTo(this.map);

    // Ajout des marqueurs
    this.addMarkersToMap();
    this.updateUserLocationOnMap();
  }

  private addMarkersToMap() {
    this.locations.forEach(location => {
      const marker = this.createMarker(location);
      this.markers.push(marker);
    });
  }

  private createMarker(location: MapLocation): L.Marker {
    const icon = this.getMarkerIcon(location.type);
    const marker = L.marker([location.lat, location.lng], { icon }).addTo(this.map);

    // Popup pour les cités
    if (location.type === 'cite') {
      const popupContent = `
        <div class="marker-popup">
          <h4>${location.name}</h4>
          <p>${location.rooms} chambres</p>
          ${location.available ? `<p class="available">${location.available} chambres libres</p>` : ''}
          <button onclick="window.selectCiteFromMap(${location.id})" class="popup-button">
            Voir plus
          </button>
          <button onclick="window.navigateToCite(${location.id})" class="popup-button route">
            Itinéraire
          </button>
        </div>
      `;
      marker.bindPopup(popupContent);
    } else {
      marker.bindPopup(`<div class="marker-popup"><h4>${location.name}</h4></div>`);
    }

    return marker;
  }

  private getMarkerIcon(type: string): L.Icon | L.DivIcon {
    let color = '#1dd1a1';
    
    switch (type) {
      case 'cite':
        color = '#e91e63'; // Rose pour les cités
        break;
      case 'campus':
        color = '#9e9e9e'; // Gris pour le campus
        break;
      case 'user':
        color = '#2196f3'; // Bleu pour l'utilisateur
        break;
    }

    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  }

  private updateUserLocationOnMap() {
    // Supprimer l'ancien marqueur utilisateur s'il existe
    const existingUserMarker = this.markers.find(m => (m as any).isUserMarker);
    if (existingUserMarker) {
      this.map.removeLayer(existingUserMarker);
      this.markers = this.markers.filter(m => m !== existingUserMarker);
    }

    // Ajouter le nouveau marqueur utilisateur
    const userIcon = this.getMarkerIcon('user');
    const userMarker = L.marker(this.userLocation, { icon: userIcon }).addTo(this.map);
    (userMarker as any).isUserMarker = true;
    userMarker.bindPopup('<div class="marker-popup"><h4>Ma position</h4></div>');
    this.markers.push(userMarker);

    // Centrer la carte sur la position de l'utilisateur
    this.map.setView(this.userLocation, 14);
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
      this.searchResults = this.locations.filter(location =>
        location.name.toLowerCase().includes(term) ||
        (location.type === 'cite' && 'cité'.includes(term))
      );
    } else {
      this.showSearchResults = false;
      this.searchResults = [];
    }
  }

  selectLocation(location: MapLocation) {
    this.showSearch = false;
    this.showSearchResults = false;
    this.searchTerm = '';
    
    // Centrer la carte sur la location
    this.map.setView([location.lat, location.lng], 16);
    
    // Ouvrir le popup du marqueur
    const marker = this.markers.find(m => {
      const latLng = m.getLatLng();
      return latLng.lat === location.lat && latLng.lng === location.lng;
    });
    
    if (marker) {
      marker.openPopup();
    }
  }

  async calculateRoute(destinationId: number) {
    const destination = this.locations.find(l => l.id === destinationId);
    if (!destination) return;

    const loading = await this.loadingController.create({
      message: 'Calcul de l\'itinéraire...',
      duration: 1000
    });
    await loading.present();

    // Simulation du calcul d'itinéraire
    setTimeout(() => {
      this.showRoutePanel = true;
      this.routeEnd = destination.name;
      
      // Simulation des données d'itinéraire
      const distance = this.calculateDistance(
        this.userLocation[0], this.userLocation[1],
        destination.lat, destination.lng
      );
      
      this.currentRoute = {
        distance: `${Math.round(distance * 1000)}m`,
        duration: `${Math.round(distance * 15)} min`,
        coordinates: [this.userLocation, [destination.lat, destination.lng]]
      };

      this.drawRoute();
      loading.dismiss();
    }, 1000);
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  private drawRoute() {
    if (this.routeLayer) {
      this.map.removeLayer(this.routeLayer);
    }

    if (this.currentRoute) {
      this.routeLayer = L.polyline(this.currentRoute.coordinates, {
        color: '#1dd1a1',
        weight: 4,
        opacity: 0.8
      }).addTo(this.map);

      // Ajuster la vue pour inclure tout l'itinéraire
      const group = new L.FeatureGroup([this.routeLayer]);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  closeRoute() {
    this.showRoutePanel = false;
    if (this.routeLayer) {
      this.map.removeLayer(this.routeLayer);
      this.routeLayer = undefined;
    }
    this.currentRoute = undefined;
  }

  changeRouteMode(mode: 'walking' | 'driving') {
    this.routeMode = mode;
    // Ici vous pourriez recalculer l'itinéraire selon le mode
    this.showToast(`Mode ${mode === 'walking' ? 'piéton' : 'voiture'} sélectionné`);
  }

  openDestinationModal() {
    this.showDestinationModal = true;
  }

  closeDestinationModal() {
    this.showDestinationModal = false;
  }

  selectDestination(type: 'campus' | 'position') {
    this.closeDestinationModal();
    
    if (type === 'campus') {
      const campus = this.locations.find(l => l.type === 'campus');
      if (campus) {
        this.calculateRoute(campus.id);
      }
    } else {
      this.routeStart = 'Ma position';
      this.showToast('Position actuelle sélectionnée comme point de départ');
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    await toast.present();
  }
}

// Fonctions globales pour les popups
declare global {
  interface Window {
    selectCiteFromMap: (id: number) => void;
    navigateToCite: (id: number) => void;
  }
}

window.selectCiteFromMap = (id: number) => {
  // Navigation vers les détails de la cité
  window.location.href = `/city-details/${id}`;
};

window.navigateToCite = (id: number) => {
  // Déclencher le calcul d'itinéraire
  const mapComponent = (window as any).mapComponentInstance;
  if (mapComponent) {
    mapComponent.calculateRoute(id);
  }
};