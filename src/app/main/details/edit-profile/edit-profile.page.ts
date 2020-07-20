import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import { IUser, INationality, ICity, IDomainOfExperience, IYearsOfExperience } from 'src/app/models/user';
import { StorageService } from 'src/app/core/storage/storage.service';
import { MediaPickerService } from 'src/app/providers/media-picker.service';
import { AppHelpersService } from 'src/app/core/utils/app-helpers.service';
import { WebView } from '@ionic-native/ionic-webview';
import { DomController } from '@ionic/angular';
import { first } from 'rxjs/operators';

export class IUserSubmit {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  DOB: string;
  picture: any;
  video: string;
  Private: boolean;
  date_joined: Date;
  is_seeker: boolean;
  is_active: boolean;
  Public_Profile: string[];
  rating_avaerage: number;
  profile_views: number;
  gender: string;
  Job_in_City: number;
  city: number;
  nationality: number;
  DOEX: number;
  YOEX: number;
  tags: string[];

}
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
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
  public imageUpdated: boolean = false;

  // selected and filtered
  public jobTitle: string = "";
  public country: INationality;
  public city: ICity;
  public filteredCities: ICity[] = [];
  public domain: IDomainOfExperience;
  public level: IYearsOfExperience ;
  public urls: string[] = [];
  public url: string;

  constructor(
    public helper: AppHelpersService,
    private _authService: AuthService,
    private domCtrl: DomController,
    private _storageService: StorageService,
    private _imagePickerService: MediaPickerService,
    private _mediaService: MediaPickerService
  ) { }

  ngOnInit() {
    this._storageService.getUserData().then((data) => {
      this.user = data as IUser;
      this.tags = !!this.user.tags ? this.user.tags : [];
      this.urls = !!this.user.Public_Profile ? this.user.Public_Profile  : []; 
      this._prepareData();
      this.getDomains();
      this.getCountries();
      this.getCities();
      this.getLevels();
    });
  }

  ionViewDidLoad() { }

  getCountries() {
    this._storageService.getLocalData('countries')
   .then((countries) => {
      this.countries = countries;
    });
  }

  getCities() {
    this._storageService.getLocalData('cities')
    .then((cities: any) => {
      this.cities = cities;
    });
  }

  getDomains() {
    this._storageService.getLocalData('domains')
    .then((domains: any) => {
      this.domains = domains;
    });
  }

  getLevels() {
    this._storageService.getLocalData('levels')
    .then((levels: any) => {
      this.levels = levels;
    });
  }

  countryChange(event: any) {
    this.country = event.value;
    console.log(this.country);
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
    this.tags = this.tags.filter(tag => tag !== value);
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
      this._imagePickerService.$selectedImage.pipe(first()).subscribe((img) => {
        this.imageUpdated = true;
        this.image = img;
        document
          .getElementsByClassName('profile-picture-circle')
          .item(0)
          .setAttribute('style', `background-image: url('${this.image}')`);
      })
    );
  }

  public startRecording() {
    this._mediaService.selectVideo().then(() => {
      this._mediaService.$selectedVideo.pipe(first()).subscribe((vid) => {
        if (!!vid) {
          this.enablePlay = true;
        } else {
          this.enablePlay = false;
        }
      });
    });
  }
  
  submitData() {
    let userForm: IUserSubmit = new IUserSubmit();
    Object.assign(userForm, this.user);
    userForm.nationality = !!this.country ? this.country.id : null;
    userForm.city = !!this.city ? this.city.id : null;
    userForm.DOEX = !!this.domain ? this.domain.id : null;
    userForm.YOEX = !!this.level ? this.level.id : null;
    userForm.tags = this.tags;
    userForm.Public_Profile = this.urls.length > 0 ? this.urls : null;
    const dob = new Date(this.user.DOB);
    userForm.DOB = `${dob.getUTCFullYear()}-${dob.getMonth()}-${dob.getDate()}`;
    if (this.imageUpdated) {
      userForm.picture = this.image; 
    }
    this.helper.showLoading();
    this._authService.updateUserProfile(userForm).pipe(first()).subscribe((result) => {
      this.helper.showToast('Changes Saved');
      this._storageService.updateUserData(result);
      this.helper.hideLoading();
    }, 
    error => {
      this.helper.showHttpErrorMessage(error);
      this.helper.hideLoading();
    });
  }

  uploadVideo() {
    this._mediaService.uploadVideo('aboutme');
  }

  private _getFilteredCities() {
    // By Country Selected (country id)
    this.filteredCities = this.cities.filter((city) => city.country === this.country.id);
  }

  private _prepareData() {
    this.country = !!this.user.nationality.id ? this.user.nationality as INationality : null;
    this.city = !!this.user.city ? this.user.city as ICity : null;
    this.domain = this.user.DOEX as IDomainOfExperience;
    this.level = !!this.user.YOEX ? this.user.YOEX as IYearsOfExperience : null;
  }
}
