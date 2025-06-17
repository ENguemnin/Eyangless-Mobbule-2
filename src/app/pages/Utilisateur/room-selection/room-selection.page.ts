import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  LoadingController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  chevronForwardOutline,
  chevronBack,
  chevronForward
} from 'ionicons/icons';

interface Room {
  id: string;
  status: 'libre' | 'prise' | 'reservee' | 'selected';
  floor: string;
}

interface Floor {
  name: string;
  code: string;
  rooms: Room[];
}

@Component({
  selector: 'app-room-selection',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/city-details" color="primary"></ion-back-button>
        </ion-buttons>
        <ion-title>Choisir votre chambre</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="room-selection-content">
      <!-- Section Plan de la cité -->
      <div class="plan-section">
        <h2>Plan de la cité</h2>
        
        <!-- Légende -->
        <div class="legend">
          <div class="legend-item">
            <div class="legend-dot taken"></div>
            <span>Chambre prise</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot reserved"></div>
            <span>Chambre réservée (prise mais impayée)</span>
          </div>
          <div class="legend-item">
            <div class="legend-dot selected"></div>
            <span>Votre choix</span>
          </div>
        </div>

        <p class="instruction">Cliquer sur une chambre en gris pour faire votre choix</p>

        <!-- Navigation des étages -->
        <div class="floor-navigation">
          <ion-button 
            fill="clear" 
            size="small" 
            (click)="previousFloor()"
            [disabled]="currentFloorIndex === 0"
          >
            <ion-icon name="chevron-back" slot="icon-only"></ion-icon>
          </ion-button>
          
          <span class="floor-indicator">{{ floors[currentFloorIndex]?.name }}</span>
          
          <ion-button 
            fill="clear" 
            size="small" 
            (click)="nextFloor()"
            [disabled]="currentFloorIndex === floors.length - 1"
          >
            <ion-icon name="chevron-forward" slot="icon-only"></ion-icon>
          </ion-button>
        </div>

        <!-- Plan des chambres -->
        <div class="room-plan">
          <div class="room-grid">
            <!-- Côté gauche -->
            <div class="room-side left-side">
              <div 
                *ngFor="let room of getLeftRooms()" 
                class="room-cell"
                [class.taken]="room.status === 'prise'"
                [class.reserved]="room.status === 'reservee'"
                [class.selected]="room.status === 'selected'"
                [class.libre]="room.status === 'libre'"
                (click)="selectRoom(room)"
              >
                {{ room.id }}
              </div>
            </div>

            <!-- Couloir central -->
            <div class="corridor">
              <span class="corridor-label">Couloir</span>
            </div>

            <!-- Côté droit -->
            <div class="room-side right-side">
              <div class="entrance-label">Entrée</div>
              <div 
                *ngFor="let room of getRightRooms()" 
                class="room-cell"
                [class.taken]="room.status === 'prise'"
                [class.reserved]="room.status === 'reservee'"
                [class.selected]="room.status === 'selected'"
                [class.libre]="room.status === 'libre'"
                (click)="selectRoom(room)"
              >
                {{ room.id }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bouton Suivant -->
      <div class="action-section">
        <ion-button 
          expand="block" 
          color="primary" 
          class="next-button"
          [disabled]="!selectedRoom"
          (click)="proceedToPayment()"
        >
          Suivant
        </ion-button>
      </div>
    </ion-content>
  `,
  styles: [`
    :host {
      --primary-color: #1dd1a1;
      --text-primary: #374151;
      --text-secondary: #6b7280;
      --background: #ffffff;
      --border-color: #e5e7eb;
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

    /* Content */
    .room-selection-content {
      --background: #f8f9fa;
      --padding-bottom: 100px;
    }

    .plan-section {
      background: white;
      margin: 16px;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .plan-section h2 {
      margin: 0 0 20px 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
    }

    /* Légende */
    .legend {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 16px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .legend-dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .legend-dot.taken {
      background: #ef4444;
    }

    .legend-dot.reserved {
      background: #f59e0b;
    }

    .legend-dot.selected {
      background: #10b981;
    }

    .legend-item span {
      font-size: 14px;
      color: var(--text-secondary);
    }

    .instruction {
      font-size: 14px;
      color: var(--text-secondary);
      margin: 16px 0;
      text-align: center;
    }

    /* Navigation des étages */
    .floor-navigation {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
      margin: 20px 0;
    }

    .floor-indicator {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
      min-width: 60px;
      text-align: center;
    }

    /* Plan des chambres */
    .room-plan {
      margin: 24px 0;
    }

    .room-grid {
      display: flex;
      gap: 20px;
      align-items: flex-start;
    }

    .room-side {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .corridor {
      width: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 200px;
      background: #f3f4f6;
      border-radius: 8px;
      position: relative;
    }

    .corridor-label {
      writing-mode: vertical-rl;
      text-orientation: mixed;
      font-size: 12px;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .entrance-label {
      font-size: 12px;
      color: var(--text-secondary);
      text-align: center;
      margin-bottom: 8px;
      font-weight: 500;
    }

    /* Cellules de chambre */
    .room-cell {
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    .room-cell.libre {
      background: #f9fafb;
      color: var(--text-primary);
      border-color: var(--border-color);
    }

    .room-cell.libre:hover {
      background: #e5e7eb;
      transform: scale(1.05);
    }

    .room-cell.taken {
      background: #ef4444;
      color: white;
      cursor: not-allowed;
    }

    .room-cell.reserved {
      background: #f59e0b;
      color: white;
      cursor: not-allowed;
    }

    .room-cell.selected {
      background: #10b981;
      color: white;
      border-color: #059669;
      transform: scale(1.05);
    }

    /* Section d'action */
    .action-section {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: white;
      padding: 16px;
      border-top: 1px solid var(--border-color);
      z-index: 1000;
    }

    .next-button {
      --border-radius: 12px;
      --padding-top: 16px;
      --padding-bottom: 16px;
      height: 56px;
      font-weight: 600;
    }

    .next-button:disabled {
      --background: #d1d5db;
      --color: #9ca3af;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .plan-section {
        margin: 12px;
        padding: 16px;
      }

      .room-grid {
        gap: 12px;
      }

      .corridor {
        width: 40px;
        min-height: 150px;
      }

      .room-cell {
        height: 36px;
        font-size: 12px;
      }

      .action-section {
        padding: 12px;
      }
    }
  `],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon
  ]
})
export class RoomSelectionPage implements OnInit {
  cityId?: number;
  selectedRoom?: Room;
  currentFloorIndex = 0;

  floors: Floor[] = [
    {
      name: 'RDC',
      code: 'rdc',
      rooms: [
        // Côté gauche
        { id: 'A1', status: 'prise', floor: 'rdc' },
        { id: 'A2', status: 'prise', floor: 'rdc' },
        { id: 'A3', status: 'prise', floor: 'rdc' },
        { id: 'A4', status: 'prise', floor: 'rdc' },
        { id: 'A5', status: 'libre', floor: 'rdc' },
        { id: 'A6', status: 'libre', floor: 'rdc' },
        { id: 'A7', status: 'libre', floor: 'rdc' },
        // Côté droit
        { id: 'A8', status: 'libre', floor: 'rdc' },
        { id: 'A9', status: 'prise', floor: 'rdc' },
        { id: 'A10', status: 'prise', floor: 'rdc' },
        { id: 'A11', status: 'libre', floor: 'rdc' },
        { id: 'A12', status: 'reservee', floor: 'rdc' },
        { id: 'A13', status: 'libre', floor: 'rdc' },
        { id: 'A14', status: 'libre', floor: 'rdc' }
      ]
    },
    {
      name: '1er étage',
      code: '1er',
      rooms: [
        // Côté gauche
        { id: 'B1', status: 'libre', floor: '1er' },
        { id: 'B2', status: 'prise', floor: '1er' },
        { id: 'B3', status: 'libre', floor: '1er' },
        { id: 'B4', status: 'libre', floor: '1er' },
        { id: 'B5', status: 'prise', floor: '1er' },
        { id: 'B6', status: 'libre', floor: '1er' },
        { id: 'B7', status: 'libre', floor: '1er' },
        // Côté droit
        { id: 'B8', status: 'libre', floor: '1er' },
        { id: 'B9', status: 'libre', floor: '1er' },
        { id: 'B10', status: 'prise', floor: '1er' },
        { id: 'B11', status: 'libre', floor: '1er' },
        { id: 'B12', status: 'libre', floor: '1er' },
        { id: 'B13', status: 'reservee', floor: '1er' },
        { id: 'B14', status: 'libre', floor: '1er' }
      ]
    }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    addIcons({
      chevronBackOutline,
      chevronForwardOutline,
      chevronBack,
      chevronForward
    });
  }

  ngOnInit() {
    this.cityId = Number(this.route.snapshot.paramMap.get('id'));
  }

  get currentFloor(): Floor {
    return this.floors[this.currentFloorIndex];
  }

  getLeftRooms(): Room[] {
    return this.currentFloor.rooms.slice(0, 7);
  }

  getRightRooms(): Room[] {
    return this.currentFloor.rooms.slice(7);
  }

  previousFloor() {
    if (this.currentFloorIndex > 0) {
      this.currentFloorIndex--;
      this.clearSelection();
    }
  }

  nextFloor() {
    if (this.currentFloorIndex < this.floors.length - 1) {
      this.currentFloorIndex++;
      this.clearSelection();
    }
  }

  selectRoom(room: Room) {
    if (room.status === 'prise' || room.status === 'reservee') {
      return;
    }

    // Désélectionner la chambre précédente
    this.clearSelection();

    // Sélectionner la nouvelle chambre
    room.status = 'selected';
    this.selectedRoom = room;
  }

  private clearSelection() {
    // Remettre toutes les chambres sélectionnées à libre
    this.floors.forEach(floor => {
      floor.rooms.forEach(room => {
        if (room.status === 'selected') {
          room.status = 'libre';
        }
      });
    });
    this.selectedRoom = undefined;
  }

  async proceedToPayment() {
    if (!this.selectedRoom) {
      await this.showToast('Veuillez sélectionner une chambre');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Préparation...',
      duration: 1000
    });
    await loading.present();

    // Sauvegarder la sélection
    const reservationData = {
      cityId: this.cityId,
      roomId: this.selectedRoom.id,
      floor: this.selectedRoom.floor,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('pendingReservation', JSON.stringify(reservationData));

    setTimeout(() => {
      loading.dismiss();
      this.router.navigate(['/reservation-payment'], {
        queryParams: {
          cityId: this.cityId,
          roomId: this.selectedRoom?.id,
          floor: this.selectedRoom?.floor
        }
      });
    }, 1000);
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'warning'
    });
    await toast.present();
  }
}