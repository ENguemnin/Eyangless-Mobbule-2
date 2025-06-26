import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl = environment.backendUrl + "auth";
  private userUrl = environment.backendUrl + "user";


  constructor(private http: HttpClient) { }

  // Se connecter et récupérer le token en retour
  login(username: string, password: string) : Observable<any>{
    return this.http.post(`${this.authUrl}/login`, { username, password })
      .pipe(
        tap((response: any) => {
          // Vérifier si la réponse contient un statut UNAUTHORIZED
          if (response.status === 'UNAUTHORIZED') {
            throw new Error('Authentification échouée'); // Force à tomber dans le bloc error
          }
          // Stockage du token après authentification
          localStorage.setItem('user', response);
        })
      )
  }

  // Ajouter un Locataire
  addLocataire(user: User): Observable<any>{
    return this.http.post(`${this.userUrl}/locataire`, user);
  }

  // Ajouter un bailleur
  addBailleur(user: User): Observable<any>{
    return this.http.post(`${this.userUrl}/bailleur`, user);
  }

  // Ajouter un modérateur
  addModerateur(user: User): Observable<any>{
    return this.http.post(`${this.userUrl}/moderateur`, user);
  }


  // Vérifier le code OTP envoyé par email
  verifyOTP(email: string, otp: string): Observable<any>{
    return this.http.post(`${this.authUrl}/verify-otp`, { "email": email, "otp": otp });
  }

  // Vérifier si l'email est déjà utilisé
  checkExistingEmail(email: string): Observable<any>{
    return this.http.get(`${this.userUrl}/email/${email}`);
  }
}
