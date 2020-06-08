import { Component, OnInit } from '@angular/core';
import { AppHelpersService } from 'src/app/core/utils/app-helpers.service';
import { AuthService } from 'src/app/providers/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public form: FormGroup;
  public isSubmitted = false;

  constructor(
    public formBuilder: FormBuilder,
    public helper: AppHelpersService,
    private _auth: AuthService) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]]
    });
  }

  get errorControl() {
    return this.form.controls;
  }

  login(email, password) {
    this._auth.login(email, password);
  }

  onSubmitForm() {
    this.isSubmitted = true;
    if (this.form.valid) {
      const email = this.form.get('email').value;
      const password = this.form.get('password').value
      this.login(email, password);
      // this.login('admin@admin.com', 'admin');
    }
  }

}
