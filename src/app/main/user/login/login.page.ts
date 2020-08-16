import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppHelpersService } from 'src/app/core/utils/app-helpers.service';
import { AuthService } from 'src/app/providers/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/core/storage/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  public form: FormGroup;
  public isSubmitted = false;

  constructor(
    public formBuilder: FormBuilder,
    public helper: AppHelpersService,
    private _route: Router,
    private _storage: StorageService,
    private _auth: AuthService) {
  }

  ngOnDestroy(): void {
    // throw new Error("Method not implemented.");
  }

  ngOnInit() {
    this._checkLoggedIn();
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(email: string, password: string) {
    this._auth.login(email, password, true);
  }

  get errorControl() {
    return this.form.controls;
  }

  onSubmitForm() {
    this.isSubmitted = true;
    if (this.form.valid) {
      const email = this.form.get('email').value;
      const password = this.form.get('password').value;
      this.login(email, password);
    }
  }

  goToResetPassword() {
    this._route.navigate(["/reset-password"], { replaceUrl: true })
  }

  private async _checkLoggedIn() {
    const data = await this._storage.getUserData().then((data) => {
      if (!!data) {
        this._route.navigate(['/home']);
      }
    }, error => {
      // just do nothing 
    });

  }
}
