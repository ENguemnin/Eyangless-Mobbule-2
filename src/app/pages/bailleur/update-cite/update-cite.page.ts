import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonIcon, IonButton, IonButtons, NavController, AlertController, LoadingController, ToastController } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-cite',
  templateUrl: './update-cite.page.html',
  styleUrls: ['./update-cite.page.scss'],
  standalone: true,
  imports: [IonButtons, IonButton, IonIcon, IonLabel, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class UpdateCitePage implements OnInit {
// Propriétés du formulaire
  citeName: string = '';
  catchPhrase: string = '';
  description: string = '';
  location: string = '';

  // Mode édition ou création
  isEditMode: boolean = false;
  citeId: string | null = null;

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Vérifier si on est en mode édition
    this.citeId = this.route.snapshot.paramMap.get('id');
    if (this.citeId) {
      this.isEditMode = true;
      this.loadCiteData();
    }
  }

  /**
   * Retour à la page précédente
   */
  goBack() {
    // Vérifier s'il y a des modifications non sauvegardées
    if (this.hasUnsavedChanges()) {
      this.showUnsavedChangesAlert();
    } else {
      this.navCtrl.back();
    }
  }

  /**
   * Sauvegarder la cité
   */
  async saveCite() {
    // Validation des champs
    if (!this.validateForm()) {
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: this.isEditMode ? 'Modification en cours...' : 'Création en cours...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const citeData: any = {
        name: this.citeName.trim(),
        catchPhrase: this.catchPhrase.trim(),
        description: this.description.trim(),
        location: this.location.trim(),
        updatedAt: new Date().toISOString()
      };

      if (this.isEditMode) {
        // Modifier la cité existante
        await this.updateCite(citeData);
        this.showToast('Cité modifiée avec succès');
      } else {
        // Créer une nouvelle cité
        citeData['createdAt'] = new Date().toISOString();
        await this.createCite(citeData);
        this.showToast('Cité créée avec succès');
      }

      await loading.dismiss();
      this.navCtrl.back();

    } catch (error) {
      await loading.dismiss();
      this.showErrorAlert('Erreur lors de la sauvegarde');
      console.error('Erreur sauvegarde cité:', error);
    }
  }

  /**
   * Valider le formulaire
   */
  private validateForm(): boolean {
    if (!this.citeName.trim()) {
      this.showErrorAlert('Le nom de la cité est obligatoire');
      return false;
    }

    if (this.citeName.trim().length < 3) {
      this.showErrorAlert('Le nom de la cité doit contenir au moins 3 caractères');
      return false;
    }

    if (!this.catchPhrase.trim()) {
      this.showErrorAlert('La phrase d\'accroche est obligatoire');
      return false;
    }

    return true;
  }

  /**
   * Charger les données de la cité (mode édition)
   */
  private async loadCiteData() {
    if (!this.citeId) return;

    const loading = await this.loadingCtrl.create({
      message: 'Chargement...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      // Simuler un appel API - remplace par ton service réel
      const citeData = await this.getCiteById(this.citeId);

      this.citeName = citeData.name || '';
      this.catchPhrase = citeData.catchPhrase || '';
      this.description = citeData.description || '';
      this.location = citeData.location || '';

      await loading.dismiss();

    } catch (error) {
      await loading.dismiss();
      this.showErrorAlert('Erreur lors du chargement des données');
      console.error('Erreur chargement cité:', error);
    }
  }

  /**
   * Vérifier s'il y a des modifications non sauvegardées
   */
  private hasUnsavedChanges(): boolean {
    return this.citeName.trim() !== '' ||
           this.catchPhrase.trim() !== '' ||
           this.description.trim() !== '' ||
           this.location.trim() !== '';
  }

  /**
   * Sélectionner une localisation
   */
  async selectLocation() {
    const alert = await this.alertCtrl.create({
      header: 'Localisation',
      message: 'Sélectionnez votre localisation',
      inputs: [
        {
          name: 'location',
          type: 'text',
          placeholder: 'Entrer la localisation',
          value: this.location
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Confirmer',
          handler: (data) => {
            if (data.location && data.location.trim()) {
              this.location = data.location.trim();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * Afficher l'alerte pour les modifications non sauvegardées
   */
  private async showUnsavedChangesAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Modifications non sauvegardées',
      message: 'Voulez-vous vraiment quitter sans sauvegarder vos modifications ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Quitter',
          handler: () => {
            this.navCtrl.back();
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * Afficher une alerte d'erreur
   */
  private async showErrorAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Erreur',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  /**
   * Afficher un toast de succès
   */
  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  }

  /**
   * Créer une nouvelle cité (à remplacer par ton service réel)
   */
  private createCite(citeData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // Simuler un délai d'API
      setTimeout(() => {
        // Ici tu appelleras ton service réel
        // Exemple: this.citeService.create(citeData)
        console.log('Création cité:', citeData);
        resolve(citeData);
      }, 1500);
    });
  }

  /**
   * Modifier une cité existante (à remplacer par ton service réel)
   */
  private updateCite(citeData: any): Promise<any> {
    return new Promise((resolve, reject) => {
      // Simuler un délai d'API
      setTimeout(() => {
        // Ici tu appelleras ton service réel
        // Exemple: this.citeService.update(this.citeId, citeData)
        console.log('Modification cité:', citeData);
        resolve(citeData);
      }, 1500);
    });
  }

  /**
   * Récupérer une cité par son ID (à remplacer par ton service réel)
   */
  private getCiteById(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      // Simuler un délai d'API
      setTimeout(() => {
        // Ici tu appelleras ton service réel
        // Exemple: this.citeService.getById(id)
        const mockData = {
          id: id,
          name: 'Cité SHEKINA',
          catchPhrase: 'Cité moderne',
          description: 'Une belle cité moderne avec tous les équipements nécessaires...',
          location: 'Eyang, Lobo'
        };
        resolve(mockData);
      }, 1000);
    });
  }
}
