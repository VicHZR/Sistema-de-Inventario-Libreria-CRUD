import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../models/book.model';
import { API_CONFIG } from '../core/constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private readonly API_URL =
    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.books}`;

  constructor(private http: HttpClient) {}

  create(book: Book): Observable<Book> {
    return this.http.post<Book>(this.API_URL, book);
  }

  update(id: number, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.API_URL}/${id}`, book);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  search(
    title: string,
    minPages: number,
    page: number,
    size: number,
    sort: string
  ): Observable<any> {

    const params = new HttpParams()
      .set('title', title)
      .set('minPages', minPages)
      .set('page', page)
      .set('size', size)
      .set('sort', sort);

    return this.http.get<any>(`${this.API_URL}/search`, { params });
  }
}