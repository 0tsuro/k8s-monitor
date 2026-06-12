import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KubernetesService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getPods(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/pods`);
  }

  getServices(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/services`);
  }

  getDeployments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/deployments`);
  }

  getNodes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/nodes`);
  }
}