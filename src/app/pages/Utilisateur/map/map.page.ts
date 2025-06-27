import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  IonBadge,
  ToastController,
  AlertController,
  LoadingController
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
  bicycleOutline,
  chevronForwardOutline,
  starOutline,
  star,
  trainOutline,
  mapOutline
} from 'ionicons/icons';
import * as L from 'leaflet';

interface MapLocation {
  id: number;
  nom: string;
  categorie: {
    nom: string;
  };
  adresses: Array<{
    latitude: number;
    longitude: number;
  }>;
  type: 'cite' | 'campus' | 'user';
  rooms?: number;
  available?: number;
  rating?: number;
  distance?: string;
  walkTime?: string;
  description?: string;
  price?: number;
}

interface DurationInfo {
  value: string;
  calculated: boolean;
}

@Component({
  selector: 'app-map',
  template: `
    <ion-content>
      <div class="carte">
        <!-- Carte Leaflet -->
        <div #mapContainer id="map"></div>
        
        <!-- Bouton de fermeture -->
        <div class="cross" (click)="goBack()">
          <ion-icon name="close-outline"></ion-icon>
        </div>
        
        <!-- Barre de recherche -->
        <div class="searchbar">  
          <ion-searchbar 
            mode="ios" 
            [(ngModel)]="searchText" 
            (ionInput)="search($event)" 
            placeholder="Rechercher une cité..."
            show-clear-button="focus">
          </ion-searchbar>
        </div>

        <!-- Résultats de recherche -->
        <div class="search-results-container" *ngIf="pointsInteretFiltered.length > 0">
          <div 
            class="search-result" 
            *ngFor="let pointInteret of pointsInteretFiltered; trackBy: trackByLocation"
            (click)="calculateItinerary(pointInteret)">
            {{ pointInteret.nom }} - 
            <span class="categorie">{{ getCategoryName(pointInteret) }}</span>
          </div>
        </div>

        <!-- Indicateurs de durée -->
        <div class="type-container" *ngIf="pointsInteretFiltered.length === 0 && showDurations">
          <div class="type" *ngIf="walkingDuration.calculated">
            <span>{{ walkingDuration.value }}</span>
            <ion-icon name="walk-outline"></ion-icon>
          </div>
          
          <div class="type" *ngIf="ridingDuration.calculated">
            <span>{{ ridingDuration.value }}</span>
            <ion-icon name="bicycle-outline"></ion-icon>
          </div>

          <div class="type" *ngIf="drivingDuration.calculated">
            <span>{{ drivingDuration.value }}</span>
            <ion-icon name="car-outline"></ion-icon>
          </div>
          
          <div class="type" *ngIf="trainDuration.calculated">
            <span>{{ trainDuration.value }}</span>
            <ion-icon name="train-outline"></ion-icon>
          </div>
        </div>

        <!-- Boutons d'action -->
        <div class="action-buttons" *ngIf="selectedLocation">
          <ion-button 
            fill="solid" 
            color="primary" 
            size="small"
            (click)="calculateFromCurrentPosition()">
            <ion-icon name="location-outline" slot="start"></ion-icon>
            Depuis ma position
          </ion-button>
          
          <ion-button 
            fill="outline" 
            color="primary" 
            size="small"
            (click)="calculateFromCampus()">
            <ion-icon name="business-outline" slot="start"></ion-icon>
            Depuis le campus
          </ion-button>
        </div>
      </div>
    </ion-content>

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

    #map {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
    }

    .carte {
      display: block;
      width: 100%;
      height: 100vh;
      background-color: #f5f5f5;
      position: relative;
    }

    .cross {
      margin-top: 2em;
      margin-left: 1em;
      width: 2.5em;
      height: 2.5em;
      background-color: rgba(0, 0, 0, 0.7);
      border-radius: 50%;
      position: absolute;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }

    .cross:hover {
      background-color: rgba(0, 0, 0, 0.9);
      transform: scale(1.1);
    }

    .cross ion-icon {
      font-size: 1.2em;
    }

    .searchbar {
      z-index: 100;
      width: 100%;
      padding: 4em 1em 0 1em;
      position: absolute;
      top: 0;
    }

    .searchbar ion-searchbar {
      --background: white;
      --color: var(--text-primary);
      --placeholder-color: var(--text-muted);
      --border-radius: 12px;
      --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      --icon-color: var(--primary-color);
    }

    .search-results-container {
      z-index: 1000;
      background-color: white;
      color: var(--text-secondary);
      width: 94%;
      display: block;
      margin: auto;
      position: absolute;
      left: 3%;
      top: 8.5em;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      max-height: 300px;
      overflow-y: auto;
    }

    .search-result {
      width: 100%;
      padding: 1em;
      background-color: white;
      border-bottom: 1px solid var(--border-color);
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .search-result:last-child {
      border-bottom: none;
    }

    .search-result:hover {
      background-color: var(--primary-color);
      color: white;
    }

    .search-result:hover .categorie {
      color: rgba(255, 255, 255, 0.8);
    }

    .categorie {
      font-weight: 600;
      text-transform: uppercase;
      color: var(--primary-color);
      font-size: 0.8em;
      letter-spacing: 0.5px;
    }

    .type-container {
      z-index: 100;
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      gap: 8px;
      position: absolute;
      bottom: 120px;
      padding: 0 1em;
    }
    
    .type {
      background-color: white;
      border-radius: 25px;
      color: var(--text-secondary);
      padding: 8px 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      backdrop-filter: blur(10px);
      min-width: 60px;
      justify-content: center;
    }

    .type span {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .type ion-icon {
      font-size: 1.2em;
      color: var(--primary-color);
    }

    .action-buttons {
      position: absolute;
      bottom: 140px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 12px;
      z-index: 1000;
    }

    .action-buttons ion-button {
      --border-radius: 20px;
      --padding-start: 16px;
      --padding-end: 16px;
      --padding-top: 8px;
      --padding-bottom: 8px;
      font-size: 12px;
      font-weight: 500;
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
      .searchbar {
        padding: 3em 0.5em 0 0.5em;
      }

      .type-container {
        bottom: 100px;
        gap: 6px;
      }

      .type {
        padding: 6px 12px;
        min-width: 50px;
      }

      .type span {
        font-size: 12px;
      }

      .action-buttons {
        bottom: 120px;
        flex-direction: column;
        gap: 8px;
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
    IonTabButton,
    IonBadge
  ]
})
export class MapPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef;

  private map!: L.Map;
  private userLocation: [number, number] = [3.8667, 11.5167]; // Yaoundé par défaut
  private campusLocation: [number, number] = [3.8620, 11.5120]; // Institut Saint Jean Eyang
  private routeLayer?: L.Polyline;
  private markers: L.Marker[] = [];

  searchText = '';
  showDurations = false;
  selectedLocation?: MapLocation;

  // Durées de transport
  walkingDuration: DurationInfo = { value: '--', calculated: false };
  drivingDuration: DurationInfo = { value: '--', calculated: false };
  ridingDuration: DurationInfo = { value: '--', calculated: false };
  trainDuration: DurationInfo = { value: '--', calculated: false };

  // Vitesses moyennes (en m/s)
  averageWalkingSpeed = 3.33; // 12 km/h
  averageDrivingSpeed = 13.89; // 50 km/h
  averageRidingSpeed = 8.33; // 30 km/h
  averageTrainSpeed = 22.22; // 80 km/h

  // Données des cités
  pointsInteret: MapLocation[] = [
    {
      id: 1,
      nom: 'Cité Bevina',
      categorie: { nom: 'Résidence étudiante' },
      adresses: [{ latitude: 3.8700, longitude: 11.5200 }],
      type: 'cite',
      rooms: 28,
      available: 2,
      rating: 4.5,
      price: 55000
    },
    {
      id: 2,
      nom: 'Cité Colonel',
      categorie: { nom: 'Résidence étudiante' },
      adresses: [{ latitude: 3.8650, longitude: 11.5150 }],
      type: 'cite',
      rooms: 28,
      available: 5,
      rating: 4.2,
      price: 50000
    },
    {
      id: 3,
      nom: 'Cité RPN',
      categorie: { nom: 'Résidence étudiante' },
      adresses: [{ latitude: 3.8720, longitude: 11.5180 }],
      type: 'cite',
      rooms: 28,
      available: 3,
      rating: 4.0,
      price: 45000
    },
    {
      id: 4,
      nom: 'City of Peace',
      categorie: { nom: 'Résidence premium' },
      adresses: [{ latitude: 3.8680, longitude: 11.5160 }],
      type: 'cite',
      rooms: 35,
      available: 1,
      rating: 4.8,
      price: 60000
    },
    {
      id: 5,
      nom: 'Institut Saint Jean (Site d\'Eyang)',
      categorie: { nom: 'Campus universitaire' },
      adresses: [{ latitude: 3.8620, longitude: 11.5120 }],
      type: 'campus'
    }
  ];

  pointsInteretFiltered: MapLocation[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController
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
      bicycleOutline,
      chevronForwardOutline,
      starOutline,
      star,
      trainOutline,
      mapOutline
    });
  }

  ngOnInit() {
    // Vérifier si on arrive avec des données de navigation
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      console.log('Navigation state:', navigation.extras.state);
      this.calculateItinerary(navigation.extras.state);
    }

    this.getCurrentLocation();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeMap();
    }, 100);
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
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
      await this.showErrorToast('geolocalisation', 'Géolocalisation impossible');
    }
  }

  private initializeMap() {
    // Configuration des icônes Leaflet
    const iconDefault = L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
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
    this.pointsInteret.forEach(location => {
      if (location.adresses && location.adresses.length > 0) {
        const marker = this.createMarker(location);
        this.markers.push(marker);
      }
    });
  }

  private createMarker(location: MapLocation): L.Marker {
    const coords = location.adresses[0];
    const marker = L.marker([coords.latitude, coords.longitude]).addTo(this.map);

    // Popup pour les cités
    if (location.type === 'cite') {
      const popupContent = `
        <div style="text-align: center; min-width: 200px;">
          <h4 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600;">${location.nom}</h4>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
            <span>⭐ ${location.rating}/5</span>
            <span>(${location.rooms} chambres)</span>
          </div>
          ${location.available ? `<p style="margin: 8px 0; font-size: 12px; color: #10b981; font-weight: 600;">🟢 ${location.available} Chambres libres</p>` : ''}
          <div style="display: flex; gap: 8px; margin-top: 12px;">
            <button onclick="window.selectCiteFromMap(${location.id})" style="flex: 1; padding: 8px 12px; border: none; border-radius: 6px; background: #1dd1a1; color: white; font-size: 12px; font-weight: 600; cursor: pointer;">
              Voir plus
            </button>
            <button onclick="window.navigateToCite(${location.id})" style="flex: 1; padding: 8px 12px; border: 1px solid #e5e7eb; border-radius: 6px; background: #f8f9fa; color: #374151; font-size: 12px; font-weight: 600; cursor: pointer;">
              Itinéraire
            </button>
          </div>
        </div>
      `;
      marker.bindPopup(popupContent);
    } else {
      marker.bindPopup(`<div style="text-align: center;"><h4>${location.nom}</h4></div>`);
    }

    return marker;
  }

  private updateUserLocationOnMap() {
    // Supprimer l'ancien marqueur utilisateur s'il existe
    const existingUserMarker = this.markers.find(m => (m as any).isUserMarker);
    if (existingUserMarker) {
      this.map.removeLayer(existingUserMarker);
      this.markers = this.markers.filter(m => m !== existingUserMarker);
    }

    // Ajouter le nouveau marqueur utilisateur
    const userMarker = L.marker(this.userLocation).addTo(this.map);
    (userMarker as any).isUserMarker = true;
    userMarker.bindPopup('<div style="text-align: center;"><h4>Ma position</h4></div>');
    this.markers.push(userMarker);

    // Centrer la carte sur la position de l'utilisateur
    this.map.setView(this.userLocation, 14);
  }

  search(event: any) {
    const searchValue = event.target.value?.toLowerCase() || '';
    this.searchText = searchValue;

    if (searchValue.trim()) {
      this.pointsInteretFiltered = this.pointsInteret
        .filter(location => 
          location.nom.toLowerCase().includes(searchValue) ||
          location.categorie.nom.toLowerCase().includes(searchValue)
        )
        .slice(0, 5);
    } else {
      this.pointsInteretFiltered = [];
    }
  }

  getCategoryName(pointInteret: MapLocation): string {
    const categories = pointInteret.categorie.nom.split(' ');
    
    if (!pointInteret.categorie.nom || pointInteret.categorie.nom === '') {
      return '(inconnu)';
    } else {
      return categories.length === 1 ? pointInteret.categorie.nom : '(plusieurs)';
    }
  }

  async calculateItinerary(pointInteret: MapLocation) {
    this.searchText = pointInteret.nom;
    this.pointsInteretFiltered = [];
    this.selectedLocation = pointInteret;

    if (pointInteret.adresses && pointInteret.adresses.length > 0) {
      this.resetDurations();
      
      try {
        await this.generateMap(
          pointInteret.adresses[0].latitude, 
          pointInteret.adresses[0].longitude, 
          pointInteret.nom
        );
        
        const distance = await this.measureDistance(
          pointInteret.adresses[0].latitude, 
          pointInteret.adresses[0].longitude
        );

        this.calculateDuration(this.walkingDuration, this.averageWalkingSpeed, distance);
        this.calculateDuration(this.ridingDuration, this.averageRidingSpeed, distance);
        this.calculateDuration(this.drivingDuration, this.averageDrivingSpeed, distance);
        this.calculateDuration(this.trainDuration, this.averageTrainSpeed, distance);
        
        this.showDurations = true;
      } catch (error) {
        await this.showErrorToast('itineraire', 'Erreur lors du calcul de l\'itinéraire');
      }
    } else {
      await this.showErrorToast('itineraire', 'Aucune adresse disponible pour cette cité');
    }
  }

  async calculateFromCurrentPosition() {
    if (this.selectedLocation) {
      await this.calculateItinerary(this.selectedLocation);
    }
  }

  async calculateFromCampus() {
    if (this.selectedLocation && this.selectedLocation.adresses.length > 0) {
      this.resetDurations();
      
      try {
        await this.generateMapFromCampus(
          this.selectedLocation.adresses[0].latitude,
          this.selectedLocation.adresses[0].longitude,
          this.selectedLocation.nom
        );
        
        const distance = await this.measureDistanceFromCampus(
          this.selectedLocation.adresses[0].latitude,
          this.selectedLocation.adresses[0].longitude
        );

        this.calculateDuration(this.walkingDuration, this.averageWalkingSpeed, distance);
        this.calculateDuration(this.ridingDuration, this.averageRidingSpeed, distance);
        this.calculateDuration(this.drivingDuration, this.averageDrivingSpeed, distance);
        this.calculateDuration(this.trainDuration, this.averageTrainSpeed, distance);
        
        this.showDurations = true;
      } catch (error) {
        await this.showErrorToast('itineraire', 'Erreur lors du calcul depuis le campus');
      }
    }
  }

  private resetDurations() {
    this.walkingDuration = { value: '--', calculated: false };
    this.ridingDuration = { value: '--', calculated: false };
    this.drivingDuration = { value: '--', calculated: false };
    this.trainDuration = { value: '--', calculated: false };
    this.showDurations = false;
  }

  private calculateDuration(duration: DurationInfo, averageSpeed: number, distance: number) {
    const _duration = distance / averageSpeed;
    
    if (_duration < 60) {
      duration.value = Math.round(_duration) + 's';
    } else if (_duration < 3600) {
      duration.value = Math.round(_duration / 60) + 'm';
    } else if (_duration < 86400) {
      duration.value = Math.round(_duration / 3600) + 'h';
    } else if (_duration < 2629746) {
      duration.value = Math.round(_duration / 86400) + 'd';
    } else if (_duration < 31536000) {
      duration.value = Math.round(_duration / 2629746) + 'M';
    } else {
      duration.value = Math.round(_duration / 31536000) + 'y';
    }
    
    duration.calculated = true;
  }

  private async measureDistance(lat2: number, lng2: number): Promise<number> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat1 = position.coords.latitude;
          const lng1 = position.coords.longitude;
          
          const routeUrl = `https://router.project-osrm.org/route/v1/driving/${lng1},${lat1};${lng2},${lat2}?steps=true&geometries=geojson`;
          
          fetch(routeUrl)
            .then(response => response.json())
            .then(data => {
              if (data.routes && data.routes.length > 0) {
                resolve(data.routes[0].distance);
              } else {
                reject('Aucun itinéraire trouvé');
              }
            })
            .catch(error => reject(error));
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }

  private async measureDistanceFromCampus(lat2: number, lng2: number): Promise<number> {
    return new Promise((resolve, reject) => {
      const routeUrl = `https://router.project-osrm.org/route/v1/driving/${this.campusLocation[1]},${this.campusLocation[0]};${lng2},${lat2}?steps=true&geometries=geojson`;
      
      fetch(routeUrl)
        .then(response => response.json())
        .then(data => {
          if (data.routes && data.routes.length > 0) {
            resolve(data.routes[0].distance);
          } else {
            reject('Aucun itinéraire trouvé');
          }
        })
        .catch(error => reject(error));
    });
  }

  private async generateMap(destinationLat: number, destinationLon: number, destinationName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.map) {
        this.map.remove();
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          this.map = L.map(this.mapContainer.nativeElement, {
            zoomControl: false
          }).setView([lat, lon], 13);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(this.map);

          // Ajouter contrôle de zoom
          L.control.zoom({ position: 'bottomright' }).addTo(this.map);

          // Marqueur position actuelle
          L.marker([lat, lon]).addTo(this.map)
            .bindPopup('<b>Ma Position</b>')
            .openPopup();

          // Calculer et afficher l'itinéraire
          const routeUrl = `https://router.project-osrm.org/route/v1/driving/${lon},${lat};${destinationLon},${destinationLat}?steps=true&geometries=geojson`;

          fetch(routeUrl)
            .then(response => response.json())
            .then(data => {
              if (data.routes && data.routes.length > 0) {
                const route = data.routes[0].geometry.coordinates.map((coord: any) => {
                  return [coord[1], coord[0]];
                });

                // Supprimer l'ancienne route si elle existe
                if (this.routeLayer) {
                  this.map.removeLayer(this.routeLayer);
                }

                // Ajouter la nouvelle route
                this.routeLayer = L.polyline(route, { color: 'red', weight: 4 }).addTo(this.map);

                // Marqueur destination
                L.marker([destinationLat, destinationLon]).addTo(this.map)
                  .bindPopup(destinationName);

                // Ajuster le zoom
                this.map.fitBounds(L.latLngBounds(route));

                resolve();
              } else {
                reject('Aucun itinéraire trouvé');
              }
            })
            .catch(error => reject(error));
        },
        (error) => {
          // Fallback sans géolocalisation
          this.map = L.map(this.mapContainer.nativeElement).setView([destinationLat, destinationLon], 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
          L.control.zoom({ position: 'bottomright' }).addTo(this.map);
          reject(error);
        }
      );
    });
  }

  private async generateMapFromCampus(destinationLat: number, destinationLon: number, destinationName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.map) {
        this.map.remove();
      }

      this.map = L.map(this.mapContainer.nativeElement, {
        zoomControl: false
      }).setView(this.campusLocation, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);

      // Ajouter contrôle de zoom
      L.control.zoom({ position: 'bottomright' }).addTo(this.map);

      // Marqueur campus
      L.marker(this.campusLocation).addTo(this.map)
        .bindPopup('<b>Institut Saint Jean (Eyang)</b>')
        .openPopup();

      // Calculer et afficher l'itinéraire
      const routeUrl = `https://router.project-osrm.org/route/v1/driving/${this.campusLocation[1]},${this.campusLocation[0]};${destinationLon},${destinationLat}?steps=true&geometries=geojson`;

      fetch(routeUrl)
        .then(response => response.json())
        .then(data => {
          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0].geometry.coordinates.map((coord: any) => {
              return [coord[1], coord[0]];
            });

            // Supprimer l'ancienne route si elle existe
            if (this.routeLayer) {
              this.map.removeLayer(this.routeLayer);
            }

            // Ajouter la nouvelle route
            this.routeLayer = L.polyline(route, { color: 'red', weight: 4 }).addTo(this.map);

            // Marqueur destination
            L.marker([destinationLat, destinationLon]).addTo(this.map)
              .bindPopup(destinationName);

            // Ajuster le zoom
            this.map.fitBounds(L.latLngBounds(route));

            resolve();
          } else {
            reject('Aucun itinéraire trouvé');
          }
        })
        .catch(error => reject(error));
    });
  }

  private async showErrorToast(type: string, message?: string) {
    let toastMessage = message || 'Une erreur est survenue';
    let icon = 'alert-circle-outline';

    switch (type) {
      case 'itineraire':
        toastMessage = message || 'Aucun itinéraire trouvé';
        icon = 'walk-outline';
        break;
      case 'geolocalisation':
        toastMessage = message || 'Géolocalisation impossible';
        icon = 'location-outline';
        break;
    }

    const toast = await this.toastController.create({
      message: toastMessage,
      duration: 5000,
      position: 'top',
      color: 'danger',
      icon: icon
    });

    await toast.present();
  }

  trackByLocation(index: number, location: MapLocation): number {
    return location.id;
  }

  goBack() {
    this.router.navigate(['/cities']);
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}