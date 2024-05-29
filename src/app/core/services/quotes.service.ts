import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IQuotes } from 'app/models';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuotesService {
  constructor(private http: HttpClient) {}
  quotableApi = environment.quotableApi;

  getQuotes(): Observable<IQuotes[]> {
    return this.http.get<IQuotes[]>(`${this.quotableApi}quotes/random?limit=4`);
  }
}
