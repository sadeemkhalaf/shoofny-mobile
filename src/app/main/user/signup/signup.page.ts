import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppHelpersService } from 'src/app/core/utils/app-helpers.service';
import { AuthService } from 'src/app/providers/auth.service';
import { DetailsService } from 'src/app/providers/details.service';

interface IRegisterUser {
  first_name: string;
  last_name: string;
  code: string;
  mobile: string;
  email: string;
  password: string;
  password_confirm: string;
  userName: string;
  is_seeker: number;
}

interface ICountryCode {
  code: string;
  dial_code: string;
  name: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  public form: FormGroup;
  public isSubmitted = false;
  public register: IRegisterUser;
  public countryCodes: ICountryCode[] = [];
  public countryCode: ICountryCode;

  private _countryCodes: ICountryCode[] = [];

  constructor(
    public formBuilder: FormBuilder,
    public helper: AppHelpersService,
    private _auth: AuthService,
    private _detailsService: DetailsService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['',  [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      userName: ['']
    }, {Validator: this.checkPasswords});
    this.readCountryCodes();
  }

  get errorControl() {
    return this.form.controls;
  }

  countryCodeChange(event) {
    console.log(event.value);
    this.countryCode = event.value;
  }

  countryCodeSearch(event) {
    this.countryCodes = this._countryCodes.filter(data => 
      !!data.dial_code && data.dial_code.includes(event.text) 
      || !!data.dial_code && data.name.includes(event.text));
  }

  readCountryCodes() {
    this._detailsService.getCountriesDetails()
    .then((results) => results.json())
    .then((data) => {
      this._countryCodes = data as ICountryCode[];
      this.countryCodes = data as ICountryCode[];
    });
  }

  checkPasswords(group: FormGroup) {
  const pass = group.get('password').value;
  const confirmPass = group.get('confirmPassword').value;
  return pass === confirmPass ? null : { notSame: true }     
}

  get f() { return this.form.controls; }

  onSubmitForm() {
    this.isSubmitted = true;
    if (this.form.valid) {
      this.register.email = this.form.get('email').value;
      this.register.password = this.form.get('password').value;
      this.register.password_confirm = this.form.get('confirmPassword').value;
      this.register.userName = this.form.get('userName').value;
    }
  }

}
