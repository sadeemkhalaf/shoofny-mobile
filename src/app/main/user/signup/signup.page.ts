import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppHelpersService } from 'src/app/core/utils/app-helpers.service';
import { AuthService } from 'src/app/providers/auth.service';
import { DetailsService } from 'src/app/providers/details.service';
import { first } from 'rxjs/operators';

export class RegisterUser {
  email: string;
  password: string;
  password_confirm: string;
  name: string;
  is_seeker: number;
}

export interface ICountryCode {
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
  public register: RegisterUser = new RegisterUser();

  constructor(
    public formBuilder: FormBuilder,
    public helper: AppHelpersService,
    private _auth: AuthService,
    private _detailsService: DetailsService,
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      name: ['']
    }, { Validator: this.checkPasswords });
  }

  get errorControl() {
    return this.form.controls;
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
      this.register.name = this.form.get('name').value;
      this.register.is_seeker = 1;
      this._auth.registerUser(this.register).pipe(first()).subscribe((res) => {
        this._auth.login(this.register.email, this.register.password, false);
      }, error => {
        if (error.toString().includes('500')) {
          this.helper.showToast('server error!');
        } else {
          this.helper.showToast('something went wrong!');
        }
      })
    }
  }

}
