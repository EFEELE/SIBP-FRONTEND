import { Injectable, PLATFORM_ID , Inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = environment.baseUrl;

  public token: string | null = null;
  public identity: any = null;

  constructor(private _http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

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
    if (isPlatformBrowser(this.platformId)) {
      const identity = JSON.parse(localStorage.getItem('identity') || '{}');
      
      // Solo asigna identity si tiene propiedades
      this.identity = identity && Object.keys(identity).length > 0 ? identity : null;
    
      
    } else {
      this.identity = null; // No crear un valor en SSR
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
