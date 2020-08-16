import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import { IUser, INationality, ICity, IDomainOfExperience, IYearsOfExperience } from 'src/app/models/user';
import { StorageService } from 'src/app/core/storage/storage.service';
import { MediaPickerService } from 'src/app/providers/media-picker.service';
import { AppHelpersService } from 'src/app/core/utils/app-helpers.service';
import { first } from 'rxjs/operators';
import { ICountryCode } from 'src/app/models/Job';
import { DetailsService } from 'src/app/providers/details.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

export class IUserSubmit {
  id: number;
  email: string;
  name: string;
  DOB: string;
  picture: any;
  video: string;
  Private: boolean;
  date_joined: Date;
  is_seeker: boolean;
  is_active: boolean;
  Public_Profile: string;
  rating_avaerage: number;
  profile_views: number;
  gender: string;
  Job_in_City: number;
  city: number;
  nationality: number;
  DOEX: number;
  YOEX: number;
  tags: string[];
  phone: string;
}

export interface IYOEX {
  id: number;
  year: string;
}

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit, OnDestroy {
  public user: IUser;
  public enablePlay: boolean;

  // inputs values
  public tagInput: string;
  public tags: string[] = [];
  public countries: INationality[] = [];
  public cities: ICity[] = [];
  public domains: IDomainOfExperience[] = [];
  public image: any;
  public levels: IYearsOfExperience[] = [];
  public years: IYOEX[] = [];
  public imageUpdated: boolean = false;
  public dobChanged: boolean;
  public countryCodes: ICountryCode[] = [];
  public countryCode: ICountryCode;
  public mobile: string;

  private _countryCodes: ICountryCode[] = [];

  // selected and filtered
  public jobTitle: string = "";
  public country: INationality;
  public city: ICity;
  public filteredCities: ICity[] = [];
  public domain: IDomainOfExperience;
  public level: IYearsOfExperience;
  public yoex: IYOEX;
  public urls: string[] = [];
  public url: string;

  navigationSubscription: Subscription;

  constructor(
    public helper: AppHelpersService,
    private _authService: AuthService,
    private _storageService: StorageService,
    private _imagePickerService: MediaPickerService,
    private _detailsService: DetailsService,
    private _route: Router
  ) {

  }

  ngOnInit() {
    this.navigationSubscription = this._route.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e) {
        this._loadData();
        this._loadPicture();
        window.onload = () => {
          this._loadPicture();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.navigationSubscription.unsubscribe();
  }

  getCode(dialCode: string) {
    return this.countryCodes.filter((code) => !!code.dial_code && code.dial_code.includes(dialCode.split('-')[0]));
  }

  async getCountries() {
    this.countries = await this._storageService.getLocalData('countries');
  }

  async getCities() {
    this.cities = await this._storageService.getLocalData('cities');
  }

  async getDomains() {
    this.domains = await this._storageService.getLocalData('domains');

  }

  async getLevels() {
    this.levels = await this._storageService.getLocalData('levels');
  }

  getYearsOfExperience() {
    this._detailsService.$YOEX
      .subscribe((levels: any) => {
        this.years = levels as IYOEX[];
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

  yearChange(event: any) {
    this.yoex = event.value;
  }

  domainChange(event: any) {
    this.domain = event.value;
  }

  dateChanged(event: any) {
    this.dobChanged = true;
    console.log('changed!')
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

  readCountryCodes() {
    this._detailsService.getCountriesDetails()
      .then((results) => results.json())
      .then((data) => {
        this._countryCodes = data as ICountryCode[];
        this.countryCodes = data as ICountryCode[];
        this.countryCode = this.getCode(this.user.phone)[0];
      });
  }

  countryCodeChange(event) {
    this.countryCode = event.value;
  }

  countryCodeSearch(event) {
    this.countryCodes = this._countryCodes.filter(data =>
      !!data.dial_code && data.dial_code.includes(event.text)
      || !!data.name && data.name.toLocaleLowerCase().includes(event.text.toLocaleLowerCase()));
  }

  submitData() {
    let userForm: IUserSubmit = new IUserSubmit();
    Object.assign(userForm, this.user);
    userForm.nationality = !!this.country ? this.country.id : null;
    userForm.city = !!this.city ? this.city.id : null;
    userForm.DOEX = !!this.domain ? this.domain.id : null;
    userForm.YOEX = !!this.yoex ? this.yoex.id : null;
    userForm.tags = this.tags;
    userForm.Public_Profile = this.url;
    userForm.phone = `${this.countryCode.dial_code}-${this.mobile}`
    // if (this.dobChanged) {
      const dob = new Date(this.user.DOB);
      userForm.DOB = `${dob.getUTCFullYear()}-${dob.getMonth()}-${dob.getDate()}`;
      console.log(`userForm.DOB: ${userForm.DOB}`);
    // }
    if (this.imageUpdated) {
      userForm.picture = this.image;
    }
    this.helper.showLoading();

    this._authService.updateUserProfile(userForm).pipe(first()).subscribe((result) => {
      this.helper.showToast('Changes Saved', 'success');
      this._storageService.updateUserData(result);
      this.helper.hideLoading();
    },
      error => {
        this.helper.showHttpErrorMessage(error);
        this.helper.hideLoading();
      });
  }

  clearImage() {
    this.imageUpdated = true;
    this.image = null;
  }

  private _getFilteredCities() {
    // By Country Selected (country id)
    this.filteredCities = this.cities.filter((city) => city.country === this.country.id);
  }

  private _prepareData() {
    this.readCountryCodes();
    this.tags = !!this.user.tags ? this.user.tags : [];
    this.country = !!this.user.nationality ? this.user.nationality as INationality : null;
    this.city = !!this.user.city ? this.user.city as ICity : null;
    this.domain = this.user.DOEX as IDomainOfExperience;
    this.yoex = !!this.user.YOEX ? this.user.YOEX as IYOEX : null;
    this.url = this.user.Public_Profile;
    this.image = this.user.picture;
    this.mobile = !!this.user.phone.split('-')[1] ? this.user.phone.split('-')[1] : this.user.phone;
  }

  private _loadPicture() {
    this._storageService.getUserData().then((data) => {
      this.user = data as IUser;
      const pictureUrl =
        !!this.user.picture && this.user.picture.length > 0
          ? this.user.picture
          : './../../../assets/placeholder-img.png';
      document
        .getElementById('profileCircle')
        .setAttribute('style', `background-image: url("${pictureUrl}")`);
    });
  }

  private _loadData() {
    this._storageService.getUserData()
      .then((user) => {
        this.user = user as IUser;
        this._prepareData();
        this.getDomains();
        this.getCountries();
        this.getCities();
        this.getLevels();
        this.getYearsOfExperience();
        if (!!this.user.picture && this.user.picture.length > 0) {
          window.onload = () => {
            document
              .getElementById('profileCircle')
              .setAttribute('style', `background-image: url("${this.user.picture}")`);
          };
        }
      }, error => this.helper.showToast(error)
      );
  }
}
