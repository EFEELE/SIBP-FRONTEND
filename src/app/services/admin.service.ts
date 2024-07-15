import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = environment.baseUrl;

  public token: string | null = null;
  public identity: any = null;

  constructor(private _http: HttpClient) {}

  signup(admin_to_login: any, gethash: string | null = null): Observable<any> {
    if (gethash != null) {
      admin_to_login.gethash = gethash;
    }

    const json = JSON.stringify(admin_to_login);
    const params = json;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http
      .post(this.baseUrl + 'login', params, { headers: headers })
      .pipe(map((res) => res));
  }

  getIdentity() {
    const identity = JSON.parse(localStorage.getItem('identity') || '{}');
    if (identity && identity !== 'undefined') {
      this.identity = identity;
    } else {
      this.identity = null;
    }

    return this.identity;
  }

  getToken() {
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined') {
      this.token = token;
    } else {
      this.token = null;
    }

    return this.token;
  }
}
