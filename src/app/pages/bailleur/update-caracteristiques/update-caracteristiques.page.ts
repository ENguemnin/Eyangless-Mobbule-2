import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonContent, IonHeader, IonTitle, IonToolbar, LoadingController, NavController, ToastController, IonLabel, IonItem, IonIcon, IonButton, IonButtons } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-update-caracteristiques',
  templateUrl: './update-caracteristiques.page.html',
  styleUrls: ['./update-caracteristiques.page.scss'],
  standalone: true,
  imports: [IonButtons, IonButton, IonIcon, IonItem, IonLabel, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class UpdateCaracteristiquesPage implements OnInit {

  // Propriétés du formulaire
  nombreEtages: number | null = null;
  nombreChambres: number | null = null;
  tailleParChambre: number | null = null;
  prixChambre: number | null = null;
  dureeBail: number | null = null;
  caution: number | null = null;

  // Caractéristiques financières
  banque: string = '';
  numeroCompte: string = '';

  // Autres caractéristiques
  eauSelected: string = '';
  electriciteSelected: string = '';

  // Options pour les sélecteurs
  eauOptions = [
    'Disponible',
    'Non disponible',
    'Partiellement disponible'
  ];

  electriciteOptions = [
    'Disponible',
    'Non disponible',
    'Générateur',
    'Solaire'
  ];

  // Toggles pour les caractéristiques
  groupeElectrogene: boolean = false;
  forage: boolean = false;
  gardien: boolean = false;
  concierge: boolean = false;
  barriere: boolean = false;
  couvreFeu: boolean = false;
  heureCouvrefeu: string = '';

  // Caractéristiques personnalisées
  customCharacteristics: Array<{id: string, label: string, value: boolean}> = [];

  // Gestion des sections expandables
  sectionExpanded: any = {
    general: true,
    financieres: false,
    autres: false
  };

  // Mode édition ou création
  isEditMode: boolean = false;
  characteristicsId: string | null = null;

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // Vérifier si on est en mode édition
    this.characteristicsId = this.route.snapshot.paramMap.get('id');
    if (this.characteristicsId) {
      this.isEditMode = true;
      this.loadCharacteristicsData();
    }
  }

  /**
   * Toggle section expandable
   */
  toggleSection(section: string) {
    this.sectionExpanded[section] = !this.sectionExpanded[section];
  }

  /**
   * Ouvrir le sélecteur pour l'eau
   */
  async openEauSelect() {
    const alert = await this.alertCtrl.create({
      header: 'Sélectionner l\'eau',
      inputs: this.eauOptions.map(option => ({
        name: 'eau',
        type: 'radio',
        label: option,
        value: option,
        checked: this.eauSelected === option
      })),
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Confirmer',
          handler: (value) => {
            this.eauSelected = value;
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * Ouvrir le sélecteur de temps pour le couvre-feu
   */
  async openTimePicker(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Heure du couvre-feu',
      inputs: [
        {
          name: 'time',
          type: 'time',
          value: this.heureCouvrefeu || '18:00'
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
            this.heureCouvrefeu = data.time;
            return true; // Important : retourner une valeur dans le handler
          }
        }
      ]
    });

    return await alert.present(); // Retourner explicitement la Promise
  }

  /**
   * Ajouter une caractéristique personnalisée
   */
  async addCustomCharacteristic(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Nouvelle caractéristique',
      message: 'Veuillez saisir le libellé de la nouvelle caractéristique',
      inputs: [
        {
          name: 'label',
          type: 'text',
          placeholder: 'Ex: Piscine, Parking, etc.'
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Ajouter',
          handler: (data) => {
            if (data.label && data.label.trim() !== '') {
              const newCharacteristic = {
                id: Date.now().toString(),
                label: data.label.trim(),
                value: false
              };
              this.customCharacteristics.push(newCharacteristic);
              this.showToast('Caractéristique ajoutée avec succès');
              return true; // ✅ Retourner true pour fermer l'alert
            } else {
              this.showErrorAlert('Veuillez saisir un libellé valide');
              return false; // ✅ Retourner false pour garder l'alert ouverte
            }
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Supprimer une caractéristique personnalisée
   */
  async removeCustomCharacteristic(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Supprimer la caractéristique',
      message: 'Êtes-vous sûr de vouloir supprimer cette caractéristique ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Supprimer',
          handler: () => {
            this.customCharacteristics = this.customCharacteristics.filter(c => c.id !== id);
            this.showToast('Caractéristique supprimée');
          }
        }
      ]
    });
    await alert.present();
  }

  /**
   * Ouvrir le sélecteur pour l'électricité
   */
  async openElectriciteSelect() {
    const alert = await this.alertCtrl.create({
      header: 'Sélectionner l\'électricité',
      inputs: this.electriciteOptions.map(option => ({
        name: 'electricite',
        type: 'radio',
        label: option,
        value: option,
        checked: this.electriciteSelected === option
      })),
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Confirmer',
          handler: (value) => {
            this.electriciteSelected = value;
          }
        }
      ]
    });
    await alert.present();
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
   * Sauvegarder les caractéristiques
   */
  async saveCharacteristics() {
    // Validation des champs
    if (!this.validateForm()) {
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: this.isEditMode ? 'Modification en cours...' : 'Sauvegarde en cours...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      const characteristicsData: any = {
        nombreEtages: this.nombreEtages,
        nombreChambres: this.nombreChambres,
        tailleParChambre: this.tailleParChambre,
        prixChambre: this.prixChambre,
        dureeBail: this.dureeBail,
        caution: this.caution,
        banque: this.banque.trim(),
        numeroCompte: this.numeroCompte.trim(),
        eau: this.eauSelected,
        electricite: this.electriciteSelected,
        groupeElectrogene: this.groupeElectrogene,
        forage: this.forage,
        gardien: this.gardien,
        concierge: this.concierge,
        barriere: this.barriere,
        couvreFeu: this.couvreFeu,
        heureCouvrefeu: this.heureCouvrefeu,
        customCharacteristics: this.customCharacteristics,
        updatedAt: new Date().toISOString()
      };

      if (this.isEditMode) {
        // Modifier les caractéristiques existantes
        await this.updateCharacteristics(characteristicsData);
        this.showToast('Caractéristiques modifiées avec succès');
      } else {
        // Créer de nouvelles caractéristiques
        characteristicsData['createdAt'] = new Date().toISOString();
        await this.createCharacteristics(characteristicsData);
        this.showToast('Caractéristiques sauvegardées avec succès');
      }

      await loading.dismiss();
      this.navCtrl.back();

    } catch (error) {
      await loading.dismiss();
      this.showErrorAlert('Erreur lors de la sauvegarde');
      console.error('Erreur sauvegarde caractéristiques:', error);
    }
  }

  /**
   * Valider le formulaire
   */
  private validateForm(): boolean {
    if (this.nombreEtages === null || this.nombreEtages <= 0) {
      this.showErrorAlert('Le nombre d\'étages doit être supérieur à 0');
      return false;
    }

    if (this.nombreChambres === null || this.nombreChambres <= 0) {
      this.showErrorAlert('Le nombre de chambres doit être supérieur à 0');
      return false;
    }

    if (this.tailleParChambre === null || this.tailleParChambre <= 0) {
      this.showErrorAlert('La taille par chambre doit être supérieure à 0');
      return false;
    }

    if (this.prixChambre === null || this.prixChambre <= 0) {
      this.showErrorAlert('Le prix d\'une chambre doit être supérieur à 0');
      return false;
    }

    if (this.dureeBail === null || this.dureeBail <= 0) {
      this.showErrorAlert('La durée du bail doit être supérieure à 0');
      return false;
    }

    if (this.caution === null || this.caution < 0) {
      this.showErrorAlert('La caution ne peut pas être négative');
      return false;
    }

    return true;
  }

  /**
   * Charger les données des caractéristiques (mode édition)
   */
  private async loadCharacteristicsData() {
    if (!this.characteristicsId) return;

    const loading = await this.loadingCtrl.create({
      message: 'Chargement...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      // Simuler un appel API - remplace par ton service réel
      const characteristicsData = await this.getCharacteristicsById(this.characteristicsId);

      this.nombreEtages = characteristicsData.nombreEtages || null;
      this.nombreChambres = characteristicsData.nombreChambres || null;
      this.tailleParChambre = characteristicsData.tailleParChambre || null;
      this.prixChambre = characteristicsData.prixChambre || null;
      this.dureeBail = characteristicsData.dureeBail || null;
      this.caution = characteristicsData.caution || null;
      this.banque = characteristicsData.banque || '';
      this.numeroCompte = characteristicsData.numeroCompte || '';
      this.eauSelected = characteristicsData.eau || '';
      this.electriciteSelected = characteristicsData.electricite || '';
      this.groupeElectrogene = characteristicsData.groupeElectrogene || false;
      this.forage = characteristicsData.forage || false;
      this.gardien = characteristicsData.gardien || false;
      this.concierge = characteristicsData.concierge || false;
      this.barriere = characteristicsData.barriere || false;
      this.couvreFeu = characteristicsData.couvreFeu || false;
      this.heureCouvrefeu = characteristicsData.heureCouvrefeu || '';
      this.customCharacteristics = characteristicsData.customCharacteristics || [];

      await loading.dismiss();

    } catch (error) {
      await loading.dismiss();
      this.showErrorAlert('Erreur lors du chargement des données');
      console.error('Erreur chargement caractéristiques:', error);
    }
  }

  /**
   * Vérifier s'il y a des modifications non sauvegardées
   */
  private hasUnsavedChanges(): boolean {
    return this.nombreEtages !== null ||
           this.nombreChambres !== null ||
           this.tailleParChambre !== null ||
           this.prixChambre !== null ||
           this.dureeBail !== null ||
           this.caution !== null ||
           this.banque.trim() !== '' ||
           this.numeroCompte.trim() !== '' ||
           this.eauSelected !== '' ||
           this.electriciteSelected !== '' ||
           this.groupeElectrogene ||
           this.forage ||
           this.gardien ||
           this.concierge ||
           this.barriere ||
           this.couvreFeu ||
           this.heureCouvrefeu !== '' ||
           this.customCharacteristics.length > 0;
  }

  /**
   * Afficher l'alerte pour les modifications non sauvegardées
   */
  private async showUnsavedChangesAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Modifications non sauvegardées',
      message: 'Vous avez des modifications non sauvegardées. Voulez-vous vraiment quitter?',
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
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();
  }

  // Méthodes API simulées - à remplacer par tes vrais services
  private async createCharacteristics(data: any): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data), 1000);
    });
  }

  private async updateCharacteristics(data: any): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(data), 1000);
    });
  }

  private async getCharacteristicsById(id: string): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({
        nombreEtages: 3,
        nombreChambres: 26,
        tailleParChambre: 10,
        prixChambre: 50000,
        dureeBail: 12,
        caution: 1,
        banque: 'UBA',
        numeroCompte: '1083 9829 3793 9828 00 232',
        eau: 'Disponible',
        electricite: 'Disponible',
        groupeElectrogene: true,
        forage: true,
        gardien: true,
        concierge: true,
        barriere: true,
        couvreFeu: false,
        heureCouvrefeu: '18:00',
        customCharacteristics: []
      }), 1000);
    });
  }
}
