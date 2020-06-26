import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import { IUser, INationality, ICity, IDomainOfExperience } from 'src/app/models/user';
import { StorageService } from 'src/app/core/storage/storage.service';
import { DetailsService } from 'src/app/providers/details.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  public user: IUser;

  // inputs values
  public tagInput: string;
  public tags: string[] = [];
  public countries: INationality[] = [];
  public cities: ICity[] = [];
  public domains: IDomainOfExperience[] = [];

  // selected and filtered
  public jobTitle: string = "";
  public country: INationality;
  public city: ICity;
  public filteredCities: ICity[] = [];
  public domain: IDomainOfExperience;

  constructor(
    private _authService: AuthService,
    private _storageService: StorageService,
    private _detailsService: DetailsService
    ) { }

  ngOnInit() {
    this._storageService.getUserData().then((data) => {
      this.user = data as IUser;
      this._prepareData();
      console.log(data);
    });
    
  }

  // 
  getCountries() {
    this._detailsService.getCountries()
    .subscribe((countries: any) => {
      this.countries = countries.results;
    });
  }

  getCities() {
    this._detailsService.getCities()
    .subscribe((cities: any) => {
      this.cities = cities.results;
    });
  }

  getDomains() {
    this._detailsService.getDomains()
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

  addTag() {
    if (!!this.tagInput && this.tagInput.length > 0) {
      this.tags.push(this.tagInput);
      this.tagInput = '';
    }
  }

  clearTag(value: string) {
    this.tags = this.tags.filter(tag => tag !== value);
  }

  private _getFilteredCities() {
    // By Country Selected (country id)
    this.filteredCities = this.cities.filter((city) => city.country === this.country.id);
  }


  clearAndReset() {
    // this.helper.closeMenu('filter'); 
    this._resetfilter();
  }

  private _prepareData() {
    this.country = this.user.nationality;
    this.city = this.user.city;
    this.domain = this.user.DOEX;
  }

  private _resetfilter() {}


}
