import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonBadge,
  LoadingController,
  ToastController,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  downloadOutline,
  cloudUploadOutline,
  checkmarkCircleOutline,
  documentTextOutline
} from 'ionicons/icons';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

interface ContractData {
  id: number;
  cityName: string;
  roomId: string;
  status: 'generated' | 'signed' | 'validated';
  generatedDate: string;
  signedDate?: string;
  uploadedFile?: {
    name: string;
    size: string;
    uploadDate: string;
    verified: boolean;
  };
}

@Component({
  selector: 'app-contract-management',
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/reservations" color="primary"></ion-back-button>
        </ion-buttons>
        <ion-title>Contrat de bail</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="contract-content">
      <div class="contract-section" *ngIf="contractData">
        <div class="contract-header">
          <h2>📄 Contrat de bail</h2>
          <p class="contract-subtitle">{{ contractData.cityName }} - Chambre {{ contractData.roomId }}</p>
        </div>

        <!-- Statut du contrat -->
        <div class="status-section">
          <div class="status-item">
            <span class="status-label">📋 Statut :</span>
            <ion-badge [color]="getStatusColor(contractData.status)" class="status-badge">
              {{ getStatusText(contractData.status) }}
            </ion-badge>
          </div>

          <div class="status-item">
            <span class="status-label">📅 Date :</span>
            <span class="status-value">{{ contractData.generatedDate }}</span>
          </div>

          <div class="status-item">
            <span class="status-label">💾 Téléchargé :</span>
            <span class="status-value">Oui</span>
          </div>
        </div>

        <!-- Téléchargement du contrat -->
        <div class="download-section">
          <ion-button 
            expand="block" 
            color="primary" 
            class="download-button"
            (click)="downloadContract()"
          >
            <ion-icon name="download-outline" slot="start"></ion-icon>
            Télécharger le contrat
          </ion-button>
        </div>

        <!-- Upload du contrat signé -->
        <div class="upload-section">
          <h3>📤 Upload du contrat signé</h3>
          <p class="upload-subtitle">
            Veuillez scanner et uploader le contrat signé par les deux parties
          </p>

          <!-- Fichier actuel -->
          <div class="current-file" *ngIf="!contractData.uploadedFile">
            <div class="file-info">
              <span class="file-label">📎 Fichier actuel :</span>
              <span class="file-status">Aucun fichier sélectionné</span>
            </div>
          </div>

          <!-- Fichier uploadé -->
          <div class="uploaded-file" *ngIf="contractData.uploadedFile">
            <div class="file-preview">
              <div class="file-icon">📄</div>
              <div class="file-details">
                <h4>📎 Contrat signé uploadé</h4>
                <div class="file-meta">
                  <div class="meta-item">
                    <span class="meta-label">✅ Statut :</span>
                    <span class="meta-value" [class.verified]="contractData.uploadedFile.verified">
                      {{ contractData.uploadedFile.verified ? 'Vérifié' : 'En attente' }}
                    </span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">📁 Nom du fichier :</span>
                    <span class="meta-value">{{ contractData.uploadedFile.name }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">📊 Taille :</span>
                    <span class="meta-value">{{ contractData.uploadedFile.size }}</span>
                  </div>
                  <div class="meta-item">
                    <span class="meta-label">📅 Date d'upload :</span>
                    <span class="meta-value">{{ contractData.uploadedFile.uploadDate }}</span>
                  </div>
                </div>
              </div>
            </div>

            <ion-button 
              expand="block" 
              fill="outline" 
              color="primary" 
              class="download-uploaded-button"
              (click)="downloadUploadedContract()"
            >
              <ion-icon name="download-outline" slot="start"></ion-icon>
              Télécharger
            </ion-button>
          </div>

          <!-- Boutons d'upload -->
          <div class="upload-buttons" *ngIf="!contractData.uploadedFile">
            <ion-button 
              expand="block" 
              fill="outline" 
              color="medium" 
              class="upload-button"
              (click)="selectFile()"
            >
              <ion-icon name="document-text-outline" slot="start"></ion-icon>
              Choisir un fichier
            </ion-button>

            <ion-button 
              expand="block" 
              color="primary" 
              class="upload-button"
              [disabled]="!selectedFile"
              (click)="uploadFile()"
            >
              <ion-icon name="cloud-upload-outline" slot="start"></ion-icon>
              Uploader
            </ion-button>
          </div>

          <!-- Instructions -->
          <div class="instructions">
            <h4>📋 Instructions :</h4>
            <ul class="instructions-list">
              <li>• Signez le contrat téléchargé</li>
              <li>• Faites-le signer par le propriétaire</li>
              <li>• Scannez le document signé</li>
              <li>• Uploadez le fichier (PDF, JPG, PNG acceptés)</li>
            </ul>
          </div>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    :host {
      --primary-color: #1dd1a1;
      --success-color: #10b981;
      --warning-color: #f59e0b;
      --text-primary: #374151;
      --text-secondary: #6b7280;
      --text-muted: #9ca3af;
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
    .contract-content {
      --background: #f8f9fa;
    }

    .contract-section {
      background: white;
      margin: 16px;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .contract-header {
      text-align: center;
      margin-bottom: 24px;
    }

    .contract-header h2 {
      margin: 0 0 8px 0;
      font-size: 20px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .contract-subtitle {
      margin: 0;
      font-size: 14px;
      color: var(--text-secondary);
    }

    /* Section statut */
    .status-section {
      margin-bottom: 24px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .status-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .status-item:last-child {
      margin-bottom: 0;
    }

    .status-label {
      font-size: 14px;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .status-value {
      font-size: 14px;
      color: var(--text-primary);
      font-weight: 500;
    }

    .status-badge {
      font-size: 12px;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 16px;
    }

    /* Section téléchargement */
    .download-section {
      margin-bottom: 32px;
    }

    .download-button {
      --border-radius: 12px;
      --padding-top: 16px;
      --padding-bottom: 16px;
      height: 56px;
      font-weight: 600;
    }

    /* Section upload */
    .upload-section h3 {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .upload-subtitle {
      margin: 0 0 20px 0;
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .current-file {
      margin-bottom: 20px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .file-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .file-label {
      font-size: 14px;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .file-status {
      font-size: 14px;
      color: var(--text-muted);
    }

    /* Fichier uploadé */
    .uploaded-file {
      margin-bottom: 20px;
    }

    .file-preview {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 12px;
    }

    .file-preview h4 {
      margin: 0 0 12px 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--success-color);
    }

    .file-meta {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .meta-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .meta-label {
      font-size: 12px;
      color: var(--text-secondary);
      font-weight: 500;
    }

    .meta-value {
      font-size: 12px;
      color: var(--text-primary);
      font-weight: 500;
    }

    .meta-value.verified {
      color: var(--success-color);
      font-weight: 600;
    }

    .download-uploaded-button {
      --border-radius: 8px;
      height: 48px;
      font-weight: 500;
    }

    /* Boutons d'upload */
    .upload-buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 24px;
    }

    .upload-button {
      --border-radius: 8px;
      height: 48px;
      font-weight: 500;
    }

    .upload-button:disabled {
      --background: #d1d5db;
      --color: #9ca3af;
    }

    /* Instructions */
    .instructions h4 {
      margin: 0 0 12px 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
    }

    .instructions-list {
      margin: 0;
      padding-left: 0;
      list-style: none;
    }

    .instructions-list li {
      margin-bottom: 8px;
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.4;
    }

    .instructions-list li:last-child {
      margin-bottom: 0;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .contract-section {
        margin: 12px;
        padding: 16px;
      }

      .status-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
      }

      .meta-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
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
    IonIcon,
    IonItem,
    IonLabel,
    IonBadge
  ]
})
export class ContractManagementPage implements OnInit {
  contractData?: ContractData;
  selectedFile?: File;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    addIcons({
      chevronBackOutline,
      downloadOutline,
      cloudUploadOutline,
      checkmarkCircleOutline,
      documentTextOutline
    });
  }

  ngOnInit() {
    const reservationId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadContractData(reservationId);
  }

  private loadContractData(reservationId: number) {
    // Simulation des données de contrat
    this.contractData = {
      id: reservationId,
      cityName: 'Cité Bevina',
      roomId: 'A12',
      status: 'generated',
      generatedDate: new Date().toLocaleDateString('fr-FR'),
      uploadedFile: undefined
    };

    // Vérifier s'il y a un contrat uploadé dans le localStorage
    const savedContract = localStorage.getItem(`contract_${reservationId}`);
    if (savedContract) {
      const contractInfo = JSON.parse(savedContract);
      this.contractData.uploadedFile = contractInfo;
      this.contractData.status = 'validated';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'generated':
        return 'warning';
      case 'signed':
        return 'primary';
      case 'validated':
        return 'success';
      default:
        return 'medium';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'generated':
        return 'Généré';
      case 'signed':
        return 'Signé';
      case 'validated':
        return '✅ Signé et validé';
      default:
        return 'Inconnu';
    }
  }

  async downloadContract() {
    const loading = await this.loadingController.create({
      message: 'Génération du contrat...',
      duration: 1500
    });
    await loading.present();

    setTimeout(async () => {
      await loading.dismiss();
      await this.showToast('Contrat téléchargé avec succès');

      // Simulation du téléchargement
      console.log('Téléchargement du contrat pour:', this.contractData?.cityName);
    }, 1500);
  }

  async selectFile() {
    try {
      // Utiliser l'API Camera pour sélectionner un fichier
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos
      });

      if (image.dataUrl) {
        // Simuler la sélection d'un fichier
        this.selectedFile = new File([''], 'contrat_signe.pdf', { type: 'application/pdf' });
        await this.showToast('Fichier sélectionné');
      }
    } catch (error) {
      console.error('Erreur lors de la sélection du fichier:', error);
      await this.showToast('Erreur lors de la sélection du fichier', 'danger');
    }
  }

  async uploadFile() {
    if (!this.selectedFile || !this.contractData) {
      await this.showToast('Aucun fichier sélectionné', 'warning');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Upload en cours...',
      duration: 2000
    });
    await loading.present();

    setTimeout(async () => {
      if (this.contractData) {
        // Simuler l'upload réussi
        const uploadedFile = {
          name: `contrat_${this.contractData.cityName.toLowerCase()}_${this.contractData.roomId}_signe.pdf`,
          size: '2.3 MB',
          uploadDate: new Date().toLocaleDateString('fr-FR'),
          verified: true
        };

        this.contractData.uploadedFile = uploadedFile;
        this.contractData.status = 'validated';
        this.contractData.signedDate = new Date().toLocaleDateString('fr-FR');

        // Sauvegarder dans le localStorage
        localStorage.setItem(`contract_${this.contractData.id}`, JSON.stringify(uploadedFile));

        this.selectedFile = undefined;
      }

      await loading.dismiss();
      await this.showToast('Contrat uploadé avec succès');
    }, 2000);
  }

  async downloadUploadedContract() {
    const loading = await this.loadingController.create({
      message: 'Téléchargement...',
      duration: 1000
    });
    await loading.present();

    setTimeout(async () => {
      await loading.dismiss();
      await this.showToast('Contrat téléchargé');
      console.log('Téléchargement du contrat signé');
    }, 1000);
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