import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon,
  IonButton,
  IonBadge,
  IonList,
  IonItem,
  IonImg,
  IonChip,
  IonCard,
  IonCardContent,
  IonNote,
  IonFooter,
  IonAccordionGroup,
  IonAccordion,
  IonAvatar,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  starOutline,
  star,
  locationOutline,
  callOutline,
  mailOutline,
  chatbubbleOutline,
  bedOutline,
  tvOutline,
  wifiOutline,
  restaurantOutline,
  gameControllerOutline,
  businessOutline,
  chevronDownOutline,
  chevronUpOutline,
  heartOutline,
  checkmarkCircle,
  personOutline,
  phonePortraitOutline,
  chatbubblesOutline,
} from 'ionicons/icons';
import { FormsModule } from '@angular/forms';

interface CityDetail {
  id: number;
  name: string;
  image: string;
  rating: number;
  verified: boolean;
  description: string;
  availableRooms: number;
  price: {
    amount: number;
    period: string;
    yearlyAmount: number;
  };
  caution: number;
  bankDetails: {
    accountNumber: string;
    bank: string;
  };
  characteristics: {
    rooms: number;
    roomSize: string;
    furnished: boolean;
    floors: number;
    water: string;
    electricity: string;
    group: boolean;
    parking: boolean;
    security: boolean;
    guardian: boolean;
  };
  amenities: string[];
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  comments: Array<{
    author: string;
    text: string;
    anonymous?: boolean;
  }>;
  roomDetails: {
    rooms: number;
    size: string;
    furnished: boolean;
    bathroom: string;
    furniture: string[];
  };
}

@Component({
  selector: 'app-city-details',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home" color="primary"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ city?.name }}</ion-title>
        <ion-buttons slot="end">
          <ion-button fill="clear" color="primary">
            <ion-icon slot="icon-only" name="heart-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" (ionRefresh)="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- Image principale -->
      <div class="hero-image">
        <ion-img [src]="city?.image" alt="City view"></ion-img>
      </div>

      <!-- Segments de navigation -->
      <ion-segment [(ngModel)]="selectedSegment" class="navigation-segment">
        <ion-segment-button value="description">
          <ion-label>Description</ion-label>
        </ion-segment-button>
        <ion-segment-button value="rooms">
          <ion-label>Chambres</ion-label>
        </ion-segment-button>
        <ion-segment-button value="gallery">
          <ion-label>Galerie</ion-label>
        </ion-segment-button>
      </ion-segment>

      <!-- Contenu Description -->
      <div *ngIf="selectedSegment === 'description'" class="segment-content">
        <!-- Header avec titre et rating -->
        <div class="city-header">
          <div class="title-section">
            <h1>{{ city?.name }}</h1>
            <div class="badges">
              <ion-badge *ngIf="city?.verified" color="success" class="verified-badge">
                <ion-icon name="checkmark-circle" slot="start"></ion-icon>
                Vérifié
              </ion-badge>
            </div>
          </div>
          <div class="rating-section">
            <div class="stars">
              <ion-icon
                *ngFor="let i of [1, 2, 3, 4, 5]"
                [name]="getStarIcon(i)"
                [class.filled]="city && city.rating >= i"
              ></ion-icon>
            </div>
            <span class="rating-number">{{ city?.rating }}</span>
          </div>
        </div>

        <!-- Description -->
        <div class="description-section">
          <p>{{ city?.description }}</p>
        </div>

        <!-- Disponibilité et réservation -->
        <div class="availability-alert">
          <div class="alert-content">
            <h3>{{ city?.availableRooms }} chambres disponibles</h3>
            <p>Réservez au plus tôt votre chambre préférée</p>
          </div>
          <ion-button color="primary" (click)="reserve()">Réserver</ion-button>
        </div>

        <!-- Accordéons -->
        <ion-accordion-group>
          <!-- Caractéristiques -->
          <ion-accordion value="characteristics">
            <ion-item slot="header" color="light">
              <ion-label>Caractéristiques</ion-label>
            </ion-item>
            <div class="ion-padding" slot="content">
              <div class="pricing-section">
                <div class="price-item">
                  <span class="label">Prix de la chambre</span>
                  <div class="price-value">
                    <span class="main-price">{{ city?.price?.amount | number }} FCFA</span>
                    <span class="sub-price">{{ city?.price?.yearlyAmount | number }} FCFA/12 mois</span>
                  </div>
                </div>
                <div class="price-item">
                  <span class="label">Caution</span>
                  <div class="price-value">
                    <span class="caution-price">{{ city?.caution | number }} FCFA</span>
                    <span class="sub-price">/2 mois</span>
                  </div>
                </div>
                <div class="price-item">
                  <span class="label">Numéro de compte</span>
                  <span class="account-number">{{ city?.bankDetails?.accountNumber }}</span>
                </div>
                <div class="price-item">
                  <span class="label">Banque</span>
                  <span class="bank-name">{{ city?.bankDetails?.bank }}</span>
                </div>
              </div>

              <div class="characteristics-table">
                <h4>Autres Caractéristiques</h4>
                <div class="table-row" *ngFor="let item of characteristicsList">
                  <span class="table-label">{{ item.label }}</span>
                  <span class="table-value">{{ item.value }}</span>
                </div>
              </div>
            </div>
          </ion-accordion>

          <!-- Suppléments -->
          <ion-accordion value="amenities">
            <ion-item slot="header" color="light">
              <ion-label>Suppléments</ion-label>
            </ion-item>
            <div class="ion-padding" slot="content">
              <div class="amenities-grid">
                <ion-chip
                  *ngFor="let amenity of city?.amenities; let i = index"
                  [color]="getAmenityColor(i)"
                  class="amenity-chip"
                >
                  {{ amenity }}
                </ion-chip>
              </div>
            </div>
          </ion-accordion>

          <!-- Contacts -->
          <ion-accordion value="contacts">
            <ion-item slot="header" color="light">
              <ion-label>Contacts</ion-label>
            </ion-item>
            <div class="ion-padding" slot="content">
              <div class="contact-info">
                <div class="contact-item">
                  <ion-icon name="person-outline" color="primary"></ion-icon>
                  <span>{{ city?.contact?.name }}</span>
                </div>
                <div class="contact-actions">
                  <ion-button fill="outline" color="primary" size="small">
                    <ion-icon name="call-outline" slot="start"></ion-icon>
                    {{ city?.contact?.phone }}
                  </ion-button>
                  <ion-button fill="outline" color="primary" size="small">
                    <ion-icon name="chatbubbles-outline" slot="start"></ion-icon>
                    Message
                  </ion-button>
                </div>
              </div>
            </div>
          </ion-accordion>

          <!-- Carte -->
          <ion-accordion value="map">
            <ion-item slot="header" color="light">
              <ion-label>Carte</ion-label>
            </ion-item>
            <div class="ion-padding" slot="content">
              <div class="map-container">
                <div class="map-placeholder">
                  <ion-icon name="location-outline" color="primary"></ion-icon>
                  <p>{{ city?.location?.address }}</p>
                </div>
              </div>
            </div>
          </ion-accordion>

          <!-- Commentaires -->
          <ion-accordion value="comments">
            <ion-item slot="header" color="light">
              <ion-label>Commentaires {{ city?.comments?.length | number:'2.0' }}</ion-label>
            </ion-item>
            <div class="ion-padding" slot="content">
              <div class="comments-section">
                <div class="comment-item" *ngFor="let comment of city?.comments">
                  <div class="comment-header">
                    <ion-avatar class="comment-avatar">
                      <div class="avatar-placeholder">{{ getInitials(comment.author) }}</div>
                    </ion-avatar>
                    <span class="comment-author">{{ comment.anonymous ? 'Anonyme' : comment.author }}</span>
                  </div>
                  <p class="comment-text">{{ comment.text }}</p>
                  <button class="more-button">Plus</button>
                </div>
                <ion-button expand="block" fill="outline" color="primary" class="add-comment-btn">
                  Laisser un commentaire
                </ion-button>
              </div>
            </div>
          </ion-accordion>
        </ion-accordion-group>
      </div>

      <!-- Contenu Chambres -->
      <div *ngIf="selectedSegment === 'rooms'" class="segment-content">
        <div class="room-details">
          <h3>Détails de la chambre</h3>
          <div class="characteristics-table">
            <div class="table-row">
              <span class="table-label">Pièces</span>
              <span class="table-value">{{ city?.roomDetails?.rooms }}</span>
            </div>
            <div class="table-row">
              <span class="table-label">Dimension</span>
              <span class="table-value">{{ city?.roomDetails?.size }}</span>
            </div>
            <div class="table-row">
              <span class="table-label">Meublée</span>
              <span class="table-value">{{ city?.roomDetails?.furnished ? 'Oui' : 'Non' }}</span>
            </div>
            <div class="table-row">
              <span class="table-label">Toilettes</span>
              <span class="table-value">{{ city?.roomDetails?.bathroom }}</span>
            </div>
          </div>

          <div class="furniture-section">
            <h4>Meubles</h4>
            <div class="amenities-grid">
              <ion-chip *ngFor="let item of city?.roomDetails?.furniture" color="medium">
                {{ item }}
              </ion-chip>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenu Galerie -->
      <div *ngIf="selectedSegment === 'gallery'" class="segment-content">
        <div class="gallery-grid">
          <div class="gallery-item" *ngFor="let i of [1,2,3,4,5,6]">
            <ion-img [src]="city?.image" alt="Gallery image"></ion-img>
          </div>
        </div>
      </div>
    </ion-content>

    <!-- Footer fixe -->
    <ion-footer class="ion-no-border">
      <ion-toolbar>
        <div class="footer-content">
          <div class="price-summary">
            <div class="main-price">{{ city?.price?.amount | number }} FCFA/mois</div>
            <div class="sub-price">{{ city?.price?.yearlyAmount | number }} FCFA/12 mois</div>
          </div>
          <ion-button color="success" (click)="reserve()" class="reserve-btn">
            Réserver
          </ion-button>
        </div>
      </ion-toolbar>
    </ion-footer>
  `,
  styles: [
    `
      :host {
        --primary-color: #00BCD4;
        --success-color: #4CAF50;
        --warning-color: #FF9800;
      }

      ion-header ion-toolbar {
        --background: white;
        --color: var(--primary-color);
      }

      .hero-image {
        width: 100%;
        height: 200px;
        overflow: hidden;

        ion-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .navigation-segment {
        --background: white;
        margin: 0;
        padding: 8px 0;
        border-bottom: 1px solid #e0e0e0;

        ion-segment-button {
          --color: #666;
          --color-checked: var(--primary-color);
          --indicator-color: var(--primary-color);
          text-transform: none;
          font-weight: 500;
        }
      }

      .segment-content {
        padding: 16px;
      }

      .city-header {
        margin-bottom: 16px;

        .title-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;

          h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
            color: #333;
          }
        }

        .verified-badge {
          --background: var(--success-color);
          --color: white;
          font-size: 12px;

          ion-icon {
            font-size: 14px;
            margin-right: 4px;
          }
        }

        .rating-section {
          display: flex;
          align-items: center;
          gap: 8px;

          .stars {
            display: flex;
            gap: 2px;

            ion-icon {
              font-size: 18px;
              color: #ddd;

              &.filled {
                color: #FFD700;
              }
            }
          }

          .rating-number {
            font-weight: 600;
            color: #333;
          }
        }
      }

      .description-section {
        margin-bottom: 20px;

        p {
          color: #666;
          line-height: 1.5;
          margin: 0;
        }
      }

      .availability-alert {
        background: linear-gradient(135deg, #FFF3CD 0%, #FFE69C 100%);
        border: 1px solid #FFE69C;
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .alert-content {
          flex: 1;

          h3 {
            margin: 0 0 4px 0;
            font-size: 16px;
            font-weight: 600;
            color: #856404;
          }

          p {
            margin: 0;
            font-size: 14px;
            color: #856404;
          }
        }

        ion-button {
          margin-left: 16px;
          --border-radius: 8px;
        }
      }

      ion-accordion-group {
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .pricing-section {
        margin-bottom: 24px;

        .price-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;

          &:last-child {
            border-bottom: none;
          }

          .label {
            font-weight: 500;
            color: #666;
          }

          .price-value {
            text-align: right;

            .main-price {
              display: block;
              font-size: 18px;
              font-weight: 600;
              color: var(--success-color);
            }

            .caution-price {
              display: block;
              font-size: 18px;
              font-weight: 600;
              color: var(--primary-color);
            }

            .sub-price {
              display: block;
              font-size: 12px;
              color: #999;
            }
          }

          .account-number {
            font-family: monospace;
            color: var(--primary-color);
            font-weight: 600;
          }

          .bank-name {
            font-weight: 600;
            color: #333;
          }
        }
      }

      .characteristics-table {
        h4 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }

        .table-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px dotted #ddd;

          &:last-child {
            border-bottom: none;
          }

          .table-label {
            color: #666;
          }

          .table-value {
            font-weight: 500;
            color: #333;
          }
        }
      }

      .amenities-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;

        .amenity-chip {
          font-size: 12px;
          --border-radius: 16px;
        }
      }

      .contact-info {
        .contact-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;

          ion-icon {
            font-size: 20px;
          }

          span {
            font-weight: 500;
            color: #333;
          }
        }

        .contact-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;

          ion-button {
            --border-radius: 8px;
            flex: 1;
            min-width: 120px;
          }
        }
      }

      .map-container {
        height: 150px;
        background: #f5f5f5;
        border-radius: 8px;
        overflow: hidden;

        .map-placeholder {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #666;

          ion-icon {
            font-size: 32px;
            margin-bottom: 8px;
          }

          p {
            margin: 0;
            text-align: center;
          }
        }
      }

      .comments-section {
        .comment-item {
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f0f0f0;

          &:last-of-type {
            border-bottom: none;
          }

          .comment-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 8px;

            .comment-avatar {
              width: 32px;
              height: 32px;

              .avatar-placeholder {
                width: 100%;
                height: 100%;
                background: var(--primary-color);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: 600;
                border-radius: 50%;
              }
            }

            .comment-author {
              font-weight: 500;
              color: #333;
            }
          }

          .comment-text {
            margin: 0 0 8px 0;
            color: #666;
            line-height: 1.4;
          }

          .more-button {
            background: none;
            border: none;
            color: var(--primary-color);
            font-size: 14px;
            cursor: pointer;
            padding: 0;
          }
        }

        .add-comment-btn {
          margin-top: 16px;
          --border-radius: 8px;
        }
      }

      .room-details {
        .furniture-section {
          margin-top: 24px;

          h4 {
            margin: 0 0 16px 0;
            font-size: 16px;
            font-weight: 600;
            color: #333;
          }
        }
      }

      .gallery-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;

        .gallery-item {
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;

          ion-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }

      ion-footer {
        box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);

        .footer-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;

          .price-summary {
            .main-price {
              font-size: 18px;
              font-weight: 600;
              color: var(--success-color);
            }

            .sub-price {
              font-size: 12px;
              color: #999;
            }
          }

          .reserve-btn {
            --border-radius: 8px;
            width: 120px;
            margin: 0;
          }
        }
      }

      @media (max-width: 768px) {
        .contact-actions {
          flex-direction: column;

          ion-button {
            flex: none;
          }
        }

        .availability-alert {
          flex-direction: column;
          text-align: center;

          ion-button {
            margin: 12px 0 0 0;
            width: 100%;
          }
        }
      }
    `,
  ],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonIcon,
    IonButton,
    IonBadge,
    IonList,
    IonItem,
    IonImg,
    IonChip,
    IonCard,
    IonCardContent,
    IonNote,
    IonFooter,
    IonAccordionGroup,
    IonAccordion,
    IonAvatar,
    IonRefresher,
    IonRefresherContent,
  ],
})
export class CityDetailsPage implements OnInit {
  city?: CityDetail;
  selectedSegment = 'description';

  constructor(private route: ActivatedRoute) {
    addIcons({
      starOutline,
      star,
      locationOutline,
      callOutline,
      mailOutline,
      chatbubbleOutline,
      bedOutline,
      tvOutline,
      wifiOutline,
      restaurantOutline,
      gameControllerOutline,
      businessOutline,
      chevronDownOutline,
      chevronUpOutline,
      heartOutline,
      checkmarkCircle,
      personOutline,
      phonePortraitOutline,
      chatbubblesOutline,
    });
  }

  ngOnInit() {
    const cityId = this.route.snapshot.paramMap.get('id');
    console.log('City ID from route:', cityId);

    // Simuler les données de la cité
    this.city = {
      id: Number(cityId) || 1,
      name: 'Cité Bévina',
      image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg',
      rating: 4.5,
      verified: true,
      description: 'Petite description de la cité avec le mot du bailleur et je ne sais pas trop quoi dire d\'autre.',
      availableRooms: 4,
      price: {
        amount: 55000,
        period: 'mois',
        yearlyAmount: 660000,
      },
      caution: 110000,
      bankDetails: {
        accountNumber: '00 35 25 17 27 26 02 929',
        bank: 'UBA',
      },
      characteristics: {
        rooms: 28,
        roomSize: '5m²',
        furnished: true,
        floors: 2,
        water: 'Gratuite',
        electricity: 'Compteur pré-payé',
        group: true,
        parking: true,
        security: true,
        guardian: true,
      },
      amenities: ['Salle de jeu', 'Restaurant', 'Salle des fêtes', 'Boutique'],
      contact: {
        name: 'M. Anatole Guérin',
        email: 'anatole@gmail.com',
        phone: '+237 673 58 96 00',
      },
      location: {
        address: 'Yaoundé, Cameroun',
        coordinates: {
          lat: 3.8667,
          lng: 11.5167,
        },
      },
      comments: [
        {
          author: 'Roy',
          text: 'Je ne sais même pas ce que je peux dire sur cette cité pour que je ne tombe pas vraiment',
        },
        {
          author: 'Anonyme',
          text: 'Anonymement, je laisse une bonne note à cette cité pour son libertinage olalal.',
          anonymous: true,
        },
      ],
      roomDetails: {
        rooms: 2,
        size: '5m²',
        furnished: true,
        bathroom: 'Interne',
        furniture: ['Lit', 'Table de travail', 'Chaise', 'Frigo', 'Télévision'],
      },
    };
  }

  get characteristicsList() {
    return [
      { label: 'Chambres', value: this.city?.characteristics.rooms },
      { label: 'Taille par chambre', value: this.city?.characteristics.roomSize },
      { label: 'Meublée', value: this.city?.characteristics.furnished ? 'Oui' : 'Non' },
      { label: 'Étages', value: this.city?.characteristics.floors },
      { label: 'Eau', value: this.city?.characteristics.water },
      { label: 'Électricité', value: this.city?.characteristics.electricity },
      { label: 'Groupe', value: this.city?.characteristics.group ? 'Oui' : 'Non' },
      { label: 'Forage', value: this.city?.characteristics.parking ? 'Oui' : 'Non' },
      { label: 'Sécurité', value: this.city?.characteristics.security ? 'Oui' : 'Non' },
      { label: 'Gardien', value: this.city?.characteristics.guardian ? 'Oui' : 'Non' },
    ];
  }

  getStarIcon(i: number): string {
    if (!this.city) return 'star-outline';
    return this.city.rating >= i ? 'star' : 'star-outline';
  }

  getAmenityColor(index: number): string {
    const colors = ['medium', 'primary', 'secondary', 'success'];
    return colors[index % colors.length];
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  reserve() {
    console.log('Réservation en cours...');
    // Logique de réservation
  }
}
