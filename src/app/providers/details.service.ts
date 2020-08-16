import { Injectable } from '@angular/core';
import { AuthHttp } from '../core/auth-http/auth-http.service';
import { INationality, ICity, IDomainOfExperience, IYearsOfExperience } from '../models/user';
import { ReplaySubject } from 'rxjs';
import { IYOEX } from '../main/details/edit-profile/edit-profile.page';
import { ICountryCode } from '../models/Job';
import { first } from 'rxjs/operators';
import { StorageService } from '../core/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class DetailsService {

  public $countries: ReplaySubject<INationality[]> = new ReplaySubject();
  public $cities: ReplaySubject<ICity[]> = new ReplaySubject();
  public $domains: ReplaySubject<IDomainOfExperience[]> = new ReplaySubject();
  public $levels: ReplaySubject<IYearsOfExperience[]> = new ReplaySubject();
  public $YOEX: ReplaySubject<IYOEX[]> = new ReplaySubject();
  public $countryCode: ReplaySubject<ICountryCode[]> = new ReplaySubject();

  constructor(
    private _http: AuthHttp,
    private _storage: StorageService) {
    this._storage.getAuthToken().then((loggedIn) => {
      if (!!loggedIn) {
        this.getCities();
        this.getCountries();
        this.getDomains();
        this.getLevels();
        this.getYOEX();
      }
    });

  }

  private getCountries() {
    return this._http.get('/api/countries/').pipe(first())
      .subscribe((data: any) => {
        this.$countries.next(data.results);
        this._storage.setLocalData('countries', data.results);
      });
  }
  private getCities() {
    return this._http.get('/api/cities/').pipe(first())
      .subscribe((data: any) => {
        this.$cities.next(data.results);
        this._storage.setLocalData('cities', data.results);
      });
  }

  private getDomains() {
    return this._http.get('/api/domains/').pipe(first())
      .subscribe((data: any) => {
        this.$domains.next(data.results);
        this._storage.setLocalData('domains', data.results);
      });
  }

  private getLevels() {
    return this._http.get('/api/level/').pipe(first())
      .subscribe((data: any) => {
        this.$levels.next(data.results);
        this._storage.setLocalData('levels', data.results);
      });
  }

  private getYOEX() {
    return this._http.get('/api/yoex/').pipe(first())
      .subscribe((data: any) => {
        this.$YOEX.next(data.results);
        this._storage.setLocalData('yoex', data.results);
      });
  }

  getCountriesDetails() {
    return fetch('../../../../assets/data/CountryCodes.json');
  }
}
