import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Author } from '../models/author.model';
import { API_CONFIG } from '../core/constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  private readonly API_URL =
    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.authors}`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Author[]> {
    return this.http.get<Author[]>(this.API_URL);
  }
}