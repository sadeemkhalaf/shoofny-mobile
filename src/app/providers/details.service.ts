import { Injectable } from '@angular/core';
import { AuthHttp } from '../core/auth-http/auth-http.service';
import { NetworkService } from '../core/utils/network.service';
import { StorageService } from '../core/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class DetailsService {

  constructor(private _http: AuthHttp,
    private _storageService: StorageService) { }

    getCountries() {
      return this._http.get('/cities_light/api/countries');
    }
    getCities() {
      return this._http.get('/cities_light/api/cities');
    }
    getDomains() {
      return this._http.get('/api/domains');
    }

}
