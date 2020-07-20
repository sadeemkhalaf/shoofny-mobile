import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  IUser,
  INationality,
  ICity,
  IDomainOfExperience,
  IYearsOfExperience,
} from 'src/app/models/user';
import { AuthService } from 'src/app/providers/auth.service';
import { StorageService } from 'src/app/core/storage/storage.service';
import { DetailsService } from 'src/app/providers/details.service';
import { MediaPickerService } from 'src/app/providers/media-picker.service';
import { take } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-fill-new-profile',
  templateUrl: './fill-new-profile.page.html',
  styleUrls: ['./fill-new-profile.page.scss'],
})
export class FillNewProfilePage implements OnInit, OnDestroy {
  public user: IUser = new IUser();

  // inputs values
  public tagInput: string;
  public tags: string[] = [];
  public urls: string[] = [];
  public countries: INationality[] = [];
  public cities: ICity[] = [];
  public domains: IDomainOfExperience[] = [];
  public image: any;

  // selected and filtered
  public jobTitle: string;
  public country: INationality;
  public city: ICity;
  public url: string;
  public filteredCities: ICity[] = [];
  public domain: IDomainOfExperience;

  private _subscriptions: Subscription[] = [];

  constructor(
    private _authService: AuthService,
    private _storageService: StorageService,
    private _imagePickerService: MediaPickerService,
    private _detailsService: DetailsService
  ) { }

  ngOnDestroy(): void {
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  ngOnInit() {
    this._initializeUser();
  }

  //
  getCountries() {
    return this._detailsService.getCountries().subscribe((countries: any) => {
      this.countries = countries.results;
    });
  }

  getCities() {
    return this._detailsService.getCities().subscribe((cities: any) => {
      this.cities = cities.results;
    });
  }

  getDomains() {
    return this._detailsService.getDomains().subscribe((domains: any) => {
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

  addTag() {
    if (!!this.tagInput && this.tagInput.length > 0) {
      this.tags.push(this.tagInput);
      this.tagInput = '';
    }
  }

  clearTag(value: string) {
    this.tags = this.tags.filter((tag) => tag !== value);
  }

  addUrl() {
    if (!!this.url && this.url.length > 0) {
      this.urls.push(this.url);
      this.url = '';
    }
  }

  clearUrl(value: string) {
    this.urls = this.urls.filter((url) => url !== value);
  }

  pickImage() {
    this._imagePickerService.selectImage().then(() =>
      this._imagePickerService.$selectedImage.pipe().subscribe((img) => {
        this.image = img;
        document
          .getElementsByClassName('profile-picture-circle')
          .item(0)
          .setAttribute('style', `background-image: url('${this.image}')`);
      })
    );
  }

  private _getFilteredCities() {
    // By Country Selected (country id)
    this.filteredCities = this.cities.filter(
      (city) => city.country === this.country.id
    );
  }

  private _prepareData() {
    this.country = this.user.nationality;
    this.city = this.user.city;
    this.domain = this.user.DOEX;
  }

  private _initializeUser() {
    this.user.YOEX = new IYearsOfExperience();
    this._subscriptions.push(this.getCities());
    this._subscriptions.push(this.getCities());
    this._subscriptions.push(this.getDomains());
  }
}
