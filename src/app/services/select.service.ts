import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpRequest } from '../../../node_modules/@angular/common/http';
import { HttpHeaders } from '../../../node_modules/@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable()
export class SelectService {
  public baseUrl: string = environment.baseUrl;
  public token;
  public errorMessage;
  constructor(private _http: HttpClient) {
    this.baseUrl = environment.baseUrl;
  }

 
  getClasbis(token, page): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers
      .set('Content-Type', 'application/json')
      .set('Authorization', token);
    let options = {
      headers: headers
    }
    return this._http.get(this.baseUrl+'clasbi/'+ '1', options)
    .pipe(map((res) => res));
  }

  getSubcuentas(token, page): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers
      .set('Content-Type', 'application/json')
      .set('Authorization', token);
    let options = {
      headers: headers
    }
    return this._http.get(this.baseUrl+'subcuenta/'+ '1', options)
    .pipe(map((res) => res));
  }

  getClasificadores(token, page): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers
      .set('Content-Type', 'application/json')
      .set('Authorization', token);
    let options = {
      headers: headers
    }
    return this._http.get(this.baseUrl+'clasificador/'+ '1', options)
    .pipe(map((res) => res));
  }

  getAreas(token, page): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers
      .set('Content-Type', 'application/json')
      .set('Authorization', token);
    let options = {
      headers: headers
    }
    return this._http.get(this.baseUrl+'area/'+ '1', options)
    .pipe(map((res) => res));
  }


 




  
}
