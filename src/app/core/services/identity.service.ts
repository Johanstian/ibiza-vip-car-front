import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IdentityService {

  @Output() name: EventEmitter<any> = new EventEmitter();
  @Output() login: EventEmitter<any> = new EventEmitter();
  private loggedIn = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedIn.asObservable();

  // baseUrl = 'http://localhost:3000/api/user';
  // baseUrl = environment.localUrl + '/user';
  baseUrl = '';
  renderUrl = environment.renderUrl + '/api/user';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private httpClient: HttpClient) {

  }

  signUp(request: any): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + this.renderUrl + '/sign-up', request);
  }

  signIn(request: any): Observable<any> {
    return this.httpClient.post<any>(this.baseUrl + this.renderUrl + '/sign-in', request);
  }

  getUserById(id: any): Observable<any> {
    return this.httpClient.get<any>(this.baseUrl + this.renderUrl  + '/get-user/' + id)
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

  handleLoginSuccess() {
    this.login.emit(true);
  }

  
}