import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import { IUser, INationality, ICity, IDomainOfExperience } from 'src/app/models/user';
import { StorageService } from 'src/app/core/storage/storage.service';
import { DetailsService } from 'src/app/providers/details.service';
import { MediaPickerService } from 'src/app/providers/media-picker.service';
import { take } from 'rxjs/operators';
import { AppHelpersService } from 'src/app/core/utils/app-helpers.service';
import { WebView } from '@ionic-native/ionic-webview';

export class IUserSubmit {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  DOB: string;
  picture: string;
  video: string;
  Private: boolean;
  date_joined: Date;
  is_seeker: boolean;
  is_active: boolean;
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
  public imageUpdated: boolean = false;

  // selected and filtered
  public jobTitle: string = "";
  public country: INationality;
  public city: ICity;
  public filteredCities: ICity[] = [];
  public domain: IDomainOfExperience;

  constructor(
    public helper: AppHelpersService,
    private _authService: AuthService,
    private _storageService: StorageService,
    private _detailsService: DetailsService,
    private _imagePickerService: MediaPickerService,
    private _mediaService: MediaPickerService
  ) { }

  ngOnInit() {
    this._storageService.getUserData().then((data) => {
      this.user = data as IUser;
      this._prepareData();
      this.getDomains();
      this.getCountries();
      this.getCities();
    });
  }

  ionViewDidLoad() { }

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
        this.filteredCities = this.cities;
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
    console.log(this.country);
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

  pickImage() {
    this._imagePickerService.selectImage().then(() =>
      this._imagePickerService.$selectedImage.pipe(take(1)).subscribe((img) => {
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
      this._mediaService.$selectedVideo.pipe(take(1)).subscribe((vid) => {
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
    userForm.nationality = this.country.id;
    userForm.city = this.city.id;
    userForm.DOEX = this.domain.id;
    userForm.YOEX = 1; // TODO: replace with actual values
    const dob = new Date(this.user.DOB);
    userForm.DOB = `${dob.getUTCFullYear()}-${dob.getMonth()}-${dob.getDate()}`;
    if (this.imageUpdated) {
      userForm.picture = this.image; 
    }
    this._authService.updateUserProfile(userForm).subscribe((result) => {
      this.helper.showToast('Changes Saved');
      this._storageService.updateUserData(result);
    }, 
    error => this.helper.showToast('Something went wrong!'));
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
  }
}
