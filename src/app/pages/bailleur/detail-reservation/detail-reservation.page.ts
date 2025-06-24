import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonIcon, IonButtons, NavController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-detail-reservation',
  templateUrl: './detail-reservation.page.html',
  styleUrls: ['./detail-reservation.page.scss'],
  standalone: true,
  imports: [IonButtons, IonIcon, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class DetailReservationPage implements OnInit {

  selectedReason: string = '';
  showSuccessModalFlag: boolean = false;
  showRefuseModalFlag: boolean = false;
  showCustomReasonInput: boolean = false;
  customReasonText: string = '';

  constructor(private navCtrl: NavController) { }

  ngOnInit(): void {
    return
  }

  onValidate() {
    this.showSuccessModalFlag = true;
    // Fermer automatiquement après 3 secondes
    setTimeout(() => {
      this.showSuccessModalFlag = false;
    }, 3000);

    // Ici vous pouvez ajouter la logique pour valider la réservation
    console.log('Réservation validée');
  }

  onRefuse() {
    this.showRefuseModalFlag = true;
  }

  closeRefuseModal() {
    this.showRefuseModalFlag = false;
    this.selectedReason = '';
    this.showCustomReasonInput = false;
    this.customReasonText = '';
  }

  selectReason(reason: string) {
    this.selectedReason = reason;

    if (reason === 'Autre') {
      this.showCustomReasonInput = true;
    } else {
      this.showCustomReasonInput = false;
      this.customReasonText = '';
    }
  }

  confirmRefusal() {
    let finalReason = this.selectedReason;

    if (this.selectedReason === 'Autre') {
      if (this.customReasonText.trim()) {
        finalReason = this.customReasonText.trim();
      } else {
        // Vous pouvez utiliser un toast Ionic ici
        alert('Veuillez préciser la raison');
        return;
      }
    }

    if (finalReason) {
      // Ici vous pouvez ajouter la logique pour traiter le refus
      console.log('Réservation refusée pour la raison:', finalReason);

      // Fermer la modale
      this.closeRefuseModal();

      // Afficher confirmation (vous pouvez utiliser un toast)
      alert(`Réservation annulée. Raison: ${finalReason}`);
    } else {
      alert('Veuillez sélectionner une raison');
    }
  }

  establishContract() {
    // Logique pour établir le contrat de bail
    console.log('Établissement du contrat de bail');
  }

  goBack(){
    this.navCtrl.back();
  }

}
