// src/app/services/city.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Cite, CiteDTO, CiteResponse, ApiResponse } from '../models/city.models';
import { API_URLS, API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private citesSubject = new BehaviorSubject<Cite[]>([]);
  public cites$ = this.citesSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Obtient les headers avec le token d'authentification
   */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    let headers = new HttpHeaders(API_CONFIG.HEADERS);

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Gestion des erreurs HTTP
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Une erreur est survenue';

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      errorMessage = `Erreur ${error.status}: ${error.message}`;

      if (error.status === 401) {
        errorMessage = 'Non autorisé. Veuillez vous reconnecter.';
        // Rediriger vers la page de connexion
        localStorage.removeItem('auth_token');
      } else if (error.status === 403) {
        errorMessage = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
      } else if (error.status === 404) {
        errorMessage = 'Ressource non trouvée.';
      } else if (error.status === 500) {
        errorMessage = 'Erreur interne du serveur.';
      }
    }

    console.error('Erreur API:', error);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Transforme une Cite backend en Cite frontend avec propriétés calculées
   */
  private transformCite(cite: Cite): Cite {
    const transformedCite: Cite = {
      ...cite,
      // Calculs pour l'affichage
      rating: this.calculateRating(cite.notes || []),
      totalRooms: this.calculateTotalRooms(cite.chambres || []),
      availableRooms: this.calculateAvailableRooms(cite.chambres || []),
      status: this.extractStatus(cite.suplements || []),
      category: this.determineCategory(cite.suplements || []),
      location: cite.localisation?.ville || 'Non spécifié',
      verified: cite.bailleur ? true : false,
      image: this.getDefaultImage(), // Image par défaut
      subtitle: cite.description ? cite.description.substring(0, 50) + '...' : ''
    };

    // Calculer le prix moyen si des chambres existent
    if (cite.chambres && cite.chambres.length > 0) {
      const avgPrice = cite.chambres.reduce((sum, chambre) => sum + (chambre.prix || 0), 0) / cite.chambres.length;
      transformedCite.price = {
        amount: Math.round(avgPrice),
        period: 'mois'
      };
    }

    return transformedCite;
  }

  /**
   * Récupère toutes les cités avec pagination
   */
  getAllCites(pageNo: number = 0, pageSize: number = 10): Observable<CiteResponse> {
    this.loadingSubject.next(true);

    return this.http.get<CiteResponse>(
      API_URLS.GET_ALL_CITES(pageNo, pageSize),
      { headers: this.getHeaders() }
    ).pipe(
      map(response => ({
        ...response,
        content: response.content.map(cite => this.transformCite(cite))
      })),
      tap(response => {
        // Mettre à jour le cache local
        if (pageNo === 0) {
          this.citesSubject.next(response.content);
        } else {
          const currentCites = this.citesSubject.value;
          this.citesSubject.next([...currentCites, ...response.content]);
        }
        this.loadingSubject.next(false);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        return this.handleError(error);
      })
    );
  }

  /**
   * Récupère une cité par son ID
   */
  getCiteById(id: string): Observable<Cite> {
    this.loadingSubject.next(true);

    return this.http.get<Cite>(
      API_URLS.GET_CITE_BY_ID(id),
      { headers: this.getHeaders() }
    ).pipe(
      map(cite => this.transformCite(cite)),
      tap(() => this.loadingSubject.next(false)),
      catchError(error => {
        this.loadingSubject.next(false);
        return this.handleError(error);
      })
    );
  }

  /**
   * Crée une nouvelle cité
   */
  createCite(citeDTO: CiteDTO): Observable<CiteDTO> {
    this.loadingSubject.next(true);

    return this.http.post<CiteDTO>(
      API_URLS.CREATE_CITE,
      citeDTO,
      { headers: this.getHeaders() }
    ).pipe(
      tap(() => {
        this.loadingSubject.next(false);
        // Rafraîchir la liste des cités
        this.refreshCites();
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        return this.handleError(error);
      })
    );
  }

  /**
   * Met à jour une cité existante
   */
  updateCite(citeDTO: CiteDTO): Observable<CiteDTO> {
    this.loadingSubject.next(true);

    return this.http.put<CiteDTO>(
      API_URLS.UPDATE_CITE,
      citeDTO,
      { headers: this.getHeaders() }
    ).pipe(
      tap(() => {
        this.loadingSubject.next(false);
        // Rafraîchir la liste des cités
        this.refreshCites();
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        return this.handleError(error);
      })
    );
  }

  /**
   * Supprime une cité
   */
  deleteCite(id: string): Observable<string> {
    this.loadingSubject.next(true);

    return this.http.delete<string>(
      API_URLS.DELETE_CITE(id),
      {
        headers: this.getHeaders(),
        responseType: 'text' as 'json'
      }
    ).pipe(
      tap(() => {
        this.loadingSubject.next(false);
        // Mettre à jour le cache local
        const currentCites = this.citesSubject.value.filter(cite => cite.id !== id);
        this.citesSubject.next(currentCites);
      }),
      catchError(error => {
        this.loadingSubject.next(false);
        return this.handleError(error);
      })
    );
  }

  /**
   * Recherche des cités par terme
   */
  searchCites(searchTerm: string): Observable<Cite[]> {
    const currentCites = this.citesSubject.value;
    const filteredCites = currentCites.filter(cite =>
      cite.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cite.description && cite.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (cite.location && cite.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return new Observable(observer => {
      observer.next(filteredCites);
      observer.complete();
    });
  }

  /**
   * Filtre les cités par catégorie
   */
  filterCitesByCategory(category: 'tout' | 'en-construction' | 'securite' | 'meublee'): Observable<Cite[]> {
    const currentCites = this.citesSubject.value;
    let filteredCites = currentCites;

    if (category !== 'tout') {
      filteredCites = currentCites.filter(cite => cite.category === category);
    }

    return new Observable(observer => {
      observer.next(filteredCites);
      observer.complete();
    });
  }

  /**
   * Rafraîchit la liste des cités
   */
  refreshCites(): void {
    this.getAllCites(0, 10).subscribe();
  }

  // Méthodes utilitaires privées
  private calculateRating(notes: any[]): number {
    if (!notes || notes.length === 0) return 0;
    const sum = notes.reduce((acc, note) => acc + (note.valeur || 0), 0);
    return Math.round((sum / notes.length) * 10) / 10;
  }

  private calculateTotalRooms(chambres: any[]): number {
    return chambres ? chambres.length : 0;
  }

  private calculateAvailableRooms(chambres: any[]): number {
    if (!chambres) return 0;
    return chambres.filter(chambre => chambre.statut === 'LIBRE').length;
  }

  private extractStatus(supplements: any[]): string[] {
    if (!supplements) return [];
    return supplements
      .filter(sup => sup.type === 'STATUS')
      .map(sup => sup.nom)
      .slice(0, 2); // Maximum 2 statuts
  }

  private determineCategory(supplements: any[]): 'tout' | 'en-construction' | 'securite' | 'meublee' {
    if (!supplements) return 'tout';

    const hasConstruction = supplements.some(sup =>
      sup.nom && sup.nom.toLowerCase().includes('construction')
    );
    const hasSecurity = supplements.some(sup =>
      sup.nom && (sup.nom.toLowerCase().includes('sécurit') || sup.nom.toLowerCase().includes('securit'))
    );
    const hasFurniture = supplements.some(sup =>
      sup.nom && sup.nom.toLowerCase().includes('meublé')
    );

    if (hasConstruction) return 'en-construction';
    if (hasSecurity) return 'securite';
    if (hasFurniture) return 'meublee';

    return 'tout';
  }

  private getDefaultImage(): string {
    // Images par défaut depuis Pexels
    const defaultImages = [
      'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg',
      'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg',
      'https://images.pexels.com/photos/1449824/pexels-photo-1449824.jpeg',
      'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg',
      'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg'
    ];

    return defaultImages[Math.floor(Math.random() * defaultImages.length)];
  }
}
