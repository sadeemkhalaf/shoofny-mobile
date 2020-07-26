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
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AppHelpersService } from 'src/app/core/utils/app-helpers.service';
import { IUserSubmit, IYOEX } from '../../details/edit-profile/edit-profile.page';
import { Router } from '@angular/router';

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
  public countries: INationality[] = [];
  public cities: ICity[] = [];
  public levels: IYOEX[] = [];
  public domains: IDomainOfExperience[] = [];
  public image: any;
  public imageUpdated: boolean = false;

  // selected and filtered
  public jobTitle: string;
  public country: INationality;
  public city: ICity;
  public level: IYOEX;
  public url: string;
  public filteredCities: ICity[] = [];
  public domain: IDomainOfExperience;

  private _subscriptions: Subscription[] = [];

  constructor(
    private _authService: AuthService,
    private _storageService: StorageService,
    private _imagePickerService: MediaPickerService,
    private _detailsService: DetailsService,
    private _helper: AppHelpersService,
    private _router: Router
  ) { }

  ngOnDestroy(): void {
    this._subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  ngOnInit() {
    this._authService.getUserProfile().pipe(first()).subscribe((user) => this.user = user );
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

  getLevels() {
    return this._detailsService.getYOEX().subscribe((levels: any) => {
      this.levels = levels.results;
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

  levelChange(event: any) {
    this.level = event.value;
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

  pickImage() {
    this._imagePickerService.selectImage().then(() =>
      this._imagePickerService.$selectedImage.pipe().subscribe((img) => {
        this.imageUpdated = true;
        this.image = img;
        document
          .getElementsByClassName('profile-picture-circle')
          .item(0)
          .setAttribute('style', `background-image: url('${this.image}')`);
      })
    );
  }

  submitData() {
    let userForm: IUserSubmit = new IUserSubmit();
    Object.assign(userForm, this.user);
    userForm.nationality = !!this.country ? this.country.id : null;
    userForm.city = !!this.city ? this.city.id : null;
    userForm.DOEX = !!this.domain ? this.domain.id : null;
    userForm.YOEX = !!this.level ? this.level.id : null;
    userForm.tags = this.tags;
    userForm.Public_Profile = this.url;
    const dob = new Date(this.user.DOB);
    userForm.DOB = `${dob.getUTCFullYear()}-${dob.getMonth()}-${dob.getDate()}`;
    if (this.imageUpdated) {
      userForm.picture = this.image; 
    }
    this._helper.showLoading();
    this._authService.updateUserProfile(userForm).pipe(first()).subscribe((result) => {
      this._helper.showToast('Information Saved', 'success');
      this._storageService.updateUserData(result);
      this._helper.hideLoading();
      this._router.navigate(['signup/profile/start-recording']);
    }, 
    error => {
      this._helper.showHttpErrorMessage(error);
      this._helper.hideLoading();
    });
  }

  private _getFilteredCities() {
    // By Country Selected (country id)
    this.filteredCities = this.cities.filter(
      (city) => city.country === this.country.id
    );
  }

  private _initializeUser() {
    this._subscriptions.push(this.getCities());
    this._subscriptions.push(this.getCities());
    this._subscriptions.push(this.getDomains());
    this._subscriptions.push(this.getLevels());
  }
}
