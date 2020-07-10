import { Injectable } from '@angular/core';
import { AuthHttp } from '../core/auth-http/auth-http.service';
import { HttpClient, HttpBackend } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DetailsService {

  constructor(private _http: AuthHttp) { }

    getCountries() {
      return this._http.get('/cities_light/api/countries/');
    }
    getCities() {
      return this._http.get('/cities_light/api/cities/');
    }
    getDomains() {
      return this._http.get('/api/domains/');
    }

    getCountriesDetails() {
      return fetch('../../../../assets/data/CountryCodes.json');
    }

}
