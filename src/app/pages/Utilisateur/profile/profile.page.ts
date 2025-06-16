import { Component, OnInit } from '@angular/core';
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
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonFooter,
  IonTabBar,
  IonTabButton,
  IonModal,
  IonList,
  ActionSheetController,
  AlertController,
  ToastController,
  LoadingController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  menuOutline,
  personCircleOutline,
  cameraOutline,
  imagesOutline,
  createOutline,
  homeOutline,
  businessOutline,
  mapOutline,
  personOutline,
  checkmarkOutline,
  closeOutline
} from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

interface UserProfile {
  nom: string;
  prenom: string;
  email: string;
  type: string;
  motDePasse: string;
  telephone: string;
  photo?: string;
}

@Component({
  selector: 'app-profile',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary"></ion-menu-button>
        </ion-buttons>
        <ion-title>Mon compte</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="profile-content">
      <!-- Section photo de profil -->
      <div class="profile-photo-section">
        <div class="photo-container" (click)="changeProfilePhoto()">
          <div class="profile-photo">
            <img *ngIf="userProfile.photo" [src]="userProfile.photo" alt="Photo de profil" />
            <ion-icon *ngIf="!userProfile.photo" name="person-circle-outline" class="default-avatar"></ion-icon>
          </div>
          <div class="photo-edit-indicator">
            <div class="edit-badge">
              <ion-icon name="camera-outline"></ion-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- Section informations personnelles -->
      <div class="profile-info-section">
        <div class="section-header">
          <h2>Informations personnelles</h2>
        </div>

        <div class="info-form" *ngIf="!isEditing">
          <div class="info-item">
            <span class="info-label">Nom</span>
            <span class="info-value">{{ userProfile.nom }}</span>
          </div>

          <div class="info-item">
            <span class="info-label">Prénom</span>
            <span class="info-value">{{ userProfile.prenom }}</span>
          </div>

          <div class="info-item">
            <span class="info-label">Adresse email</span>
            <span class="info-value">{{ userProfile.email }}</span>
          </div>

          <div class="info-item">
            <span class="info-label">Type d'utilisateur</span>
            <span class="info-value">{{ userProfile.type }}</span>
          </div>

          <div class="info-item">
            <span class="info-label">Mot de passe</span>
            <span class="info-value password">••••••••••</span>
          </div>

          <div class="info-item">
            <span class="info-label">Numéro de téléphone</span>
            <span class="info-value">{{ userProfile.telephone }}</span>
          </div>
        </div>

        <!-- Formulaire d'édition -->
        <div class="edit-form" *ngIf="isEditing">
          <div class="form-group">
            <ion-label class="form-label">Nom</ion-label>
            <ion-item class="form-input">
              <ion-input
                [(ngModel)]="editProfile.nom"
                placeholder="Entrez votre nom"
                type="text">
              </ion-input>
            </ion-item>
          </div>

          <div class="form-group">
            <ion-label class="form-label">Prénom</ion-label>
            <ion-item class="form-input">
              <ion-input
                [(ngModel)]="editProfile.prenom"
                placeholder="Entrez votre prénom"
                type="text">
              </ion-input>
            </ion-item>
          </div>

          <div class="form-group">
            <ion-label class="form-label">Adresse email</ion-label>
            <ion-item class="form-input">
              <ion-input
                [(ngModel)]="editProfile.email"
                placeholder="Entrez votre email"
                type="email">
              </ion-input>
            </ion-item>
          </div>

          <div class="form-group">
            <ion-label class="form-label">Nouveau mot de passe</ion-label>
            <ion-item class="form-input">
              <ion-input
                [(ngModel)]="editProfile.motDePasse"
                placeholder="Nouveau mot de passe (optionnel)"
                type="password">
              </ion-input>
            </ion-item>
          </div>

          <div class="form-group">
            <ion-label class="form-label">Numéro de téléphone</ion-label>
            <ion-item class="form-input">
              <ion-input
                [(ngModel)]="editProfile.telephone"
                placeholder="Entrez votre téléphone"
                type="tel">
              </ion-input>
            </ion-item>
          </div>

          <!-- Boutons d'action pour l'édition -->
          <div class="edit-actions">
            <ion-button fill="outline" color="medium" (click)="cancelEdit()">
              <ion-icon name="close-outline" slot="start"></ion-icon>
              Annuler
            </ion-button>
            <ion-button color="primary" (click)="saveProfile()">
              <ion-icon name="checkmark-outline" slot="start"></ion-icon>
              Sauvegarder
            </ion-button>
          </div>
        </div>

        <!-- Bouton de modification -->
        <div class="modify-button-container" *ngIf="!isEditing">
          <ion-button 
            expand="block" 
            color="primary" 
            class="modify-button"
            (click)="startEdit()">
            <ion-icon name="create-outline" slot="start"></ion-icon>
            Modifier les informations personnelles
          </ion-button>
        </div>
      </div>
    </ion-content>

    <!-- Modal de changement de photo -->
    <ion-modal [isOpen]="showPhotoModal" (didDismiss)="closePhotoModal()">
      <ng-template>
        <div class="photo-modal-content">
          <div class="modal-header">
            <h2>Changer photo profil</h2>
            <ion-button fill="clear" size="small" (click)="closePhotoModal()">
              <ion-icon name="close-outline"></ion-icon>
            </ion-button>
          </div>
          
          <div class="photo-options">
            <ion-button 
              expand="block" 
              fill="outline" 
              color="primary" 
              class="photo-option"
              (click)="takePhoto()">
              <ion-icon name="camera-outline" slot="start"></ion-icon>
              Prendre une photo
            </ion-button>
            
            <ion-button 
              expand="block" 
              fill="outline" 
              color="primary" 
              class="photo-option"
              (click)="selectFromGallery()">
              <ion-icon name="images-outline" slot="start"></ion-icon>
              Choisir dans la galerie
            </ion-button>
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

        <ion-tab-button (click)="navigateTo('/map')">
          <ion-icon name="map-outline"></ion-icon>
          <ion-label>Carte</ion-label>
        </ion-tab-button>

        <ion-tab-button class="active">
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

    /* Content */
    .profile-content {
      --background: #f8f9fa;
    }

    /* Section photo de profil */
    .profile-photo-section {
      background: white;
      padding: 40px 20px;
      text-align: center;
      border-bottom: 1px solid var(--border-color);
    }

    .photo-container {
      position: relative;
      display: inline-block;
      cursor: pointer;
    }

    .profile-photo {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      overflow: hidden;
      border: 4px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8f9fa;
      position: relative;
    }

    .profile-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .default-avatar {
      font-size: 80px;
      color: var(--text-muted);
    }

    .photo-edit-indicator {
      position: absolute;
      bottom: 0;
      right: 0;
    }

    .edit-badge {
      width: 36px;
      height: 36px;
      background: #fbbf24;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .edit-badge ion-icon {
      font-size: 18px;
      color: white;
    }

    /* Section informations */
    .profile-info-section {
      background: white;
      margin: 16px;
      border-radius: 12px;
      padding: 20px;
      box-shadow: var(--shadow);
    }

    .section-header {
      margin-bottom: 24px;
    }

    .section-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--primary-color);
    }

    /* Informations en lecture seule */
    .info-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .info-item:last-child {
      border-bottom: none;
    }

    .info-label {
      font-size: 14px;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .info-value {
      font-size: 14px;
      color: var(--text-primary);
      font-weight: 500;
      text-align: right;
    }

    .info-value.password {
      font-family: monospace;
      letter-spacing: 2px;
    }

    /* Formulaire d'édition */
    .edit-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-label {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
    }

    .form-input {
      --background: #f8f9fa;
      --border-color: var(--border-color);
      --border-radius: 8px;
      --border-width: 1px;
      --border-style: solid;
      --padding-start: 16px;
      --padding-end: 16px;
      --min-height: 48px;
      margin: 0;
    }

    .form-input ion-input {
      --color: var(--text-primary);
      --placeholder-color: var(--text-muted);
      font-size: 14px;
    }

    .form-input.item-has-focus {
      --border-color: var(--primary-color);
      --border-width: 2px;
    }

    /* Actions d'édition */
    .edit-actions {
      display: flex;
      gap: 12px;
      margin-top: 20px;
    }

    .edit-actions ion-button {
      flex: 1;
      --border-radius: 8px;
      height: 48px;
      font-weight: 500;
    }

    /* Bouton de modification */
    .modify-button-container {
      margin-top: 32px;
    }

    .modify-button {
      --border-radius: 12px;
      --padding-top: 16px;
      --padding-bottom: 16px;
      font-weight: 600;
      height: 56px;
    }

    /* Modal photo */
    .photo-modal-content {
      padding: 24px;
      min-height: 200px;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .photo-options {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .photo-option {
      --border-radius: 12px;
      --padding-top: 16px;
      --padding-bottom: 16px;
      height: 56px;
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
      .profile-info-section {
        margin: 12px;
        padding: 16px;
      }

      .profile-photo {
        width: 100px;
        height: 100px;
      }

      .default-avatar {
        font-size: 60px;
      }

      .edit-badge {
        width: 32px;
        height: 32px;
      }

      .edit-badge ion-icon {
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
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonInput,
    IonFooter,
    IonTabBar,
    IonTabButton,
    IonModal,
    IonList
  ]
})
export class ProfilePage implements OnInit {
  userProfile: UserProfile = {
    nom: 'WOUAMBA',
    prenom: 'Roy Melvin',
    email: 'wouambar@gmail.com',
    type: 'Étudiant',
    motDePasse: '••••••••••',
    telephone: '+237 6 73 58 99 00',
    photo: undefined
  };

  editProfile: UserProfile = { ...this.userProfile };
  isEditing = false;
  showPhotoModal = false;

  constructor(
    private router: Router,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {
    addIcons({
      menuOutline,
      personCircleOutline,
      cameraOutline,
      imagesOutline,
      createOutline,
      homeOutline,
      businessOutline,
      mapOutline,
      personOutline,
      checkmarkOutline,
      closeOutline
    });
  }

  ngOnInit() {
    // Charger les données du profil depuis le stockage local ou l'API
    this.loadUserProfile();
  }

  private loadUserProfile() {
    // Ici vous pourriez charger les données depuis votre service
    // Pour l'exemple, on utilise des données statiques
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      this.userProfile = JSON.parse(savedProfile);
    }
  }

  startEdit() {
    this.isEditing = true;
    this.editProfile = { ...this.userProfile };
  }

  cancelEdit() {
    this.isEditing = false;
    this.editProfile = { ...this.userProfile };
  }

  async saveProfile() {
    // Validation des champs
    if (!this.editProfile.nom.trim() || !this.editProfile.prenom.trim() || !this.editProfile.email.trim()) {
      await this.showToast('Veuillez remplir tous les champs obligatoires', 'warning');
      return;
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.editProfile.email)) {
      await this.showToast('Veuillez saisir une adresse email valide', 'warning');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Sauvegarde en cours...',
      duration: 1500
    });
    await loading.present();

    try {
      // Simulation de la sauvegarde
      setTimeout(async () => {
        // Ne pas modifier le mot de passe s'il est vide
        if (!this.editProfile.motDePasse.trim()) {
          this.editProfile.motDePasse = this.userProfile.motDePasse;
        }

        this.userProfile = { ...this.editProfile };
        
        // Sauvegarder dans le stockage local
        localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
        
        this.isEditing = false;
        await loading.dismiss();
        await this.showToast('Profil mis à jour avec succès', 'success');
      }, 1500);
    } catch (error) {
      await loading.dismiss();
      await this.showToast('Erreur lors de la sauvegarde', 'danger');
    }
  }

  changeProfilePhoto() {
    this.showPhotoModal = true;
  }

  closePhotoModal() {
    this.showPhotoModal = false;
  }

  async takePhoto() {
    this.closePhotoModal();
    
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      if (image.dataUrl) {
        this.userProfile.photo = image.dataUrl;
        localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
        await this.showToast('Photo mise à jour', 'success');
      }
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
      await this.showToast('Erreur lors de la prise de photo', 'danger');
    }
  }

  async selectFromGallery() {
    this.closePhotoModal();
    
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });

      if (image.dataUrl) {
        this.userProfile.photo = image.dataUrl;
        localStorage.setItem('userProfile', JSON.stringify(this.userProfile));
        await this.showToast('Photo mise à jour', 'success');
      }
    } catch (error) {
      console.error('Erreur lors de la sélection de photo:', error);
      await this.showToast('Erreur lors de la sélection de photo', 'danger');
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  private async showToast(message: string, color: 'success' | 'warning' | 'danger' = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      color
    });
    await toast.present();
  }
}