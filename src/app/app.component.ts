import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './providers/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageService } from './core/storage/storage.service';
import { AppHelpersService } from './core/utils/app-helpers.service';
import { DetailsService } from './providers/details.service';
import { INationality, ICity, IDomainOfExperience } from './models/user';
import { DataService } from './providers/data.service';
import { Location } from '@angular/common';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  //TODO: move flter items to another component later
  public countries: INationality[] = [];
  public cities: ICity[] = [];
  public domains: IDomainOfExperience[] = [];
  public tags: string[] = [];

  // selected and filtered
  public jobTitle: string = "";
  public country: INationality;
  public city: ICity;
  public filteredCities: ICity[] = [];
  public domain: IDomainOfExperience;
  public tagInput: string;

  constructor(
    public helper: AppHelpersService,
    private _storage: StorageService,
    private _route: Router,
    private _router: ActivatedRoute,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private _auth: AuthService,
    private _location: Location,
    private _detailsService: DetailsService,
    private _dataService: DataService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this._storage.getAuthToken().then((loggedIn) => {
        if (!!loggedIn) {
          console.log('hello home!')
          this._route.parseUrl('/home');
          this.getCountries();
          this.getCities();
          this.getDomains();
        } else {
          this._route.parseUrl('/login');
        }
      });
    });
  }


  public logout() {
    this._auth.logout().then(() => {
      this._route.navigate(['/login']);
      this.helper.closeMenu('menu');
    }, error => console.error(error));
  }

  getCountries() {
    this._detailsService.getCountries()
    .pipe(take(1))
    .subscribe((countries: any) => {
      this.countries = countries.results;
    });
  }

  getCities() {
    this._detailsService.getCities()
    .pipe(take(1))
    .subscribe((cities: any) => {
      this.cities = cities.results;
    });
  }

  getDomains() {
    this._detailsService.getDomains()
    .pipe(take(1))
    .subscribe((domains: any) => {
      this.domains = domains.results;
    });
  }

  countryChange(event: any) {
    this.country = event.value;
    this.country.id = Number(this.country.url.split('/')[7]);
    this._getFilteredCities();
  }

  cityChange(event: any) {
    this.city = event.value;
  }

  domainChange(event: any) {
    this.domain = event.value;
  }

  addTag(value: string) {
    if (!!value && value.length > 0) {
      this.tags.push(value);
      this.tagInput = '';
    }
  }

  clearTag(value: string) {
    this.tags = this.tags.filter(tag => tag !== value);
  }

  filterJobs() {
    const config = this._prepareData();
    // route with config data to job list page
    this._dataService.setData(config);
    this._route.navigate(['home/jobs']);
    this.helper.closeMenu('filter'); 
  }

  clearAndReset() {
    // this.helper.closeMenu('filter'); 
    this._resetfilter();
  }

  private _getFilteredCities() {
    // By Country Selected (country id)
    this.filteredCities = this.cities.filter((city) => city.country === this.country.id);
  }

  private _prepareData() {
    let filterConfig: any = {};
    if(!!this.country) {
      filterConfig.country = this.country.id;
    }
    if(!!this.city) {
      filterConfig.city = this.city.id;
    }
    if(!!this.domain) {
      filterConfig.domain = this.domain.id;
    }
    if(!!this.city) {
      filterConfig.city = this.city.id;
    }
    filterConfig.job_title = this.jobTitle;
    filterConfig.tags = this.tags;

    return filterConfig;
  }

  private _resetfilter() {
    this.city = null;
    this.country = null;
    this.tags = [];
    this.jobTitle = '';
    this.domain = null;
    this._dataService.clearData();
  }

}
