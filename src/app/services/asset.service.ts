import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Asset } from '../models/asset';

@Injectable()
export class AssetService {
  public baseUrl: string = environment.baseUrl;
  public token;
  public errorMessage;

  public bienprev: any;

  constructor(private _http: HttpClient) {
    this.baseUrl = environment.baseUrl;

  }

  getAsset(id: string): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers
      .set('Content-Type', 'application/json');
    let options = {
      headers: headers
    }

    return this._http.get(this.baseUrl + 'bien/' + id, options)
      .pipe(map((res) => res));


  }







  getAssets(token?: string, page: number = 1, areafilter?: string): Observable<any> {
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', token);
    }

    let options = { headers: headers };

    // Construir la URL con parámetros de consulta
    let url = `${this.baseUrl}bienes?page=${page}`;
    if (areafilter) {
      url += `&areafilter=${areafilter}`;
    }

    return this._http.get(url, options).pipe(map((res) => res));
  }





  getAssetsCero(token?: string, page: number = 1): Observable<any> {
    let headers = new HttpHeaders();

    // Si se proporciona un token, configurar el encabezado de autorización
    if (token) {
      headers = headers.set('Authorization', token);
    }

    let options = { headers: headers };

    return this._http.get(`${this.baseUrl}bienes-cero/${page}`, options)
      .pipe(
        map((res) => res)
      );
  }



  addAsset(token, asset: Asset): Observable<any> {
    let json = JSON.stringify(asset);
    let params = json;
    let headers = new HttpHeaders();
    headers = headers
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this._http
      .post(this.baseUrl + 'bien', params, { headers: headers })
      .pipe(map((res) => res));
  }


  editAsset(token, id: string, asset: Asset): Observable<any> {
    let json = JSON.stringify(asset);
    let params = json;
    let headers = new HttpHeaders();
    headers = headers
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this._http
      .put(this.baseUrl + 'bien/' + id, params, { headers: headers })
      .pipe(map((res) => res));
  }

  deleteAsset(token, id: string): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers
      .set('Content-Type', 'application/json')
      .set('Authorization', token);
    let options = {
      headers: headers
    }
    return this._http
      .delete(this.baseUrl + 'bien/' + id, options)
      .pipe(map((res) => res));
  }


  async Toolformat64(event: any) {

    const proccess = await new Promise((resolve, reject) => {

      const render = new FileReader();

      // Manejo de error si no llega img
      render.readAsDataURL(event);

      render.onload = () => {

        resolve({
          base: render.result
        })
      };
      render.onerror = () => {
        reject({
          base: null
        })
      };

    }).then(e => e);
    return proccess;
  }

  // Método para agregar una nota a un asset
  // Método para agregar una nota a un asset
  addNoteToAsset(token: string, assetId: string, content: string): Observable<any> {
    const params = { content }; // Usa 'content' para coincidir con el backend
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this._http
      .post(this.baseUrl + `bien/${assetId}/note`, params, { headers })
      .pipe(map((res) => res));
  }


  // Método para eliminar una nota de un asset
  deleteNoteFromAsset(token, assetId: string, noteId: string): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers
      .set('Content-Type', 'application/json')
      .set('Authorization', token);

    return this._http
      .delete(this.baseUrl + `bien/${assetId}/note/${noteId}`, { headers: headers })
      .pipe(map((res) => res));
  }


}

