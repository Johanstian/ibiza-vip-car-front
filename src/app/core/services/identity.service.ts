import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {

  @Output() name: EventEmitter<any> = new EventEmitter();

  baseUrl = 'http://localhost:3000/api/user';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient) {

  }

  signUp(request: any): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + '/sign-up', request);
  }

  signIn(request: any): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + '/sign-in', request);
  }

  getUserById(id: any): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + '/get-user/' + id)
  }

  updateUser(id: number, request: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.httpClient.put<any>(this.baseUrl + '/update-user/' + id, request, { headers });
  }

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  
}